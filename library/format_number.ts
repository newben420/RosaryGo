export const formatNumber = (input: number | string): string => {
    const num = typeof input === "string" ? parseFloat(input) : input;

    if (isNaN(num)) {
        return (num || "").toString();
    }

    const [integerPart, decimalPart] = num.toString().split(".");

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart !== undefined
        ? `${formattedInteger}.${decimalPart}`
        : formattedInteger;
}