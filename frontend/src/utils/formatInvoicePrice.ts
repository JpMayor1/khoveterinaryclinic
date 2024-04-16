// formatPrice.ts
const formatInvoicePrice = (price: number) => {
    // Check if price is defined
    if (typeof price !== "number" || isNaN(price)) {
        return "Invalid Price";
    }

    const formattedPrice = price.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    });
    
    return formattedPrice;
};

export default formatInvoicePrice;
