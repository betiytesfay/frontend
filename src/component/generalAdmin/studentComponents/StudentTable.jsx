import React from "react";

export const StudentTable = ({
  filteredStudents,
  fetchStudentAndOpenView,
  openEditForm,
  openDeleteConfirm,
}) => {
  return (
    <div className="hidden sm:block w-full overflow-x-auto mt-2">
      <table className="min-w-full w-full border-collapse border border-gray-200 shadow-sm rounded-lg">
        <thead className="bg-yellow-100">
          <tr>
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Gender</th>
            <th className="px-4 py-2 text-left">Department</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s, index) => (
            <tr
              key={s.id}
              className="hover:bg-yellow-50 transition rounded-lg cursor-pointer"
              onClick={() => fetchStudentAndOpenView(s.id)}
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{s.firstname} {s.lastname}</td>
              <td className="px-4 py-2">{s.gender}</td>
              <td className="px-4 py-2">{s.department}</td>
              <td className="px-4 py-2">{s.phone}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditForm(s);
                  }}
                  className="px-2 py-1 bg-[#D7B450] text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteConfirm(s);
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
