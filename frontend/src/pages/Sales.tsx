import { toast } from "react-toastify";
import { MdPrint } from "react-icons/md";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { DailySalesType } from "../utils/Types";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import Pagination from "../components/Pagination";
import formatPrice from "../utils/formatPrice";
import axios from "axios";

const url = import.meta.env.VITE_URL;

const Sales = () => {
    const [loading, setLoading] = useState(false);
    const [dailySales, setDailySales] = useState<DailySalesType[]>([]);
    const [searchStartDate, setSearchStartDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [showAllData, setShowAllData] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    useEffect(() => {
        const getDailySales = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${url}/api/sales`);
                setDailySales(res.data);
            } catch (error) {
                console.log(error);
                toast.error("Error getting daily sales");
            } finally {
                setLoading(false);
            }
        };

        getDailySales();
    }, []);

    const paginatedData = showAllData
        ? dailySales
        : dailySales.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
          );

    const changePage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const filterDataSearch = async () => {
        setLoading(true);
        setCurrentPage(1);
        try {
            const res = await axios.post(`${url}/api/sales/filter`, {
                startDate: searchStartDate,
                endDate: searchEndDate,
            });
            const formattedData = res.data.map((sale: DailySalesType) => ({
                ...sale,
                date: new Date(sale.date).toLocaleDateString("en-US"),
            }));
            setDailySales(formattedData);
        } catch (error) {
            console.log(error);
            toast.error("Error getting daily sales");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: Date | string) => {
        const date = new Date(dateStr);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const print = () => {
        window.print();
    };

    return (
        <div className="w-full h-full flex flex-col justify-start items-center pb-3">
            {loading ? (
                <div className="h-screen w-full flex justify-center items-center">
                    <PulseLoaderComponent size={20} />
                </div>
            ) : (
                <>
                    <div className="w-full py-3 px-5 flex justify-between">
                        <h1 className="text-3xl font-semibold">Sales</h1>
                        <button
                            className="hidden lg:block bg-dark text-light p-3 rounded-md text-2xl"
                            onClick={print}
                        >
                            <MdPrint />
                        </button>
                    </div>
                    <div className="w-full flex flex-col gap-2 lg:flex-row lg:justify-center items-center px-4">
                        <div className="flex items-center justify-start gap-2">
                            <div className="flex items-center">
                                <input
                                    type="date"
                                    value={searchStartDate}
                                    onChange={(e) =>
                                        setSearchStartDate(e.target.value)
                                    }
                                    className="w-[150px] lg:w-56 p-2 border-2 rounded-md focus:outline-none"
                                    placeholder="Start date: MM/DD/YYYY"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="date"
                                    value={searchEndDate}
                                    onChange={(e) =>
                                        setSearchEndDate(e.target.value)
                                    }
                                    className="w-[120px] lg:w-56 p-2 border-2 rounded-md focus:outline-none"
                                    placeholder="End date: MM/DD/YYYY"
                                />
                            </div>
                            <button
                                className="bg-dark hover:bg-dark/90 text-light p-[10px] rounded-md focus:outline-none text-2xl"
                                onClick={filterDataSearch}
                            >
                                <BiSearchAlt />
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex justify-center p-2">
                        <table className="w-full lg:w-[60%] h-full border border-dark print-table">
                            <thead>
                                <tr className="bg-primary text-light">
                                    <th className="py-2 px-4">Date</th>
                                    <th className="py-2 px-4">Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData
                                    .slice()
                                    .reverse()
                                    .map((sale) => (
                                        <tr
                                            key={sale.date}
                                            className="border-t border-dark/70"
                                        >
                                            <td className="py-2 px-4 text-center border border-dark/70">
                                                {formatDate(sale.date)}
                                            </td>
                                            <td className="py-2 px-4 text-center border border-dark/70">
                                                {formatPrice(sale.dailySales)}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full lg:w-[60%] flex justify-between py-4 px-2">
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
                                {dailySales.length > itemsPerPage && (
                                    <Pagination
                                        totalItems={dailySales.length}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={changePage}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sales;
