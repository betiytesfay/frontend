import { useState, useEffect } from "react";
import {
  fetchStudentsApi,
  fetchStudentByIdApi,
  searchStudentsApi,
  createStudentApi,
  updateStudentApi,
  deleteStudentApi,
} from "../services/studentService";

export function useStudents() {
  // === Students State ===
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAction, setSelectedAction] = useState("");

  // === Form Fields State ===
  const [studentFirstName, setStudentFirstName] = useState("");
  const [studentLastName, setStudentLastName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentGender, setStudentGender] = useState("male");
  const [studentDepartment, setStudentDepartment] = useState("");

  // === Filter & Search State ===
  const [searchId, setSearchId] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // === Pagination State ===
  const [page, setPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);

  // === Popup / Modal States ===
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);

  const fetchStudents = async () => {
    try {
      const normalized = await fetchStudentsApi();
      setStudents(normalized);
      setFilteredStudents(normalized);
    } catch (err) {
      console.error("Backend error:", err);
      alert("Cannot fetch students from backend. Please check the server.");
    }
  };

  const applyFilter = () => {
    let filtered = [...students];

    if (filterName) {
      filtered = filtered.filter(s =>
        `${s.firstname} ${s.lastname}`.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterDepartment) {
      filtered = filtered.filter(s =>
        s.department.toLowerCase() === filterDepartment.toLowerCase()
      );
    }
    if (filterGender) {
      filtered = filtered.filter(s =>
        s.gender.toLowerCase() === filterGender.toLowerCase()
      );
    }

    setFilteredStudents(filtered);
    setPage(1);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const search = searchId.trim().toLowerCase();
    let filtered = [...students];

    if (search) {
      filtered = filtered.filter(s =>
        s.id.toLowerCase().includes(search) ||
        `${s.firstname} ${s.lastname}`.toLowerCase().includes(search)
      );
    }
    if (filterName) {
      filtered = filtered.filter(s =>
        `${s.firstname} ${s.lastname}`.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterDepartment) {
      filtered = filtered.filter(s =>
        s.department.toLowerCase() === filterDepartment.toLowerCase()
      );
    }
    if (filterGender) {
      filtered = filtered.filter(s =>
        s.gender.toLowerCase() === filterGender.toLowerCase()
      );
    }

    setFilteredStudents(filtered);
    setPage(1);
  }, [searchId, filterName, filterDepartment, filterGender, students]);

  const searchStudents = async () => {
    try {
      const list = await searchStudentsApi({ searchId, filterName, filterDepartment });
      setStudents(list);
    } catch (err) {
      console.error(err);
      alert('Search failed');
    }
  };

  const fetchStudentById = async (query) => {
    const search = (query || searchId || "").trim();
    if (!search) {
      fetchStudents();
      return;
    }
    const fullId = search.startsWith("UGR-") ? search : `UGR-${search}`;
    try {
      const student = await fetchStudentByIdApi(fullId);
      setStudents([student]);
    } catch (err) {
      console.error(err);
      alert("Cannot fetch student by id");
    }
  };

  const openDeleteConfirm = (student) => {
    setSelectedStudent(student);
    setShowDeletePopup(true);
  };

  const openEditForm = (student) => {
    setSelectedStudent(student);
    setStudentFirstName(student.firstname);
    setStudentLastName(student.lastname);
    setStudentPhone(student.phone);
    setStudentGender(student.gender);
    setStudentDepartment(student.department);
    setStudentEmail(student.email);
    setShowEditPopup(true);
  };

  const fetchStudentAndOpenView = async (id) => {
    try {
      const student = await fetchStudentByIdApi(id);
      setSelectedStudent(student);
      setShowViewPopup(true);
    } catch (err) {
      console.error(err);
      alert('Could not fetch student');
    }
  };

  const clearForm = () => {
    setStudentFirstName("");
    setStudentLastName("");
    setStudentId("");
    setStudentPhone("");
    setStudentGender("male");
    setStudentDepartment("");
    setStudentEmail("");
  };

  const handleAddStudent = async () => {
    const f = (studentFirstName || "").trim();
    const l = (studentLastName || "").trim();
    const id = (studentId || "").trim();
    const dept = (studentDepartment || "").toString().trim();
    const email = (studentEmail || "").trim();
    const phone = (studentPhone || "").toString().trim();
    const gender = (studentGender || "").toString().trim();

    if (!f || !l || !dept || !email || !phone || !gender || !id) {
      return alert("Please fill out all student info.");
    }

    const studentList = Array.isArray(students) ? students : [];
    if (studentList.find(s => s?.email === email)) return alert('A student with this email already exists.');
    if (studentList.find(s => s?.id === id)) return alert('A student with this ID already exists.');
    if (studentList.find(s => s?.phone === phone)) return alert('A student with this phone number already exists.');

    try {
      const created = await createStudentApi({
        firstname: f,
        lastname: l,
        id,
        department: dept,
        email,
        phone,
        gender,
      });
      setStudents(prev => [...prev, created]);
      clearForm();
    } catch (error) {
      console.error("Error:", error);
      alert("Cannot connect to backend");
    }
  };

  const handleSaveEditStudent = async (id) => {
    try {
      await updateStudentApi(id, {
        firstname: studentFirstName,
        lastname: studentLastName,
        phone: studentPhone,
        department: studentDepartment,
        email: studentEmail,
      });
      await fetchStudents();
      clearForm();
      alert("Student updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Could not connect to backend");
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudentApi(id);
      await fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Could not connect to backend");
    }
  };

  const resetAllState = () => {
    setShowViewPopup(false);
    setShowEditPopup(false);
    setShowAddPopup(false);
    setShowDeletePopup(false);
    setSelectedStudent(null);
    setSearchId("");
    setFilterName("");
    setFilterDepartment("");
    setFilterGender("");
    setPage(1);
  };

  // Calculate pagination
  const startIndex = (page - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage) || 1;

  return {
    students,
    filteredStudents,
    paginatedStudents,
    selectedStudent,
    setSelectedStudent,
    selectedAction,
    setSelectedAction,

    // Form fields
    studentFirstName, setStudentFirstName,
    studentLastName, setStudentLastName,
    studentEmail, setStudentEmail,
    studentPhone, setStudentPhone,
    studentId, setStudentId,
    studentGender, setStudentGender,
    studentDepartment, setStudentDepartment,

    // Filter & Search
    searchId, setSearchId,
    showFilter, setShowFilter,
    filterName, setFilterName,
    filterDepartment, setFilterDepartment,
    filterGender, setFilterGender,
    isSearchActive, setIsSearchActive,
    applyFilter,
    searchStudents,
    fetchStudentById,

    // Pagination
    page, setPage,
    studentsPerPage, setStudentsPerPage,
    totalPages,

    // Modals
    showAddPopup, setShowAddPopup,
    showDeletePopup, setShowDeletePopup,
    showEditPopup, setShowEditPopup,
    showViewPopup, setShowViewPopup,
    openDeleteConfirm,
    openEditForm,
    fetchStudentAndOpenView,

    // Actions
    fetchStudents,
    handleAddStudent,
    handleSaveEditStudent,
    handleDeleteStudent,
    resetAllState,
  };
}