export const offset = (el: HTMLElement, getBoundingClientRect?: boolean) => {
    if (getBoundingClientRect) {
        const rect = el.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
        };
    }
    // getBoundingClientRect : weird bugs in scrollable elements
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        x += el.offsetLeft - el.scrollLeft;
        y += el.offsetTop - el.scrollTop;
        el = el.offsetParent as HTMLElement;
    }
    return { top: y, left: x };
};

export const offsetTop = (el: HTMLElement, getBoundingClientRect?: boolean) =>
    offset(el, getBoundingClientRect).top;
export const offsetLeft = (el: HTMLElement, getBoundingClientRect?: boolean) =>
    offset(el, getBoundingClientRect).left;
