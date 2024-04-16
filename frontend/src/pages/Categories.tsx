import { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";
import { categoryStore } from "../stores/categoryStore";
import ConfirmationModal from "../components/ConfirmationModal";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Categories = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [id, setId] = useState("");

    const categories = categoryStore((state) => state.categories);
    const deleteCategory = categoryStore((state) => state.deleteCategory);

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const deletecategory = async () => {
        try {
            await axios
                .delete(`${url}/api/category/delete/${id}`)
                .then((res) => {
                    toast.success(res.data.message);
                    deleteCategory(id);
                    setShowDeleteModal(false);
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-full h-full p-1 md:p-5">
            <h1 className="text-3xl font-semibold mb-5">Categories</h1>
            {categories.length === 0 ? (
                <div className="w-full p-2 bg-red/20 text-dark text-center rounded-md">
                    No categories found
                </div>
            ) : (
                <div className="w-full px-2">
                    <table className="w-full border border-dark/50">
                        <thead>
                            <tr className="bg-primary text-light">
                                <th className="py-2 px-4 text-left">
                                    category name
                                </th>
                                <th className="py-2 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories
                                .slice()
                                .reverse()
                                .map((category) => (
                                    <tr
                                        key={category._id}
                                        className="border border-dark/50"
                                    >
                                        <td className="py-2 px-4 text-left">
                                            {category.name}
                                        </td>
                                        <td className="py-2 px-4 text-right">
                                            <button
                                                className="text-light text-xl bg-red px-2 py-2 rounded-md hover:bg-red/70"
                                                onClick={() => {
                                                    openDeleteModal(),
                                                        setId(category._id);
                                                }}
                                            >
                                                <AiOutlineDelete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {showDeleteModal && (
                        <ConfirmationModal
                            isOpen={showDeleteModal}
                            message="Are you sure you want to delete this Category?"
                            onConfirm={deletecategory}
                            onCancel={closeDeleteModal}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Categories;
