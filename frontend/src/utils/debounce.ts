export const debounce = <F extends (...args: string[]) => unknown>(
    func: F,
    delay: number
) => {
    let timeoutId: ReturnType<typeof setTimeout> | null;

    const debouncedFunction = function (
        this: ThisParameterType<F>,
        ...args: string[]
    ) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;

        const later = function () {
            timeoutId = null;
            func.apply(context, args);
        };

        clearTimeout(timeoutId as ReturnType<typeof setTimeout>);
        timeoutId = setTimeout(later, delay);
    };

    // Add a flush function to clear any pending debounced calls
    debouncedFunction.flush = () => {
        clearTimeout(timeoutId as ReturnType<typeof setTimeout>);
    };

    return debouncedFunction;
};
