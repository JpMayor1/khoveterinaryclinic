import { toast } from "react-toastify";
import { MdPrint } from "react-icons/md";
import { useEffect, useState } from "react";
import { InvoiceType } from "../utils/Types";
import { AiOutlineDelete } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import formatPrice from "../utils/formatPrice";
import formatDate from "../utils/formatDate";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const InvoiceInfo = () => {
    const [invoice, setInvoice] = useState<InvoiceType>({} as InvoiceType);
    const [error, setError] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const location = useLocation();
    const id = location.pathname.split("/")[3];
    const navigate = useNavigate();

    useEffect(() => {
        const getInvoiceInfo = async () => {
            setPageLoading(true);
            try {
                const response = await axios.get(`${url}/api/invoice/${id}`);
                setInvoice(response.data);
            } catch (error) {
                setError(true);
                console.error(error);
                toast.error("Failed to fetch invoice information");
            } finally {
                setPageLoading(false);
            }
        };

        getInvoiceInfo();
    }, [id]);

    if (pageLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <PulseLoaderComponent size={20} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <h1 className="text-2xl font-semibold">Invoice not found</h1>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <h1 className="text-2xl font-semibold">Invoice not found</h1>
            </div>
        );
    }

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const deleteInvoice = async () => {
        setButtonLoading(true);
        setShowDeleteModal(false);
        try {
            await axios
                .delete(`${url}/api/invoice/delete/${id}`)
                .then((res) => {
                    toast.success(res.data.message);
                    setButtonLoading(false);
                    return setTimeout(() => {
                        navigate("/inventory/invoice");
                    }, 1500);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setButtonLoading(false);
                    return;
                });
        } catch (error) {
            console.log(error);
            setButtonLoading(false);
            return;
        }
    };

    return (
        <div className="h-full w-full p-4 print-invoice">
            <div className="flex justify-between items-center">
                <div className="max-w-[1200px] w-full">
                    <header className="w-full flex items-center justify-evenly text-center">
                        <div className="hidden sm:block image-container">
                            <img
                                src="/logo.jpg"
                                alt="logo"
                                className="h-28 w-28 rounded-full"
                            />
                        </div>
                        <div className="text-container">
                            <h1 className="text-2xl mb-4 font-bold">
                                KHO VETERINARY CLINIC
                            </h1>
                            <p>Daet Branch</p>
                            <p>
                                San Vicente Rd., Lag-og, Daet, Camarines Norte
                            </p>
                            <h2 className="text-lg mb-4 font-bold">
                                INVOICE RECORD
                            </h2>
                        </div>
                        <div className="hidden sm:block image-container">
                            <img
                                src="/logo.jpg"
                                alt="logo"
                                className="h-28 w-28 rounded-full"
                            />
                        </div>
                    </header>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <p className="text-dark text-lg font-bold">Date</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {formatDate(invoice.date)}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Client</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {invoice.client}
                    </p>
                </div>
                <div>
                    <p className="text-dark text-lg font-bold">Pet</p>
                    <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                        {invoice.pet}
                    </p>
                </div>
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-3 mt-1">
                <div className="w-full lg:w-[50%]">
                    {invoice.services.length > 0 && (
                        <div>
                            <p className="text-dark text-lg font-bold">
                                Services
                            </p>
                            {invoice.services.map((service, index) => (
                                <p
                                    key={index}
                                    className="font-semibold border border-dark px-2 py-3 rounded-md mt-2"
                                >
                                    {service.name} {formatPrice(service.price)}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
                <div className="w-full lg:w-[50%]">
                    {invoice.products.length > 0 && (
                        <div>
                            <p className="text-dark text-lg font-bold">
                                Products
                            </p>
                            {invoice.products.map((product, index) => (
                                <p
                                    key={index}
                                    className="font-semibold border border-dark px-2 py-3 rounded-md mt-2"
                                >
                                    {product.name} - Price:{" "}
                                    {formatPrice(product.price)} - quantity:{" "}
                                    {product.quantity}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2 mt-5">
                <button
                    className={`bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md ml-2 border ${
                        buttonLoading
                            ? "cursor-not-allowed text-sm"
                            : "text-2xl"
                    }`}
                    onClick={openDeleteModal}
                >
                    {buttonLoading ? (
                        <PulseLoaderComponent size={8} color="#FFFBF5" />
                    ) : (
                        <AiOutlineDelete />
                    )}
                </button>
                <button
                    className="hidden lg:block h-fit bg-dark text-light px-4 py-2 rounded-md text-2xl"
                    onClick={print}
                >
                    <MdPrint />
                </button>

                <p className="text-dark text-lg font-bold">
                    Total {formatPrice(invoice.total)}
                </p>
            </div>
            <div className="hidden signature w-full mt-10">
                <p className="text-lg font-bold underline leading-tight">
                    Mark Christian Par
                </p>
            </div>

            {showDeleteModal && (
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    message="Are you sure you want to delete this invoice?"
                    onConfirm={deleteInvoice}
                    onCancel={closeDeleteModal}
                />
            )}
        </div>
    );
};

export default InvoiceInfo;
