const SearchFilter = ({ onSearch }) => {
  return (
    <div className="flex gap-2 mb-3">
      <input
        type="text"
        placeholder="Search..."
        className="border p-2 w-full"
      />

      <button
        onClick={() => onSearch()}
        className="bg-yellow-500 px-4"
      >
        Filter
      </button>
    </div>
  );
};

export default SearchFilter;