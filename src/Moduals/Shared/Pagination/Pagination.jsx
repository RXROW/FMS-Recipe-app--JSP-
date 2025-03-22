import React from "react"; 

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className = "",
}) => {
    // If there's only 1 page, don't render pagination
    if (totalPages <= 1) return null;

    // Helper function to create array of page numbers to display
    const getPageNumbers = () => {
        const pages = [];

        // Always add first page
        pages.push(1);

        // Calculate range around current page
        const leftSibling = Math.max(2, currentPage - siblingCount);
        const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);

        // Add ellipsis if needed before left range
        if (leftSibling > 2) {
            pages.push("...");
        }

        // Add pages in the visible range
        for (let i = leftSibling; i <= rightSibling; i++) {
            if (i !== 1 && i !== totalPages) {
                pages.push(i);
            }
        }

        // Add ellipsis if needed after right range
        if (rightSibling < totalPages - 1) {
            pages.push("...");
        }

        // Always add last page if more than one page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageClick = (page) => {
        if (page !== "..." && page !== currentPage) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav aria-label="Page navigation" className={className}>
            <ul className="pagination justify-content-center justify-content-md-end mb-0">
                {/* Previous button */}
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <i className="fa fa-chevron-left small"></i>
                    </button>
                </li>

                {/* Page numbers */}
                {pageNumbers.map((page, index) => (
                    <li
                        key={`page-${index}`}
                        className={`page-item ${page === currentPage ? "active" : ""} ${page === "..." ? "disabled" : ""
                            }`}
                    >
                        <button
                            className="page-link"
                            onClick={() => handlePageClick(page)}
                            disabled={page === "..."}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {/* Next button */}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        <i className="fa fa-chevron-right small"></i>
                    </button>
                </li>
            </ul>

            <div className="d-flex justify-content-center justify-content-md-end mt-2">
                <small className="text-muted">
                    Page {currentPage} of {totalPages}
                </small>
            </div>
        </nav>
    );
};

 
export default Pagination;