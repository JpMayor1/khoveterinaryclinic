import { toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";
import { useState, useEffect } from "react";
import { ProductType } from "../utils/Types";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import formatPrice from "../utils/formatPrice";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const ProductInfo = () => {
    const [product, setProduct] = useState<ProductType>({} as ProductType);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newStock, setNewStock] = useState("");
    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const id = location.pathname.split("/")[3];
    const navigate = useNavigate();

    useEffect(() => {
        const getAllProducts = async () => {
            setLoading(true);
            await axios
                .get(`${url}/api/products/productId/${id}`)
                .then((res) => {
                    setProduct(res.data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.response.data.error);
                    setLoading(false);
                });
        };
        getAllProducts();
    }, [id]);

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const updateProduct = async (
        name: string,
        price: number,
        stock: number
    ) => {
        const uptadedProduct = {
            name: newName ? newName : name,
            price: newPrice ? newPrice : price,
            stock: newStock ? newStock : stock,
        };
        setButtonLoading(true);
        try {
            await axios
                .put(`${url}/api/products/update/${id}`, uptadedProduct)
                .then((res) => {
                    toast.success(res.data.message);
                    setButtonLoading(false);
                    setTimeout(() => {
                        navigate("/inventory/products");
                    }, 3001);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.response.data.error);
                    setButtonLoading(false);
                });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again.");
            setButtonLoading(false);
        }
    };

    const deleteProduct = async () => {
        try {
            setButtonLoading(true);
            setShowDeleteModal(false);
            await axios
                .delete(`${url}/api/products/delete/${id}`)
                .then((res) => {
                    toast.success(res.data.message);
                    setButtonLoading(false);
                    setTimeout(() => {
                        navigate("/inventory/products");
                    }, 1500);
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.response.data.error);
                    setButtonLoading(false);
                });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">{product.category}</h1>
            {loading ? (
                <div className="w-full text-center">
                    <PulseLoaderComponent size={20} />
                </div>
            ) : (
                <>
                    <div className="w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-dark text-lg font-bold">
                                    Product Name
                                </p>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={newName}
                                        placeholder={product.name}
                                        onChange={(e) =>
                                            setNewName(e.target.value)
                                        }
                                        className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                    />
                                ) : (
                                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                        {product.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-dark text-lg font-bold">
                                    Sold
                                </p>
                                <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                    {product.sold}
                                </p>
                            </div>
                            <div>
                                <p className="text-dark text-lg font-bold">
                                    Stock
                                </p>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={newStock}
                                        placeholder={product.stock.toString()}
                                        onChange={(e) =>
                                            setNewStock(e.target.value)
                                        }
                                        className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                    />
                                ) : (
                                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                        {product.stock}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-dark text-lg font-bold">
                                    Price
                                </p>

                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={newPrice}
                                        placeholder={product.price.toString()}
                                        onChange={(e) =>
                                            setNewPrice(e.target.value)
                                        }
                                        className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                    />
                                ) : (
                                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                        {formatPrice(product.price)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="w-full flex justify-start items-center my-2">
                            {isEditing ? (
                                <>
                                    <button
                                        className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md border text-base"
                                        onClick={() =>
                                            updateProduct(
                                                product.name,
                                                product.price,
                                                product.stock
                                            )
                                        }
                                    >
                                        {buttonLoading ? (
                                            <PulseLoaderComponent
                                                size={8}
                                                color="#FFFBF5"
                                            />
                                        ) : (
                                            "Save"
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md ml-2 border text-base"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="text-primary px-4 py-2 rounded-md border text-xl"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <CiEdit />
                                    </button>
                                    <button
                                        className={`bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md ml-2 border ${
                                            buttonLoading
                                                ? "cursor-not-allowed text-sm"
                                                : "text-xl"
                                        }`}
                                        onClick={openDeleteModal}
                                    >
                                        {buttonLoading ? (
                                            <PulseLoaderComponent
                                                size={8}
                                                color="#FFFBF5"
                                            />
                                        ) : (
                                            <AiOutlineDelete />
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                        {showDeleteModal && (
                            <ConfirmationModal
                                isOpen={showDeleteModal}
                                message="Are you sure you want to delete this Product?"
                                onConfirm={deleteProduct}
                                onCancel={closeDeleteModal}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductInfo;
