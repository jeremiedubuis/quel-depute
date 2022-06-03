import type { CanvasRenderingContext2D } from 'canvas';

export function canvasRoundRect(
    ctx: CanvasRenderingContext2D,
    [x, y]: [number, number],
    width: number,
    height: number,
    radius = 10
) {
    const _radius = { tl: radius, tr: radius, br: radius, bl: radius };
    ctx.beginPath();
    ctx.moveTo(x + _radius.tl, y);
    ctx.lineTo(x + width - _radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + _radius.tr);
    ctx.lineTo(x + width, y + height - _radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - _radius.br, y + height);
    ctx.lineTo(x + _radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - _radius.bl);
    ctx.lineTo(x, y + _radius.tl);
    ctx.quadraticCurveTo(x, y, x + _radius.tl, y);
    ctx.closePath();
    ctx.fill();
}
