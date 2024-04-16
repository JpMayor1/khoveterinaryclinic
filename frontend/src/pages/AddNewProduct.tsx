import { useState } from "react";
import { toast } from "react-toastify";
import { ProductType } from "../utils/Types";
import { useNavigate } from "react-router-dom";
import { categoryStore } from "../stores/categoryStore";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AddNewProduct = () => {
    const [newProduct, setNewProduct] = useState<ProductType>(
        {} as ProductType
    );
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const categories = categoryStore((state) => state.categories);

    const inputValues = (e: {
        target: { name: string; value: string | number };
    }) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value,
        });
    };

    const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        await axios
            .post(`${url}/api/products/create`, newProduct)
            .then((res) => {
                toast.success(res.data.message);
                setLoading(false);
                setTimeout(() => {
                    navigate("/inventory/products");
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.error);
                setLoading(false);
            });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md m-2">
            <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>
            <form onSubmit={createProduct}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-dark">Category</p>
                        <select
                            name="category"
                            value={newProduct.category || ""}
                            onChange={inputValues}
                            className="rounded-md p-2 border w-full"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <p className="text-dark">Product Name</p>
                        <input
                            type="text"
                            name="name"
                            value={newProduct.name}
                            onChange={inputValues}
                            className="rounded-md p-2 border w-full"
                            required
                        />
                    </div>
                    <div>
                        <p className="text-dark">Price</p>
                        <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={inputValues}
                            className="rounded-md p-2 border w-full"
                            required
                        />
                    </div>
                    <div>
                        <p className="text-dark">Stock</p>
                        <input
                            type="number"
                            name="stock"
                            value={newProduct.stock}
                            onChange={inputValues}
                            className="rounded-md p-2 border w-full"
                            required
                        />
                    </div>
                    <div>
                        <p className="text-dark">Sold</p>
                        <input
                            type="number"
                            name="sold"
                            value={newProduct.sold}
                            onChange={inputValues}
                            className="rounded-md p-2 border w-full"
                            required
                        />
                    </div>
                </div>
                <div className="mt-4 space-x-4">
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                    >
                        {loading ? (
                            <PulseLoaderComponent size={15} color="#FFFBF5" />
                        ) : (
                            "Add Product"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewProduct;
