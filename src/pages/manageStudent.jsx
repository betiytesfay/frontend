import React, { useEffect, useState } from "react";
import StudentTable from "../components/students/StudentTable";
import StudentMobileCard from "../components/students/StudentMobileCard";
import DeleteStudentModal from "../components/students/DeleteStudentModal";

import {
  getStudents,
  deleteStudent,
} from "../services/studentServices";

import { normalizeStudent } from "../utils/normalizeStudent";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      const list = Array.isArray(data) ? data : data.students || [];
      setStudents(list.map(normalizeStudent));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      setShowDelete(false);
      fetchStudents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

      {/* TABLE (desktop) */}
      <div className="hidden sm:block">
        <StudentTable
          students={students}
          onView={(s) => console.log(s)}
          onEdit={(s) => console.log(s)}
          onDelete={(s) => {
            setSelectedStudent(s);
            setShowDelete(true);
          }}
        />
      </div>

      {/* MOBILE CARDS */}
      <div className="sm:hidden">
        {students.map((s) => (
          <StudentMobileCard
            key={s.id}
            student={s}
            onView={(s) => console.log(s)}
            onEdit={(s) => console.log(s)}
            onDelete={(s) => {
              setSelectedStudent(s);
              setShowDelete(true);
            }}
          />
        ))}
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <DeleteStudentModal
          student={selectedStudent}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ManageStudents;