export default function AttendanceFilter({
  presentCount,
  absentCount,
  filterPresent,
  filterAbsent,
  setFilterPresent,
  setFilterAbsent
}) {

  return (
    <div className="mt-4 flex gap-2 flex-wrap">

      <button
        onClick={() => {
          setFilterPresent(!filterPresent);
          setFilterAbsent(false);
        }}
        className={`px-3 py-1 text-sm rounded ${filterPresent
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        Show Present Only ({presentCount})
      </button>

      <button
        onClick={() => {
          setFilterAbsent(!filterAbsent);
          setFilterPresent(false);
        }}
        className={`px-3 py-1 text-sm rounded ${filterAbsent
            ? 'bg-red-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        Show Absent Only ({absentCount})
      </button>

      {(filterPresent || filterAbsent) && (
        <button
          onClick={() => {
            setFilterPresent(false);
            setFilterAbsent(false);
          }}
          className="px-3 py-1 text-sm rounded bg-yellow-400 text-black hover:bg-yellow-500"
        >
          Clear Filter
        </button>
      )}

    </div>
  );
}