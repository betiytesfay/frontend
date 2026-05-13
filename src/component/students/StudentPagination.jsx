const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="flex gap-2 mt-4">
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Prev
      </button>

      <span>{page} / {totalPages}</span>

      <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;