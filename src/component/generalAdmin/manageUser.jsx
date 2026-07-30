import React, { useEffect } from "react";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { useUserStore } from "../../stores/useUserStore";
import { UserFilters } from "./users/UserFilters";
import { UserTable } from "./users/UserTable";
import { UserMobileCards } from "./users/UserMobileCards";
import { UserAddForm } from "./users/UserAddForm";
import { UserModals } from "./users/UserModals";
import { StudentPagination } from "./studentComponents/StudentPagination";

const ManageUser = ({ setSelectedCategory }) => {
  const {
    users,
    fetchUsers,
    selectedAction,
    setSelectedAction,
    page, setPage,
    pageSize, setPageSize,
    clearForm,
  } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / pageSize) || 1;
  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);

  const handleBack = () => {
    clearForm();
    if (selectedAction) {
      setSelectedAction("");
    } else if (setSelectedCategory) {
      setSelectedCategory("");
    } else {
      fetchUsers();
    }
  };

  return (
    <div className="bg-white p-3 sm:p-5 md:p-6 w-full max-w-full mx-auto flex flex-col gap-3 mt-2 sm:mt-4 md:mt-8 rounded-xl shadow-md overflow-x-hidden min-h-screen">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <FaArrowLeft />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="font-bold text-lg text-gray-800">Manage Users</h2>
        <button
          onClick={() => setSelectedAction("add")}
          className="flex items-center gap-1 bg-[#D7B450] text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
        >
          <FaUserPlus />
          <span className="hidden sm:inline">Add User</span>
        </button>
      </div>

      {/* Main Content View */}
      {!selectedAction && (
        <>
          <UserFilters />
          <UserTable paginatedUsers={paginatedUsers} />
          <UserMobileCards paginatedUsers={paginatedUsers} />
          <StudentPagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            studentsPerPage={pageSize}
            setStudentsPerPage={setPageSize}
          />
        </>
      )}

      {/* Add User View */}
      {selectedAction === "add" && <UserAddForm />}

      {/* Modals Popup Dialogs */}
      <UserModals />
    </div>
  );
};

export default ManageUser;
