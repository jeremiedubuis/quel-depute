import type { RefObject } from 'react';
import { offset } from './dom/offset';

export enum DirectionX {
    Left = 'left',
    LeftInner = 'left-inner',
    Right = 'right',
    RightInner = 'right-inner',
    Center = 'center',
}

export enum DirectionY {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom',
}

export type Direction = [DirectionX, DirectionY];

export const getAbsolutePosition = (
    triggerRef: RefObject<HTMLElement>,
    absoluteRef: RefObject<HTMLElement>,
    direction: Direction = [DirectionX.LeftInner, DirectionY.Top],
    contentSizedByTrigger?: boolean,
) => {
    if (!triggerRef.current) return null;
    const button = triggerRef.current;
    const content = absoluteRef.current;
    if (!content) return {};
    const _offset = offset(button, true);

    const contentWidth = contentSizedByTrigger
        ? Math.max(button.offsetWidth, content.offsetWidth)
        : content.offsetWidth;

    let left = _offset.left;
    switch (direction[0]) {
        case DirectionX.Left:
            left -= contentWidth;
            break;
        case DirectionX.RightInner:
            left += button.offsetWidth - contentWidth;
            break;
        case DirectionX.Right:
            left += button.offsetWidth;
            break;
        case DirectionX.Center:
            left -= contentWidth * 0.5 - button.offsetWidth * 0.5;
            break;
    }

    let top = _offset.top;
    switch (direction[1]) {
        case DirectionY.Bottom:
            top += button.offsetHeight;
            break;
        case DirectionY.Top:
            top -= content.offsetHeight;
            break;
        case DirectionY.Middle:
            top -= content.offsetHeight * 0.5 - button.offsetHeight * 0.5;
    }

    left = Math.max(
        Math.min(window.innerWidth + window.scrollX - contentWidth, left),
        window.scrollX,
    );
    top = Math.max(
        Math.min(window.innerHeight + window.scrollY - content.offsetHeight, top),
        window.scrollY,
    );

    let width;
    if (contentSizedByTrigger) width = `${contentWidth}px`;

    return {
        left: `${left}px`,
        top: `${top}px`,
        width,
        visibility: 'visible',
    };
};
