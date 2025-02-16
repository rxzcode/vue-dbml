export const zCopy = (dest: any, src: any) => {
    if (Array.isArray(dest) && Array.isArray(src)) {
        dest.length = src.length;
        for (let i = 0; i < src.length; i++) {
            dest[i] = src[i];
        }
        return dest;
    }
    if (typeof dest === 'object' && typeof src === 'object' && dest && src) {
        Object.keys(dest).forEach((key) => delete dest[key]);
        Object.keys(src).forEach((key) => {
            dest[key] = src[key];
        });
        return dest;
    }
    return dest;
};

export function throttle(fn: Function, timeoutMs: number, immediate: boolean = true) {
    let timer = 0;
    return function perform(...args: any[]) {
        if (timer) return;
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = 0;
            !immediate && fn(...args);
        }, timeoutMs);
        immediate && fn(...args);
    };
}

export function debounce(fn: Function, timeoutMs: number, immediate: boolean = true, timeoutFn: undefined | Function = undefined) {
    let timer = 0;
    return function perform(...args: any[]) {
        const later = function () {
            clearTimeout(timer);
            timer = 0;
            if (!immediate) {
                fn(...args);
            }
            timeoutFn && timeoutFn();
        };
        !timer && immediate && fn(...args);
        clearTimeout(timer);
        timer = setTimeout(later, timeoutMs);
    };
}
