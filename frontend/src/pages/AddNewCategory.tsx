import { useState } from "react";
import { toast } from "react-toastify";
import { categoryStore } from "../stores/categoryStore";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AddNewCategory = () => {
    const [categoryName, setCategoryName] = useState("" as string);
    const [loading, setLoading] = useState(false);

    const addCategory = categoryStore((state) => state.addCategory);

    const createCategory = async () => {
        setLoading(true);
        try {
            await axios
                .post(`${url}/api/category/create`, { name: categoryName })
                .then((res) => {
                    addCategory(res.data.category);
                    toast.success(res.data.message);
                    setCategoryName("");
                })
                .catch((error) => {
                    toast.error(
                        error.response.data.error || "Error adding category"
                    );
                });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md m-2">
            <h1 className="text-2xl font-semibold mb-4">Add New Category</h1>
            <div>
                <div>
                    <p className="text-dark">Category Name</p>
                    <input
                        type="text"
                        name="category"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="rounded-md p-2 border w-full min-w-[300px] max-w-[500px]"
                        required
                    />
                </div>
                <div className="mt-4 space-x-4">
                    <button
                        onClick={createCategory}
                        className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                    >
                        {loading ? (
                            <PulseLoaderComponent size={15} color="#FFFBF5" />
                        ) : (
                            "Add Category"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddNewCategory;
