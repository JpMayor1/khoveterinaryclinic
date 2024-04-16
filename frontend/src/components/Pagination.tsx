import { useState } from "react";

const Pagination = ({
    totalItems,
    itemsPerPage,
    onPageChange,
}: {
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (pageNumber: number) => void;
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxButtonsToShow = 5;
    const firstPageIndex = Math.max(
        currentPage - Math.floor(maxButtonsToShow / 2),
        1
    );
    const lastPageIndex = Math.min(
        firstPageIndex + maxButtonsToShow - 1,
        totalPages
    );

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        onPageChange(pageNumber);
    };

    return (
        <div className="flex my-4 w-full justify-center items-center gap-1">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-1 px-3 py-1 border border-primary cursor-pointer"
            >
                Previous
            </button>
            {Array.from(
                { length: lastPageIndex - firstPageIndex + 1 },
                (_, index) => {
                    const pageNumber = firstPageIndex + index;
                    return (
                        <button
                            key={pageNumber}
                            className={`mx-1 px-3 py-1 border border-primary ${
                                pageNumber === currentPage
                                    ? "bg-primary text-light"
                                    : "bg-light"
                            }`}
                            onClick={() => handlePageChange(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    );
                }
            )}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="mx-1 px-3 py-1 border border-primary cursor-pointer"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
