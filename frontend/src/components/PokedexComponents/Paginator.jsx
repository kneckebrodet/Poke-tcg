function Paginator({ page, totalPages, onPageChange }) {
    if (totalPages === 0){
        page = 0
    }

    return (
        <div className="flex justify-center items-center gap-[2vw] mt-[2vh] mb-[2vh] h-[5vh]">
            <button
                className="h-[100%] px-[1vw] text-sm bg-white border border-gray-500 rounded-md cursor-pointer disabled:opacity-0 disabled:cursor-default min-h-[20px]"
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page <= 1}
            >
                Prev
            </button>
            <span>
                Page {page} of {totalPages}
            </span>
            <button
                className="h-[100%] px-[1vw] text-sm bg-white border border-gray-500 rounded-md cursor-pointer disabled:opacity-0 disabled:cursor-default min-h-[20px]"
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
}

export default Paginator;
