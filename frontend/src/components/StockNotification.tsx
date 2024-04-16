import { Link } from "react-router-dom";
import { productNotifStore } from "../stores/productNotifStore";

const StockNotification = () => {
    const products = productNotifStore((state) => state.products);

    // Filter products with stock below 10
    const lowStockProducts = products.filter((product) => product.stock <= 10);

    return (
        <div className="my-2 flex flex-col items-start w-full">
            {lowStockProducts.length > 0 && (
                <>
                    <h2 className="text-lg">Low Stock Products:</h2>
                    <ul className="w-full">
                        {lowStockProducts.map((product) => (
                            <li
                                key={product._id}
                                className="w-full flex items-center justify-between"
                            >
                                <p className="text-sm">
                                    {product.name} - Stock: {product.stock}
                                </p>
                                <Link
                                    to={`/inventory/product/${product._id}`}
                                    className="underline text-base text-light2 hover:text-light"
                                >
                                    View
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default StockNotification;
