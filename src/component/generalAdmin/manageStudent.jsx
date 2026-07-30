import React from "react";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";
import { useStudents } from "../../hooks/useStudents";
import { StudentFilters } from "./studentComponents/StudentFilters";
import { StudentTable } from "./studentComponents/StudentTable";
import { StudentMobileCards } from "./studentComponents/StudentMobileCards";
import { StudentPagination } from "./studentComponents/StudentPagination";
import { StudentAddForm } from "./studentComponents/StudentAddForm";
import { StudentActionCards } from "./studentComponents/StudentActionCards";
import { StudentModals } from "./studentComponents/StudentModals";

const ManageStudents = ({ setSelectedCategory }) => {
  const s = useStudents();

  const handleBack = () => {
    s.resetAllState();
    if (s.selectedAction) {
      s.setSelectedAction("");
    } else if (setSelectedCategory) {
      setSelectedCategory("");
    } else {
      s.fetchStudents();
    }
  };

  return (
    <div className="bg-white p-3 sm:p-5 md:p-6 w-full max-w-full mx-auto flex flex-col gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-4 md:mt-8 rounded-xl shadow-md overflow-x-hidden min-h-screen">
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          <FaArrowLeft />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h2 className="font-bold text-lg">Students</h2>
        <button
          onClick={() => s.setSelectedAction("add")}
          className="flex items-center gap-1 bg-[#D7B450] text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
        >
          <FaUserPlus />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Main Student List & Filters View */}
      {!s.selectedAction && (
        <>
          <StudentFilters
            searchId={s.searchId}
            setSearchId={s.setSearchId}
            setIsSearchActive={s.setIsSearchActive}
            showFilter={s.showFilter}
            setShowFilter={s.setShowFilter}
            filterName={s.filterName}
            setFilterName={s.setFilterName}
            filterDepartment={s.filterDepartment}
            setFilterDepartment={s.setFilterDepartment}
            filterGender={s.filterGender}
            setFilterGender={s.setFilterGender}
            applyFilter={s.applyFilter}
          />

          <div className="flex flex-col gap-3 mt-2 px-1">
            <StudentTable
              filteredStudents={s.paginatedStudents}
              fetchStudentAndOpenView={s.fetchStudentAndOpenView}
              openEditForm={s.openEditForm}
              openDeleteConfirm={s.openDeleteConfirm}
            />

            <StudentMobileCards
              filteredStudents={s.paginatedStudents}
              fetchStudentAndOpenView={s.fetchStudentAndOpenView}
              openEditForm={s.openEditForm}
              openDeleteConfirm={s.openDeleteConfirm}
            />

            <StudentPagination
              page={s.page}
              setPage={s.setPage}
              totalPages={s.totalPages}
              studentsPerPage={s.studentsPerPage}
              setStudentsPerPage={s.setStudentsPerPage}
            />
          </div>
        </>
      )}

      {/* Add Student Form */}
      {s.selectedAction === "add" && (
        <StudentAddForm
          studentFirstName={s.studentFirstName} setStudentFirstName={s.setStudentFirstName}
          studentLastName={s.studentLastName} setStudentLastName={s.setStudentLastName}
          studentId={s.studentId} setStudentId={s.setStudentId}
          studentPhone={s.studentPhone} setStudentPhone={s.setStudentPhone}
          studentEmail={s.studentEmail} setStudentEmail={s.setStudentEmail}
          studentDepartment={s.studentDepartment} setStudentDepartment={s.setStudentDepartment}
          studentGender={s.studentGender} setStudentGender={s.setStudentGender}
          setShowAddPopup={s.setShowAddPopup}
        />
      )}

      {/* Edit / View Action Cards */}
      {(s.selectedAction === "edit" || s.selectedAction === "view") && (
        <StudentActionCards
          selectedAction={s.selectedAction}
          paginatedStudents={s.paginatedStudents}
          students={s.students}
          searchId={s.searchId}
          setSearchId={s.setSearchId}
          fetchStudentById={s.fetchStudentById}
          showFilter={s.showFilter}
          setShowFilter={s.setShowFilter}
          filterName={s.filterName}
          setFilterName={s.setFilterName}
          filterDepartment={s.filterDepartment}
          setFilterDepartment={s.setFilterDepartment}
          applyFilter={s.applyFilter}
          openEditForm={s.openEditForm}
          openDeleteConfirm={s.openDeleteConfirm}
          fetchStudentAndOpenView={s.fetchStudentAndOpenView}
        />
      )}

      {/* Modals Popup Dialogs */}
      <StudentModals
        showAddPopup={s.showAddPopup}
        setShowAddPopup={s.setShowAddPopup}
        handleAddStudent={s.handleAddStudent}
        studentFirstName={s.studentFirstName}
        studentLastName={s.studentLastName}
        studentPhone={s.studentPhone}
        showDeletePopup={s.showDeletePopup}
        setShowDeletePopup={s.setShowDeletePopup}
        handleDeleteStudent={s.handleDeleteStudent}
        selectedStudent={s.selectedStudent}
        showEditPopup={s.showEditPopup}
        setShowEditPopup={s.setShowEditPopup}
        handleSaveEditStudent={s.handleSaveEditStudent}
        fetchStudents={s.fetchStudents}
        setStudentFirstName={s.setStudentFirstName}
        setStudentLastName={s.setStudentLastName}
        setStudentPhone={s.setStudentPhone}
        setStudentEmail={s.setStudentEmail}
        setStudentDepartment={s.setStudentDepartment}
        setStudentGender={s.setStudentGender}
        studentEmail={s.studentEmail}
        studentDepartment={s.studentDepartment}
        studentGender={s.studentGender}
        showViewPopup={s.showViewPopup}
        setShowViewPopup={s.setShowViewPopup}
      />
    </div>
  );
};

export default ManageStudents;
