import { CanvasRenderingContext2D, createCanvas, Image, registerFont } from 'canvas';
import type { Depute, DeputeVote } from '../types/deputeTypes';
import path from 'path';
import { loadFile } from './loadFIle';
import { deputePicturePath } from '../scripts/config';
import { canvasRoundRect } from '$helpers/canvasRoundRect';
import { getVoteImpact } from '$helpers/getVoteImpact';

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

export const renderSquare = (
    ctx: CanvasRenderingContext2D,
    color: string,
    offset: [number, number]
) => {
    ctx.fillStyle = color;
    canvasRoundRect(ctx, offset, 40, 40);
};

const numberToSuffix = (number: number) => (number === 1 ? 'ère' : 'ème');

const colors = {
    blue: '#1d3058',
    red: '#f34235',
    green: '#00B241',
    yellow: '#ff7e00',
    grey: '#707070'
};

const drawScore = (
    type: string,
    votes: DeputeVote[],
    ctx: CanvasRenderingContext2D,
    offset: number = 0
) => {
    const scoreLeft = 295;
    const scoreTop = 160 + offset * 50;
    const scoreBarLeft = 660;

    ctx.fillStyle = colors.blue;
    ctx.fillText(type, scoreLeft, scoreTop + 25);

    const positives: DeputeVote[] = [];
    const negatives: DeputeVote[] = [];
    const neutrals: DeputeVote[] = [];
    votes.forEach((v) => {
        const impact = getVoteImpact(v);
        if (impact === 1) return positives.push(v);
        if (impact === -1) return negatives.push(v);
        return neutrals.push(v);
    });

    positives.forEach((v, i) => {
        renderSquare(ctx, colors.green, [scoreBarLeft + i * 50, scoreTop]);
    });
    neutrals.forEach((v, i) => {
        renderSquare(ctx, colors.grey, [scoreBarLeft + (i + positives.length) * 50, scoreTop]);
    });
    negatives.forEach((v, i) => {
        renderSquare(ctx, colors.red, [
            scoreBarLeft + (i + positives.length + neutrals.length) * 50,
            scoreTop
        ]);
    });
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
            60,
            pictureY - pictureSize * 0.5,
            pictureSize,
            pictureSize
        );
        ctx.beginPath();
        ctx.strokeStyle = colors.blue;
        ctx.lineWidth = 3;
        ctx.arc(60 + pictureSize * 0.5, pictureY, pictureSize * 0.5, 0, 2 * Math.PI, true);
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
        ctx.fillText(depute.county, nameLeft, nameTop + 120);
        ctx.fillText(
            `Député(e) de la ${depute.circumscription}${numberToSuffix(
                depute.circumscription
            )} cirsconscription`,
            nameLeft,
            nameTop + 150
        );
        const categories = depute.votes.reduce((acc, curr) => {
            const category =
                acc.find((c) => c.name === curr?.category) ||
                acc[acc.push({ name: curr.category, votes: [] }) - 1];

            category.votes.push(curr);

            return acc;
        }, []);

        categories.forEach(({ name, votes }, i) => {
            drawScore(name, votes, ctx, i);
        });

        const ctaSize = [500, 120];
        ctx.beginPath();
        ctx.rect(width - ctaSize[0] - 40, height - ctaSize[1] - 40, ctaSize[0], ctaSize[1]);
        ctx.fillStyle = colors.blue;
        ctx.fill();

        ctx.fillStyle = 'white';
        ctx.fillText('Retrouvez votre député', width - ctaSize[0] - 10, height - ctaSize[1] - 5);
        ctx.fillText('sur', width - ctaSize[0] - 10, height - ctaSize[1] + 45);
        ctx.font = 'bold 50px Montserrat ';
        ctx.fillText('quel-depute.fr', width - ctaSize[0] + 45, height - ctaSize[1] + 45);

        return canvas.toBuffer('image/jpeg');
    } catch (e) {
        console.log(e);
    }
};
