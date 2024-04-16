import { toast } from "react-toastify";
import { AdminType } from "../utils/Types";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { adminStore } from "../stores/adminStore";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Admins = () => {
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState<AdminType[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [id, setId] = useState("");

    const adminInfo = adminStore((state) => state.adminInfo);

    useEffect(() => {
        const getAllAdmins = async () => {
            setLoading(true);
            try {
                await axios
                    .get(`${url}/api/admins`)
                    .then((res) => {
                        toast.success(res.data.message);
                        setAdmins(res.data);
                        return;
                    })
                    .catch((err) => {
                        toast.error(err.response.data.message);
                        return;
                    });
            } catch (error) {
                console.log(error);
                return;
            } finally {
                setLoading(false);
            }
        };
        getAllAdmins();
    }, []);

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const deleteAdmin = async () => {
        setLoading(true);
        setShowDeleteModal(false);
        try {
            await axios.delete(`${url}/api/delete/${id}`).then((res) => {
                toast.success(res.data.message);
                setAdmins((prevAdmins) =>
                    prevAdmins.filter((admin) => admin._id !== id)
                );
                return;
            });
        } catch (error) {
            console.log(error);
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full p-1 md:p-5">
            <h1 className="text-3xl font-semibold mb-5">Admins</h1>
            <div className="w-full flex flex-col items-center">
                {loading ? (
                    <PulseLoaderComponent size={20} />
                ) : (
                    <div className="w-full px-2">
                        <table className="w-full border border-dark/50">
                            <thead>
                                <tr className="bg-primary text-light">
                                    <th className="py-2 px-4">Username</th>
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins
                                    .slice()
                                    .reverse()
                                    .map((admin) => (
                                        <tr
                                            key={admin._id}
                                            className="border border-dark/50"
                                        >
                                            <td className="py-2 px-4 text-center">
                                                {admin.username}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {admin.email}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {adminInfo.superAdmin && (
                                                    <button
                                                        className="text-light text-xl bg-red px-2 py-2 rounded-md hover:bg-red/70"
                                                        onClick={() => {
                                                            openDeleteModal(),
                                                                setId(
                                                                    admin._id
                                                                );
                                                        }}
                                                    >
                                                        <AiOutlineDelete />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {showDeleteModal && (
                            <ConfirmationModal
                                isOpen={showDeleteModal}
                                message="Are you sure you want to delete this Admin?"
                                onConfirm={deleteAdmin}
                                onCancel={closeDeleteModal}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admins;
