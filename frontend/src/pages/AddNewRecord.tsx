import { toast } from "react-toastify";
import { PetType } from "../utils/Types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AddNewRecord = () => {
    const [loading, setLoading] = useState(false);
    const [pets, setPets] = useState<PetType[]>([]);
    const [petId, setPetId] = useState("");
    const [search, setSearch] = useState("");
    const [filteredPets, setFilteredPets] = useState<PetType[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const GetAllPets = async () => {
            try {
                await axios
                    .get(`${url}/api/pets`)
                    .then((res) => {
                        toast.success(res.data.message);
                        setPets(res.data);
                    })
                    .catch((err) => {
                        toast.error(err.response.data.message);
                    });
            } catch (error) {
                console.log(error);
            }
        };

        GetAllPets();
        setLoading(false);
    }, []);

    const searchPet = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setSearch(newQuery);
        const filtered = pets.filter((pet) =>
            pet.name.toLowerCase().includes(newQuery.toLowerCase())
        );
        if (newQuery === "") {
            setFilteredPets([]);
        } else {
            setFilteredPets(filtered);
        }
    };

    const createRecord = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const selectedPet = pets.find((p) => p._id === petId);

            if (!selectedPet) {
                toast.error("Please Select a pet");
                setLoading(false);
                return;
            }

            const payload = {
                client: {
                    name: selectedPet?.clientId.name,
                    email: selectedPet?.clientId.email,
                    contactNumber: selectedPet?.clientId.cpNumber,
                    address: selectedPet?.clientId.location,
                },
                pet: {
                    id: selectedPet?._id,
                    name: selectedPet?.name,
                    species: selectedPet?.species,
                    breed: selectedPet?.breed,
                    birthdate: selectedPet?.birthdate,
                    gender: selectedPet?.gender,
                    color: selectedPet?.color,
                    age: selectedPet?.age,
                    recordId: selectedPet?.recordId,
                },
            };

            await axios
                .post(`${url}/api/records/create`, payload)
                .then((res) => {
                    toast.success(res.data.message);
                    setLoading(false);
                    setTimeout(() => {
                        navigate("/records");
                    }, 1500);
                })
                .catch((err) => {
                    toast.error(err.response.data.message);
                    setLoading(false);
                });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md m-2">
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Add new Record
            </h2>
            <form onSubmit={createRecord}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Select Pet</p>
                        <div className="flex items-center space-x-2 relative">
                            <input
                                type="text"
                                value={search}
                                onChange={searchPet}
                                className="rounded-md p-2 border border-dark/70 w-full"
                                placeholder="Search Pet"
                            />
                            <div
                                className={`w-full z-20 ${
                                    filteredPets.length > 10
                                        ? "hidden"
                                        : " absolute top-10 left-[-8px]"
                                }`}
                            >
                                {filteredPets.length > 0 && (
                                    <div className="absolute bg-white w-full border border-dark/70 rounded-md mt-1">
                                        {filteredPets.map((pet) => (
                                            <div
                                                key={pet._id}
                                                className="p-2 border border-dark/70 w-full bg-light cursor-pointer"
                                                onClick={() => {
                                                    setPetId(pet._id);
                                                    setSearch(pet.name);
                                                    setFilteredPets([]);
                                                }}
                                            >
                                                {pet.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
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
                            "Create Record"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNewRecord;
