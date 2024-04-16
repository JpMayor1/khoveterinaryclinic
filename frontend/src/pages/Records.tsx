import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { RecordType } from "../utils/Types";
import { BiSearchAlt } from "react-icons/bi";
import { debounce } from "../utils/debounce";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Records = () => {
    const [records, setRecords] = useState<RecordType[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const debouncedGetRecords = debounce(async (query: string) => {
            try {
                setLoading(true);
                await axios
                    .get(`${url}/api/records${query ? `/search/${query}` : ""}`)
                    .then((res) => {
                        toast.success(res.data.message);
                        return setRecords(res.data);
                    })
                    .catch((err) => {
                        return toast.error(err.response.data.message);
                    });
            } catch (error) {
                return console.log(error);
            } finally {
                setLoading(false);
            }
        }, 500);
        // Call the debouncedGetRecords function
        debouncedGetRecords(search);

        // Cleanup function for the debounce
        return () => {
            debouncedGetRecords.flush(); // Clear any pending debounced calls
        };
    }, [search]);

    return (
        <div className="w-full h-full overflow-auto p-1 md:p-5">
            <h1 className="text-3xl font-semibold mb-5">Records</h1>
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4 p-2 rounded-lg">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className=" w-56 p-2 border-2 rounded-l-md focus:outline-none"
                            placeholder="Search pet..."
                        />
                        <button className="bg-dark hover:bg-dark/90 text-light p-[10px] rounded-r-md focus:outline-none text-2xl">
                            <BiSearchAlt />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <PulseLoaderComponent size={20} />
                ) : records.length === 0 ? (
                    <h1 className="text-xl font-semibold">No Records found.</h1>
                ) : (
                    <div className="w-full px-2">
                        <table className="w-full border border-dark/50">
                            <thead>
                                <tr className="bg-primary text-light">
                                    <th className="py-2 px-4">Pet Name</th>
                                    <th className="py-2 px-4">Owner</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {records
                                    .slice()
                                    .reverse()
                                    .map((record) => (
                                        <tr
                                            key={record._id}
                                            className="border border-dark/50"
                                        >
                                            <td className="py-2 px-4 text-center">
                                                {record.pet.name}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {record.client.name}
                                            </td>

                                            <td className="py-2 px-4 text-center">
                                                <Link
                                                    to={`/records/${record._id}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Records;
