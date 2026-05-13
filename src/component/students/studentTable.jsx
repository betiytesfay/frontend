const StudentTable = ({
  students,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <table className="min-w-full border">
      <thead className="bg-yellow-100">
        <tr>
          <th className="p-2">#</th>
          <th className="p-2">Name</th>
          <th className="p-2">Department</th>
          <th className="p-2">Phone</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {students.map((s, index) => (
          <tr
            key={s.id}
            className="border-b hover:bg-gray-50"
          >
            <td className="p-2">{index + 1}</td>

            <td className="p-2">
              {s.firstname} {s.lastname}
            </td>

            <td className="p-2">
              {s.department}
            </td>

            <td className="p-2">
              {s.phone}
            </td>

            <td className="p-2 flex gap-2">
              <button onClick={() => onView(s)}>
                View
              </button>

              <button onClick={() => onEdit(s)}>
                Edit
              </button>

              <button onClick={() => onDelete(s)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;