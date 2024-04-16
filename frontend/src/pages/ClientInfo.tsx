import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClientType } from "../utils/Types";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const ClientInfo = () => {
    const [client, setClient] = useState<ClientType>({} as ClientType);
    const [error, setError] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newCpNumber, setNewCpNumber] = useState("");
    const [newBalance, setNewBalance] = useState<number | undefined>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showUnBlockModal, setShowUnBlockModal] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [blockButtonLoading, setBlockButtonLoading] = useState(false);
    const [unblockButtonLoading, setUnBlockButtonLoading] = useState(false);

    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const navigate = useNavigate();

    useEffect(() => {
        const getClientInfo = async () => {
            setPageLoading(true);
            try {
                const response = await axios.get(
                    `${url}/api/clients/client/${id}`
                );
                setClient(response.data);
            } catch (error) {
                setError(true);
                console.error(error);
                toast.error("Failed to fetch client information");
            } finally {
                setPageLoading(false);
            }
        };

        getClientInfo();
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
                <h1 className="text-2xl font-semibold">Client not found</h1>
            </div>
        );
    }

    const convertBase64 = (file: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result as string);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const selectImage = async (
        event: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> => {
        const files = event.target.files;

        if (files && files.length > 0) {
            const base64 = await convertBase64(files[0]);
            setImageUrl(base64);
            setImage(files[0]);
        }
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const openBlockModal = () => {
        setShowBlockModal(true);
    };

    const closeBlockModal = () => {
        setShowBlockModal(false);
    };

    const openUnBlockModal = () => {
        setShowUnBlockModal(true);
    };

    const closeUnBlockModal = () => {
        setShowUnBlockModal(false);
    };

    const updateClient = async () => {
        setButtonLoading(true);

        let updatedCpNumber = newCpNumber ? newCpNumber : client.cpNumber;

        if (updatedCpNumber.startsWith("63")) {
            updatedCpNumber = `0${updatedCpNumber.substring(2)}`;
        }

        let updatedImage = "";

        // Check if the image has been changed
        if (image) {
            if (client.image) {
                await axios.delete(`${url}/api/image/delete`, {
                    data: { image: client.image },
                });
            }

            const formData = new FormData();
            formData.append("image", image);

            const response = await axios.post(
                `${url}/api/image/upload`,
                formData
            );
            updatedImage = url + "/images/" + response.data.imageUrl;
        }

        const newClient = {
            image: updatedImage || client.image,
            name: newName ? newName : client.name,
            email: newEmail ? newEmail : client.email,
            location: newLocation ? newLocation : client.location,
            cpNumber: updatedCpNumber,
            balance:
                newBalance === 0 ? 0 : newBalance ? newBalance : client.balance,
        };

        if (
            isNaN(Number(newCpNumber)) ||
            newClient.cpNumber.charAt(0) !== "0"
        ) {
            toast.error(
                "Please enter a valid conta.cpNumberct number, Ex: 09XXXXXXXXX"
            );
            setButtonLoading(false);
            return;
        }

        if (newClient.cpNumber.length < 11 || newClient.cpNumber.length > 11) {
            toast.error("Number must be exact 11 digits");
            setButtonLoading(false);
            return;
        }

        try {
            await axios
                .put(`${url}/api/clients/update/${id}`, newClient)
                .then((res) => {
                    toast.success(res.data.message);
                    setIsEditing(false);
                    setButtonLoading(false);
                    setClient(res.data.updated);
                    setImageUrl("");
                    return;
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

    const blockClient = async () => {
        setBlockButtonLoading(true);
        setShowBlockModal(false);
        try {
            await axios.put(`${url}/api/clients/block/${id}`).then((res) => {
                toast.success(res.data.message);
                setClient(res.data.blockedClient);
            });
        } catch (error) {
            console.log(error);
            toast.error("An error occurred");
        } finally {
            setBlockButtonLoading(false);
        }
    };

    const unblockClient = async () => {
        setUnBlockButtonLoading(true);
        setShowUnBlockModal(false);
        try {
            await axios.put(`${url}/api/clients/unblock/${id}`).then((res) => {
                toast.success(res.data.message);
                setClient(res.data.unBlockedClient);
            });
        } catch (error) {
            console.log(error);
            toast.error("An error occurred");
        } finally {
            setUnBlockButtonLoading(false);
        }
    };

    const deleteClient = async () => {
        setButtonLoading(true);
        setShowDeleteModal(false);
        try {
            const res = await axios.delete(`${url}/api/clients/delete/${id}`);
            if (client.image) {
                await axios.delete(`${url}/api/image/delete`, {
                    data: { image: client.image },
                });
            }
            toast.success(res.data.message);
            setButtonLoading(false);
            setTimeout(() => {
                navigate("/clients");
            }, 1500);
        } catch (err) {
            console.log(err);
            toast.error("An error occurred");
            setButtonLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg m-2">
            <h1 className="text-2xl font-semibold mb-4">Client Information</h1>
            <div className="w-full flex flex-col lg:flex-row gap-7">
                <div className="w-full lg:w-[70%] flex flex-col gap-3">
                    <div
                        className={`${client.name === "No owner" && "hidden"}`}
                    >
                        <p className="text-dark text-lg font-bold">ID: {id}</p>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        {isEditing ? (
                            <>
                                <div>
                                    {imageUrl ? (
                                        <label
                                            htmlFor="dropzone-file"
                                            className="flex flex-col items-center justify-center w-[300px] h-[300px] border border-dark rounded-lg cursor-pointer overflow-hidden"
                                        >
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={imageUrl}
                                                    alt="client image"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-light hover:bg-light/90 text-dark px-7 py-2 rounded-md">
                                                    Change
                                                </div>
                                            </div>
                                            <input
                                                onChange={selectImage}
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                    ) : (
                                        <label
                                            htmlFor="dropzone-file"
                                            className="flex flex-col items-center justify-center w-[300px] h-[300px] border border-dark rounded-lg cursor-pointer overflow-hidden"
                                        >
                                            {client.image ? (
                                                <div className="relative h-full w-full">
                                                    <img
                                                        src={client.image}
                                                        alt="client image"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-light hover:bg-light/90 text-dark px-7 py-2 rounded-md">
                                                        Change
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col flex-wrap items-center justify-center p-3">
                                                    <svg
                                                        aria-hidden="true"
                                                        className="w-10 h-10 mb-3 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                        ></path>
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-semibold">
                                                            Click to upload
                                                        </span>{" "}
                                                        or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        SVG, PNG, JPG up to 20MB
                                                    </p>
                                                </div>
                                            )}
                                            <input
                                                onChange={selectImage}
                                                id="dropzone-file"
                                                type="file"
                                                className="hidden"
                                                multiple
                                            />
                                        </label>
                                    )}
                                </div>
                            </>
                        ) : (
                            <img
                                src={
                                    client.image
                                        ? client.image
                                        : "/default_profile.png"
                                }
                                alt="Client Image"
                                className="w-[300px] h-[300px] object-cover border border-dark rounded-md"
                            />
                        )}
                    </div>
                    <div>
                        <p className="text-dark text-lg font-bold">Name</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={client.name}
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {client.name}
                            </p>
                        )}
                    </div>
                    <div
                        className={`${client.name === "No owner" && "hidden"}`}
                    >
                        <p className="text-dark text-lg font-bold">Email</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={client.email}
                                    value={newEmail}
                                    onChange={(e) =>
                                        setNewEmail(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {client.email}
                            </p>
                        )}
                    </div>
                    <div
                        className={`${client.name === "No owner" && "hidden"}`}
                    >
                        <p className="text-dark text-lg font-bold">Location</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={client.location}
                                    value={newLocation}
                                    onChange={(e) =>
                                        setNewLocation(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {client.location}
                            </p>
                        )}
                    </div>
                    <div
                        className={`${client.name === "No owner" && "hidden"}`}
                    >
                        <p className="text-dark text-lg font-bold">
                            Contact Number
                        </p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={formatPhoneNumber(
                                        client.cpNumber
                                    )}
                                    value={newCpNumber}
                                    onChange={(e) =>
                                        setNewCpNumber(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {formatPhoneNumber(client.cpNumber)}
                            </p>
                        )}
                    </div>
                    <div
                        className={`${client.name === "No owner" && "hidden"}`}
                    >
                        <p className="text-dark text-lg font-bold">Balance</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="number"
                                    placeholder={client.balance.toString()}
                                    value={newBalance}
                                    onChange={(e) =>
                                        setNewBalance(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {client.balance}
                            </p>
                        )}
                    </div>
                </div>
                <div className="w-full lg:w-[30%] lg:pt-7">
                    <table className="w-full border border-dark/50">
                        <thead>
                            <tr>
                                <th
                                    className="text-center bg-primary text-light px-4 py-2"
                                    colSpan={2}
                                >
                                    Pets
                                </th>
                            </tr>
                        </thead>

                        {client.pets?.map((pet) => (
                            <tbody
                                key={pet._id}
                                className="w-52 border border-dark/50"
                            >
                                <tr>
                                    <td className="font-semibold px-4 py-2">
                                        {pet.name}
                                    </td>
                                    <td className="text-center px-4 py-2">
                                        <Link
                                            to={`/pets/${pet._id}`}
                                            className="text-primary hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
            <div className="mt-4 space-x-4">
                {isEditing ? (
                    <>
                        <button
                            className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                            onClick={() => updateClient()}
                        >
                            {buttonLoading ? (
                                <PulseLoaderComponent
                                    size={10}
                                    color="#FFFBF5"
                                />
                            ) : (
                                "Save"
                            )}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={`bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md ${
                                client.name === "No owner" && "hidden"
                            }`}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                        <button
                            className={`bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md ${
                                client.name === "No owner" && "hidden"
                            }`}
                            onClick={openDeleteModal}
                        >
                            {buttonLoading ? (
                                <PulseLoaderComponent
                                    size={10}
                                    color="#FFFBF5"
                                />
                            ) : (
                                "Delete"
                            )}
                        </button>
                        {client.blocked ? (
                            <button
                                className={`bg-light-green hover:bg-light-green/90 text-light px-4 py-2 rounded-md ${
                                    client.name === "No owner" && "hidden"
                                }`}
                                onClick={openUnBlockModal}
                            >
                                {unblockButtonLoading ? (
                                    <PulseLoaderComponent
                                        size={10}
                                        color="#FFFBF5"
                                    />
                                ) : (
                                    "unblock"
                                )}
                            </button>
                        ) : (
                            <button
                                className={`bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md ${
                                    client.name === "No owner" && "hidden"
                                }`}
                                onClick={openBlockModal}
                            >
                                {blockButtonLoading ? (
                                    <PulseLoaderComponent
                                        size={10}
                                        color="#FFFBF5"
                                    />
                                ) : (
                                    "Block"
                                )}
                            </button>
                        )}
                    </>
                )}
                {showDeleteModal && (
                    <ConfirmationModal
                        isOpen={showDeleteModal}
                        message="Are you sure you want to delete this Client?"
                        onConfirm={deleteClient}
                        onCancel={closeDeleteModal}
                    />
                )}
                {showBlockModal && (
                    <ConfirmationModal
                        isOpen={showBlockModal}
                        message="Are you sure you want to Block this Client?"
                        onConfirm={blockClient}
                        onCancel={closeBlockModal}
                    />
                )}
                {showUnBlockModal && (
                    <ConfirmationModal
                        isOpen={showUnBlockModal}
                        message="Are you sure you want to unblock this Client?"
                        onConfirm={unblockClient}
                        onCancel={closeUnBlockModal}
                    />
                )}
            </div>
        </div>
    );
};

export default ClientInfo;
