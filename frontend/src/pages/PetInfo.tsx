import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClientType, PetType } from "../utils/Types";
import { useLocation, useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const PetInfo = () => {
    const [pet, setPet] = useState<PetType>({} as PetType);
    const [error, setError] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [newName, setNewName] = useState("");
    const [newWeight, setNewWeight] = useState("");
    const [newBreed, setNewBreed] = useState("");
    const [newSpecies, setNewSpecies] = useState("");
    const [newGender, setNewGender] = useState("");
    const [newAge, setNewAge] = useState("");
    const [newBirthdate, setNewBirthdate] = useState("");
    const [newColor, setNewColor] = useState("");
    const [clients, setClients] = useState<ClientType[]>({} as ClientType[]);
    const [newClientId, setNewClientId] = useState("");
    const [search, setSearch] = useState("");
    const [filteredClients, setFilteredClients] = useState<ClientType[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const navigate = useNavigate();

    useEffect(() => {
        const getPetsInfo = async () => {
            setPageLoading(true);
            try {
                const response = await axios.get(`${url}/api/pets/${id}`);
                setPet(response.data);
            } catch (error) {
                setError(true);
                console.error(error);
                toast.error("Failed to fetch client information");
            } finally {
                setPageLoading(false);
            }
        };

        const getAllClients = async () => {
            try {
                await axios
                    .get(`${url}/api/clients`)
                    .then((res) => {
                        toast.success(res.data.message);
                        setClients(res.data);
                        return;
                    })
                    .catch((err) => {
                        toast.error(err.response.data.message);
                        return;
                    });
            } catch (error) {
                console.log(error);
                return;
            }
        };

        getAllClients();
        getPetsInfo();
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
                <h1 className="text-2xl font-semibold">Pet not found</h1>
            </div>
        );
    }

    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

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

    const searchOwner = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setSearch(newQuery);
        const filtered = clients.filter((client) =>
            client.name.toLowerCase().includes(newQuery.toLowerCase())
        );
        if (newQuery === "") {
            setFilteredClients([]);
        } else {
            setFilteredClients(filtered);
        }
    };

    const updatePet = async () => {
        setButtonLoading(true);

        try {
            let updatedImage = "";

            if (image) {
                if (pet.image) {
                    await axios.delete(`${url}/api/image/delete`, {
                        data: { image: pet.image },
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

            const newPet = {
                clientId: newClientId || pet.clientId,
                image: updatedImage || pet.image,
                name: newName || pet.name,
                weight: newWeight || pet.weight,
                breed: newBreed || pet.breed,
                species: newSpecies || pet.species,
                gender: newGender || pet.gender,
                age: newAge || pet.age,
                birthdate: newBirthdate || pet.birthdate,
                color: newColor || pet.color,
            };

            const updateResponse = await axios.put(
                `${url}/api/pets/update/${id}`,
                newPet
            );
            toast.success(updateResponse.data.message);
            setIsEditing(false);
            setButtonLoading(false);
            setImageUrl("");
            setPet(updateResponse.data.updatedPet);
        } catch (error) {
            console.error(error);
            toast.error("Error updating pet");
            setButtonLoading(false);
        }
    };

    const deletePet = async () => {
        setButtonLoading(true);
        setShowDeleteModal(false);
        try {
            const res = await axios.delete(`${url}/api/pets/delete/${id}`);
            if (pet.image) {
                await axios.delete(`${url}/api/image/delete`, {
                    data: { image: pet.image },
                });
            }
            toast.success(res.data.message);
            setButtonLoading(false);
            setTimeout(() => {
                navigate("/pets");
            }, 1500);
        } catch (error) {
            console.log(error);
            toast.error("An error occurred");
            setButtonLoading(false);
        }
    };

    return (
        <div className="bg-white p-4">
            <h1 className="text-2xl font-semibold mb-4">Pet Information</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex items-center justify-center">
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
                                                    alt="pet image"
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
                                            {pet.image ? (
                                                <div className="relative h-full w-full">
                                                    <img
                                                        src={pet.image}
                                                        alt="pet image"
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
                                src={pet.image ? pet.image : "/default_paw.jpg"}
                                alt="Pet Image"
                                className="w-[300px] h-[300px] object-cover"
                            />
                        )}
                    </div>

                    <div>
                        <p className="text-dark text-lg font-bold">Name</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={pet.name}
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-dark text-lg font-bold">Gender</p>
                        {isEditing ? (
                            <>
                                <select
                                    value={newGender}
                                    onChange={(e) =>
                                        setNewGender(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.gender}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-dark text-lg font-bold">Weight</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={pet.weight}
                                    value={newWeight}
                                    onChange={(e) =>
                                        setNewWeight(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.weight}
                            </p>
                        )}
                    </div>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <div>
                        <p className="text-dark text-lg font-bold">Owner</p>
                        {isEditing ? (
                            <div className="flex items-center space-x-2 relative">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={searchOwner}
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                    placeholder="Search Client"
                                />
                                <div
                                    className={`w-full z-20 ${
                                        filteredClients.length > 10
                                            ? "hidden"
                                            : " absolute top-10 left-[-8px]"
                                    }`}
                                >
                                    {filteredClients.length > 0 && (
                                        <div className="absolute bg-white w-full border border-dark/70 rounded-md mt-1">
                                            {filteredClients.map((client) => (
                                                <div
                                                    key={client._id}
                                                    className="p-2 border border-dark/70 w-full bg-light cursor-pointer"
                                                    onClick={() => {
                                                        setNewClientId(
                                                            client._id
                                                        );
                                                        setSearch(client.name);
                                                        setFilteredClients([]);
                                                    }}
                                                >
                                                    {client.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.clientId.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-dark text-lg font-bold">Breed</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={pet.breed}
                                    value={newBreed}
                                    onChange={(e) =>
                                        setNewBreed(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.breed}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-dark text-lg font-bold">Species</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    placeholder={pet.species}
                                    value={newSpecies}
                                    onChange={(e) =>
                                        setNewSpecies(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.species}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-dark text-lg font-bold">Birthdate</p>
                        {isEditing ? (
                            <>
                                <input
                                    id="birthdate"
                                    name="birthdate"
                                    type="text"
                                    placeholder={
                                        pet.birthdate
                                            ? pet.birthdate
                                            : "Ex: January 1, 2020"
                                    }
                                    value={newBirthdate}
                                    onChange={(e) =>
                                        setNewBirthdate(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.birthdate ? pet.birthdate : "Not set"}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-dark text-lg font-bold">Age</p>
                        {isEditing ? (
                            <>
                                <input
                                    id="age"
                                    name="age"
                                    type="text"
                                    placeholder={pet.age}
                                    value={newAge}
                                    onChange={(e) => setNewAge(e.target.value)}
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.age}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-dark text-lg font-bold">Color</p>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={newColor}
                                    placeholder={pet.color}
                                    onChange={(e) =>
                                        setNewColor(e.target.value)
                                    }
                                    className="w-full font-semibold border border-dark px-2 py-3 rounded-md"
                                />
                            </>
                        ) : (
                            <p className="font-semibold border border-dark px-2 py-3 rounded-md">
                                {pet.color}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="my-4 space-x-4">
                {isEditing ? (
                    <>
                        <button
                            className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                            onClick={() => updatePet()}
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
                            className="bg-primary hover:bg-primary/90 text-light px-4 py-2 rounded-md"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red hover:bg-red/90 text-light px-4 py-2 rounded-md"
                            onClick={handleOpenDeleteModal}
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
                        {pet.recordId && (
                            <Link
                                className="bg-light-green hover:bg-light-green/90 text-light px-4 py-2 rounded-md"
                                to={`/records/${pet.recordId}`}
                            >
                                Show Record
                            </Link>
                        )}
                    </>
                )}
                {showDeleteModal && (
                    <ConfirmationModal
                        isOpen={showDeleteModal}
                        message="Are you sure you want to delete this Pet?"
                        onConfirm={deletePet}
                        onCancel={handleCloseDeleteModal}
                    />
                )}
            </div>
        </div>
    );
};

export default PetInfo;
