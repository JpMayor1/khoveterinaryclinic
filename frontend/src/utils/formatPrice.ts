// formatPrice.ts
const formatPrice = (price: number) => {
    // Check if price is defined
    if (typeof price !== "number" || isNaN(price)) {
        return "Invalid Price";
    }

    const formattedPrice = price.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    });

    // Add a non-breaking space (\u00A0) after the peso sign
    return formattedPrice.replace("₱", "₱\u00A0");
};

export default formatPrice;
