import { useState } from "react";
import { DailySalesType } from "../utils/Types";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import PulseLoaderComponent from "../components/PulseLoaderComponent";
import LineChartComponent from "./LineChartComponent";
import formatPrice from "../utils/formatPrice";

const DailySalesComponent = ({
    dailySales,
    loading,
}: {
    dailySales: DailySalesType[];
    loading: boolean;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPageIndex, setFirstPageIndex] = useState(0);

    const formatDate = (dateStr: Date | string) => {
        const date = new Date(dateStr);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const itemsPerPage = 7;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dailySales.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const totalPages = Math.ceil(dailySales.length / itemsPerPage);
        const maxButtonsToShow = 5;
        const lastPageIndex = Math.min(
            firstPageIndex + maxButtonsToShow,
            totalPages
        );

        return (
            <div className="flex my-4 w-full justify-center items-center gap-1">
                <SlArrowLeft
                    onClick={() => {
                        if (firstPageIndex > 0) {
                            setFirstPageIndex((prev) => prev - 1);
                        }
                    }}
                    className="cursor-pointer"
                />
                {Array.from({ length: maxButtonsToShow }, (_, index) => {
                    const pageNumber = firstPageIndex + index + 1;
                    return pageNumber <= lastPageIndex ? (
                        <button
                            key={pageNumber}
                            className={`mx-1 px-3 py-1 border border-primary ${
                                pageNumber === currentPage
                                    ? "bg-primary text-light"
                                    : "bg-light"
                            }`}
                            onClick={() => paginate(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    ) : null;
                })}
                <SlArrowRight
                    onClick={() => {
                        if (lastPageIndex < totalPages) {
                            setFirstPageIndex((prev) => prev + 1);
                        }
                    }}
                    className="cursor-pointer"
                />
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col justify-center items-center">
            {loading ? (
                <PulseLoaderComponent size={20} />
            ) : (
                <>
                    <div className="w-full lg:flex lg:gap-2 p-3">
                        <div className="w-full lg:w-[40%]">
                            <table className="w-full h-fit border border-dark">
                                <thead>
                                    <tr className="bg-primary text-light">
                                        <th className="py-2 px-4">Date</th>
                                        <th className="py-2 px-4">
                                            Total Sales
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems
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
                                                    {formatPrice(
                                                        sale.dailySales
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {dailySales.length > 10 &&
                                renderPaginationButtons()}
                        </div>

                        <div className="w-full h-full lg:h-[400px]">
                            <LineChartComponent data={currentItems} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DailySalesComponent;
