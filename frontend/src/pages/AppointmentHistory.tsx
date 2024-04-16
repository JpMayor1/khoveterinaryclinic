import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { AppointmentType } from "../utils/Types";
import { formatAppointmentTime } from "../utils/formatAppointmentTime";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import Pagination from "../components/Pagination";
import formatDate from "../utils/formatDate";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState<AppointmentType[]>(
        [] as AppointmentType[]
    );
    const [showAllData, setShowAllData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchAppointmentHistory = async () => {
            setLoading(true);
            try {
                await axios
                    .get(`${url}/api/appointments`)
                    .then((res) => {
                        setAppointments(res.data);
                        return;
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error(err.response.data.error);
                        return;
                    });
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch appointment history");
            } finally {
                setLoading(false);
            }
        };
        fetchAppointmentHistory();
    }, []);

    const filteredAppointment = async () => {
        setLoading(true);
        setCurrentPage(1);
        if (search === "") {
            await axios
                .get(`${url}/api/appointments`)
                .then((res) => {
                    setAppointments(res.data);
                    setLoading(false);
                    return;
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(err.response.data.error);
                    setLoading(false);
                    return;
                });
            return;
        }

        // Function to validate the date format
        const isValidDateFormat = (dateString: string) => {
            const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
            return dateFormatRegex.test(dateString);
        };

        if (!isValidDateFormat(search)) {
            toast.error("Invalid date format. Please use MM/DD/YYYY.");
            setLoading(false);
            return;
        }

        // Function to convert user-provided date to database format
        const convertUserDateToDatabaseFormat = (userDate: string) => {
            // Assuming userDate is in the format YYYY-MM-DD
            const [year, month, day] = userDate.split("-");

            // Create a new Date object with the provided date
            const userProvidedDate = new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1, // Months are zero-based
                parseInt(day, 10),
                0,
                0,
                0,
                0
            );

            // Format the date as a string in the format used in the database
            const formattedDate = userProvidedDate.toISOString();

            return formattedDate;
        };

        const formattedSearchDate = convertUserDateToDatabaseFormat(search);

        await axios
            .get(`${url}/api/appointments/date/${formattedSearchDate}`)
            .then((res) => {
                setAppointments(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message);
                setLoading(false);
            });
    };

    const paginatedData = showAllData
        ? appointments
        : appointments.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
          );

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="w-full h-full p-1 md:p-5">
            <h1 className="text-3xl font-semibold mb-5">Appointment History</h1>
            <div className="w-full flex items-center mb-4 p-2 rounded-lg">
                <div className="flex items-center">
                    <input
                        type="date"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className=" w-56 p-2 border-2 rounded-l-md focus:outline-none"
                        placeholder="MM/DD/YYYY"
                    />
                    <button
                        className="bg-dark hover:bg-dark/90 text-light p-[10px] rounded-r-md focus:outline-none text-2xl"
                        onClick={filteredAppointment}
                    >
                        <BiSearchAlt />
                    </button>
                </div>
            </div>
            <div className="w-full flex flex-col items-center">
                {loading ? (
                    <PulseLoaderComponent size={20} />
                ) : appointments.length === 0 ? (
                    <h1 className="text-xl font-semibold">
                        No appointments yet.
                    </h1>
                ) : (
                    <div className="w-full px-2">
                        <table className="w-full print-table border border-dark/50">
                            <thead>
                                <tr className="bg-primary text-light">
                                    <th className="py-2 px-4">Client</th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Date
                                    </th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Time
                                    </th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Pet
                                    </th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Purpose
                                    </th>
                                    <th className="py-2 px-4">Status</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData
                                    .slice()
                                    .reverse()
                                    .map((appointment) => (
                                        <tr
                                            key={appointment._id}
                                            className="border border-dark/50"
                                        >
                                            <td className="py-2 px-4 text-center">
                                                {appointment.client.name}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {formatDate(appointment.date)}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {formatAppointmentTime(
                                                    appointment.time
                                                )}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {appointment.pet.name}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {appointment.purpose}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                {appointment.status}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <Link
                                                    to={`/appointment-history/${appointment._id}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {appointments.length > itemsPerPage && (
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
                                <div>
                                    {appointments.length > itemsPerPage && (
                                        <Pagination
                                            totalItems={appointments.length}
                                            itemsPerPage={itemsPerPage}
                                            onPageChange={changePage}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentHistory;
