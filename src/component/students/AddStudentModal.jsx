const AddStudentModal = ({ onClose, onAdd }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-3">Add Student</h2>

        <p>Form goes here</p>

        <div className="flex justify-between mt-4">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;