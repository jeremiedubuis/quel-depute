import { CanvasRenderingContext2D, createCanvas, Image, registerFont } from 'canvas';
import type { Depute } from '../types/deputeTypes';
import path from 'path';
import { loadFile } from './loadFIle';
import { deputePicturePath } from '../scripts/config';

const width = 1200;
const halfWidth = width * 0.5;
const height = 630;

const logoWidth = 180;
const logoHeight = 70;

const loadPicture = (src: string): Promise<Image> =>
    new Promise(async (resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        const file = await loadFile(src);
        img.onerror = (err) => reject(err);
        img.src = file;
    });

export const circularImage = (img: Image) => {
    const canvas = createCanvas(150, 150);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 150, 150);
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(img, 0, -21, 150, 192);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.arc(75, 75, 75, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
    return canvas;
};

const numberToSuffix = (number: number) => (number === 1 ? 'ère' : 'ème');

const colors = { blue: '#1d3058', red: '#f34235', green: '#6dbe70', yellow: '#ff7e00' };

const drawScore = (
    type: string,
    ctx: CanvasRenderingContext2D,
    value: number,
    offset: number = 0,
    inverse?: boolean
) => {
    const scoreLeft = 350;
    const scoreTop = 160 + offset * 50;
    const scoreBarLeft = 620;
    const scoreWidth = 500;
    const scoreHeight = 30;

    ctx.fillStyle = colors.blue;
    ctx.fillText(type, scoreLeft, scoreTop + 25);

    ctx.fillRect(scoreBarLeft, scoreTop, scoreWidth, scoreHeight);
    const success = inverse ? colors.red : colors.green;
    const failure = inverse ? colors.green : colors.red;
    ctx.fillStyle = value >= 75 ? success : value < 25 ? failure : colors.yellow;
    ctx.fillRect(scoreBarLeft, scoreTop, scoreWidth * (value / 100), scoreHeight);
};

export const getDeputeCard = async (depute: Depute) => {
    await registerFont(path.join(process.cwd(), '/public/fonts/Montserrat-Medium.ttf'), {
        family: 'Montserrat'
    });
    await registerFont(path.join(process.cwd(), '/public/fonts/Montserrat-Bold.ttf'), {
        family: 'Montserrat',
        weight: 'bold'
    });
    await registerFont(path.join(process.cwd(), '/public/fonts/Montserrat-Thin.ttf'), {
        family: 'Montserrat',
        weight: 'light'
    });
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    try {
        const logo = await loadPicture('/public/img/logo-light.png');

        ctx.fillStyle = 'white';

        ctx.rect(0, 0, width, height);
        ctx.fill();

        // logo
        const logoLeft = halfWidth - logoWidth * 0.5;
        const logoCenterHeight = logoHeight * 0.5 + 10;
        ctx.drawImage(logo, logoLeft, 10, logoWidth, logoHeight);

        // frame
        ctx.beginPath();
        ctx.moveTo(logoLeft - 10, logoCenterHeight);
        ctx.lineTo(20, logoCenterHeight);
        ctx.lineTo(20, height - 20);
        ctx.lineTo(width - 20, height - 20);
        ctx.lineTo(width - 20, logoCenterHeight);
        ctx.lineTo(logoLeft + logoWidth + 20, logoCenterHeight);
        ctx.strokeStyle = colors.blue;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        const pictureSize = 200;
        const pictureX = pictureSize;
        const pictureY = 250;
        //picture
        console.log(path.join(process.cwd(), deputePicturePath + depute.slug + '.jpg'));
        const picture = await loadPicture(deputePicturePath + depute.slug + '.jpg');
        ctx.drawImage(
            circularImage(picture),
            pictureX - pictureSize * 0.5,
            pictureY - pictureSize * 0.5,
            pictureSize,
            pictureSize
        );
        ctx.beginPath();
        ctx.strokeStyle = colors.blue;
        ctx.lineWidth = 3;
        ctx.arc(pictureX, pictureY, pictureSize * 0.5, 0, 2 * Math.PI, true);
        ctx.stroke();

        const nameLeft = 40;
        const nameTop = height - 200;

        //name
        ctx.fillStyle = colors.blue;
        ctx.font = ' 40px Montserrat ';
        ctx.fillText(depute.firstname, nameLeft, nameTop);
        ctx.font = 'bold 70px Montserrat ';
        ctx.fillText(depute.lastname.toUpperCase(), nameLeft, nameTop + 70);

        //title
        ctx.font = 'light 30px Montserrat ';
        ctx.fillText(depute.county, nameLeft, nameTop + 100);
        ctx.fillText(
            `Député(e) de la ${depute.circumscription}${numberToSuffix(
                depute.circumscription
            )} cirsconscription`,
            nameLeft,
            nameTop + 130
        );

        drawScore('Ecologie', ctx, 10, 0);
        drawScore('Etat autoritaire', ctx, 50, 1, true);
        drawScore('Etat social', ctx, 35, 2);
        drawScore('Justice', ctx, 50, 3);
        drawScore('A soutenu Macron', ctx, 75, 4, true);

        return canvas.toBuffer('image/jpeg');
    } catch (e) {
        console.log(e);
    }
};
