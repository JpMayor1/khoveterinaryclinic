import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductType } from "../utils/Types";
import { BiSearchAlt } from "react-icons/bi";
import { debounce } from "../utils/debounce";
import { categoryStore } from "../stores/categoryStore";
import { productNotifStore } from "../stores/productNotifStore";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import formatPrice from "../utils/formatPrice";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Products = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const categories = categoryStore((state) => state.categories);
    const setProductState = productNotifStore((state) => state.setProductState);

    useEffect(() => {
        const debouncedGetProducts = debounce(
            async (query: string, category: string) => {
                try {
                    setLoading(true);
                    const encodedCategory = encodeURIComponent(category);
                    const response = await axios.get(
                        `${url}/api/products${query ? `/${query}` : ""}${
                            query
                                ? ""
                                : category
                                ? `/category/${encodedCategory}`
                                : ""
                        }`
                    );
                    setProducts(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    toast.error("Error fetching products data");
                    setLoading(false);
                }
            },
            500
        );

        // Call the debouncedGetProducts function
        debouncedGetProducts(search, category);
        return () => {
            debouncedGetProducts.flush();
        };
    }, [search, category]);

    useEffect(() => {
        const fetchProducts = async () => {
            await axios.get(`${url}/api/products`).then((res) => {
                setProducts(res.data);
                const filteredProducts = res.data.filter(
                    (product: ProductType) => product.stock < 11
                );
                setProductState(filteredProducts);
            });
        };

        fetchProducts();
    }, [setProductState]);

    return (
        <div className="w-full h-full p-1 md:p-5">
            <h1 className="text-3xl font-semibold mb-5">Products</h1>

            <div className="w-full flex flex-col items-center">
                <div className="h-fit w-full flex flex-col gap-1 sm:flex-row items-center justify-between mb-4 p-2">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-56 p-2 border-2 rounded-l-md focus:outline-none"
                            placeholder="Search products..."
                        />
                        <button className="bg-dark hover:bg-dark/90 text-light p-[10px] rounded-r-md focus:outline-none text-2xl">
                            <BiSearchAlt />
                        </button>
                    </div>
                    <div className="flex items-center">
                        <span className="text-dark mr-2">Category:</span>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="p-2 border rounded-md focus:outline-none w-[200px]"
                        >
                            <option value="">All</option>
                            {categories.map((category) => (
                                <option
                                    key={category._id}
                                    value={category.name}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <PulseLoaderComponent size={20} />
                ) : products.length === 0 ? (
                    <h1 className="text-xl font-semibold">No products found</h1>
                ) : (
                    <div className="w-full p-2">
                        {products.length > 0 ? (
                            <table className="w-full border border-dark/50">
                                <thead>
                                    <tr className="bg-primary text-light">
                                        <th className="py-2 px-4">
                                            Product Name
                                        </th>
                                        <th className="py-2 px-4 max-sm:hidden">
                                            Price
                                        </th>
                                        <th className="py-2 px-4">Stock</th>
                                        <th className="py-2 px-4 max-sm:hidden">
                                            sold
                                        </th>
                                        <th className="py-2 px-4"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products
                                        .slice()
                                        .reverse()
                                        .map((product) => (
                                            <tr
                                                key={product._id}
                                                className={`border border-dark/50 ${
                                                    product.stock < 11 &&
                                                    "bg-red text-light"
                                                }`}
                                            >
                                                <td className="py-2 px-4 text-center">
                                                    {product.name}
                                                </td>
                                                <td className="py-2 px-4 text-center max-sm:hidden">
                                                    {formatPrice(product.price)}
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    {product.stock}
                                                </td>
                                                <td className="py-2 px-4 text-center max-sm:hidden">
                                                    {product.sold}
                                                </td>
                                                <td className="py-2 px-4 text-center">
                                                    <Link
                                                        to={`/inventory/product/${product._id}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            <h1>No products found</h1>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
