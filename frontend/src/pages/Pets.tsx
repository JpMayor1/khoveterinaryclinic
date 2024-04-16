import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { PetType } from "../utils/Types";
import { useEffect, useState } from "react";
import { debounce } from "../utils/debounce";
import { BiSearchAlt } from "react-icons/bi";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import Pagination from "../components/Pagination";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Pets = () => {
    const [pets, setPets] = useState<PetType[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAllData, setShowAllData] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const debouncedGetPets = debounce(async (query: string) => {
            try {
                setLoading(true);
                await axios
                    .get(`${url}/api/pets${query ? `/search/${query}` : ""}`)
                    .then((res) => {
                        toast.success(res.data.message);
                        setPets(res.data);
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
        }, 500);
        // Call the debouncedGetPets function
        debouncedGetPets(search);

        // Cleanup function for the debounce
        return () => {
            debouncedGetPets.flush(); // Clear any pending debounced calls
        };
    }, [search]);

    const paginatedData = showAllData
        ? pets
        : pets.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
          );

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="w-full h-full p-1 md:p-5">
            <h1 className="text-3xl font-semibold mb-5">Pets</h1>
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4 p-2 rounded-lg">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className=" w-56 p-2 border-2 rounded-l-md focus:outline-none"
                            placeholder="Search pets..."
                        />
                        <button className="bg-dark hover:bg-dark/90 text-light p-[10px] rounded-r-md focus:outline-none text-2xl">
                            <BiSearchAlt />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <PulseLoaderComponent size={20} />
                ) : paginatedData.length === 0 ? (
                    <h1 className="text-xl font-semibold">No pets found.</h1>
                ) : (
                    <div className="w-full px-2">
                        <table className="w-full border border-dark/50">
                            <thead>
                                <tr className="bg-primary text-light">
                                    <th className="py-2 px-4">Name</th>
                                    <th className="py-2 px-4">Owner</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData
                                    .slice()
                                    .reverse()
                                    .map((pet) => (
                                        <tr
                                            key={pet._id}
                                            className="border border-dark/50"
                                        >
                                            <td className="py-2 px-4 text-center">
                                                {pet.name}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {pet.clientId.name}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <Link
                                                    to={`/pets/${pet._id}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {pets.length > itemsPerPage && (
                            <div className="w-full flex flex-col sm:flex-row justify-between py-4 px-2">
                                <div className="flex items-center">
                                    <label className="mr-2">
                                        Show All Data
                                    </label>
                                    <input
                                        type="checkbox"
                                        checked={showAllData}
                                        onChange={() =>
                                            setShowAllData(!showAllData)
                                        }
                                    />
                                </div>

                                {!showAllData && (
                                    <div>
                                        {pets.length > itemsPerPage && (
                                            <Pagination
                                                totalItems={pets.length}
                                                itemsPerPage={itemsPerPage}
                                                onPageChange={changePage}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pets;
