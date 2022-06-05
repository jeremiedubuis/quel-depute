export function isTouchDevice() {
    return (
        //@ts-ignore
        'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    );
}
