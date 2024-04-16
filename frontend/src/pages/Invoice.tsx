import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdPrint } from "react-icons/md";
import { useEffect, useState } from "react";
import { InvoiceType } from "../utils/Types";
import { BiSearchAlt } from "react-icons/bi";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import Pagination from "../components/Pagination";
import formatPrice from "../utils/formatPrice";
import formatDate from "../utils/formatDate";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Invoice = () => {
    const [invoices, setInvoices] = useState<InvoiceType[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [overallTotal, setOverallTotal] = useState(0);
    const [showAllData, setShowAllData] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/api/invoice`);
                setInvoices(response.data);

                const total = response.data.reduce(
                    (acc: number, curr: { total: number }) => acc + curr.total,
                    0
                );
                setOverallTotal(total);
            } catch (error) {
                console.error(error);
                toast.error("Error fetching invoice data");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    const filterDate = async () => {
        setCurrentPage(1);
        try {
            setLoading(true);

            if (!startDate || !endDate) {
                const response = await axios.get(`${url}/api/invoice`);
                return setInvoices(response.data);
            }
            const response = await axios.post(`${url}/api/invoice/filterdate`, {
                startDate,
                endDate,
            });

            setInvoices(response.data);
            const total = response.data.reduce(
                (acc: number, curr: { total: number }) => acc + curr.total,
                0
            );
            setOverallTotal(total);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching invoice data");
        } finally {
            setLoading(false);
        }
    };

    const paginatedData = showAllData
        ? invoices
        : invoices.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
          );

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="w-full h-full overflow-auto p-1 md:p-5">
            <div>
                <h1 className="text-3xl font-semibold mb-5">Invoices</h1>
            </div>
            <div className="w-full flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4 p-2 rounded-lg">
                    <div className="w-full flex flex-col items-start gap-1 sm:flex-row sm:gap-0">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-56 p-2 border-1 rounded-l-md focus:outline-none"
                        />
                        <div className="flex items-center">
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-56 p-2 border-1 focus:outline-none"
                            />
                            <button
                                className="bg-dark hover:bg-dark/90 text-light p-[9px] rounded-r-md focus:outline-none text-2xl"
                                onClick={filterDate}
                            >
                                <BiSearchAlt />
                            </button>
                        </div>
                    </div>
                    <button
                        className="hidden sm:block h-fit bg-dark text-light px-4 py-2 rounded-md text-2xl"
                        onClick={print}
                    >
                        <MdPrint />
                    </button>
                </div>

                {loading ? (
                    <PulseLoaderComponent size={20} />
                ) : invoices.length > 0 ? (
                    <div className="w-full px-2 print-table">
                        <table className="w-full border border-dark/50">
                            <thead>
                                <tr className="bg-primary text-light">
                                    <th className="py-2 px-4">Date</th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Client
                                    </th>
                                    <th className="py-2 px-4 max-sm:hidden">
                                        Pet
                                    </th>

                                    <th className="py-2 px-4">Total</th>
                                    <th className="py-2 px-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData
                                    .slice()
                                    .reverse()
                                    .map((invoice) => (
                                        <tr
                                            key={invoice._id}
                                            className="border border-dark/50"
                                        >
                                            <td className="py-2 px-4 text-center">
                                                {formatDate(invoice.date)}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {invoice.client}
                                            </td>
                                            <td className="py-2 px-4 text-center max-sm:hidden">
                                                {invoice.pet}
                                            </td>

                                            <td className="py-2 px-4 text-center">
                                                {formatPrice(invoice.total)}
                                            </td>
                                            <td className="py-2 px-4 text-center">
                                                <Link
                                                    to={`/inventory/invoice/${invoice._id}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                <tr>
                                    <td className="py-2 px-4 text-center max-sm:hidden"></td>
                                    <td className="py-2 px-4 text-center max-sm:hidden"></td>
                                    <td className="py-2 px-4 text-center">
                                        Overall Total:
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        {formatPrice(overallTotal)}
                                    </td>
                                    <td className="py-2 px-4 text-center"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <h1 className="text-xl font-semibold">
                        No invoices found. Try again.
                    </h1>
                )}
            </div>
            {invoices.length > itemsPerPage && (
                <div className="w-full flex flex-col sm:flex-row justify-between my-4 px-2">
                    <div className="flex items-center">
                        <label className="mr-2">Show All Data</label>
                        <input
                            type="checkbox"
                            checked={showAllData}
                            onChange={() => setShowAllData(!showAllData)}
                        />
                    </div>

                    {!showAllData && (
                        <div>
                            {invoices.length > itemsPerPage && (
                                <Pagination
                                    totalItems={invoices.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={changePage}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Invoice;
