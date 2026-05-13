const ViewStudentModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-80">
        <h2 className="text-lg font-bold mb-3">Student Details</h2>

        <p><b>Name:</b> {student.firstname} {student.lastname}</p>
        <p><b>ID:</b> {student.id}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Phone:</b> {student.phone}</p>
        <p><b>Department:</b> {student.department}</p>

        <button
          className="mt-4 px-4 py-2 bg-gray-300 rounded w-full"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewStudentModal;