import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaUserGraduate, FaBook, FaLayerGroup, FaUserShield, FaUserCircle, FaUserPlus, FaUserEdit, FaUserMinus, FaEye } from "react-icons/fa";

import ManageStudents from "../component/generalAdmin/manageStudent.jsx";
import ManageCourses from "../component/generalAdmin/ManageCourses.jsx";
import ManageUser from "../component/generalAdmin/manageUser.jsx";
import ManageBatchs from "../component/generalAdmin/ManageBatchs.jsx";

import axios from "axios";


const GeneralAdmin = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(""); // "students", "courses", "batches", "admins"
  const [selectedAction, setSelectedAction] = useState("");     // "add", "edit", "delete", "transfer"


  return (
    <div className="min-h-screen grid place-items-center bg-cover bg-center p-8 overflow-x-hidden" style={{ backgroundAttachment: 'fixed', backgroundImage: "url('/gbiphoto.jpg')" }}>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl  mx-auto h-auto  flex flex-col justify-between gap-6 ">


        {!selectedCategory && (
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              Welcome Back,<br />
              <span className="font-extrabold sm:text-2xl md:text-3xl lg:text-4xl">General Admin</span>
            </h1>
            <FaUserCircle className="w-10 h-10 text-gray-700" />
          </div>
        )}



        {/* Tabs */}

        {/* Step 1: Select Category */}
        {!selectedCategory && (

          <div className="sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white/70 p-4 rounded-xl shadow-md  w-full">
            <h2 className="text-lg font-semibold text-center mb-4">Manage</h2>

            <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
              <button onClick={() => setSelectedCategory("students")}
                className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 sm:text-2xl md:text-3xl lg:text-4xl active:scale-95 transition">
                <FaUserGraduate className="w-6 h-6" />
                Students
              </button>
              <button onClick={() => setSelectedCategory("courses")}
                className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 sm:text-2xl md:text-3xl lg:text-4xl active:scale-95 transition">
                <FaBook className="w-6 h-6" />
                Courses
              </button>
              <button onClick={() => setSelectedCategory("batches")}
                className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 sm:text-2xl md:text-3xl lg:text-4xl active:scale-95 transition">
                <FaLayerGroup className="w-6 h-6" />
                Batches
              </button>
              <button onClick={() => setSelectedCategory("admins")}
                className="flex items-center gap-3 bg-yellow-500 text-white px-4 py-3 rounded w-full hover:bg-yellow-600 sm:text-2xl md:text-3xl lg:text-4xl active:scale-95 transition">
                <FaUserShield className="w-6 h-6" />
                Session Admins
              </button>
            </div>
          </div>
        )}
        {selectedCategory === "students" && <ManageStudents />}
        {selectedCategory === "courses" && <ManageCourses />}
        {selectedCategory === "admins" && <ManageUser />}
        {selectedCategory === "batches" && <ManageBatchs />}


        {/* Bottom buttons */}
        <div className="flex justify-center gap-6 mt-12">

          <button
            onClick={() => {
              if (selectedAction) {
                setSelectedAction(""); // go back to category selection
              } else if (selectedCategory) {
                setSelectedCategory(""); // go back to main dashboard
              } else {
                navigate(-1); // fallback: go back in browser history
              }
            }}
            className="w-32 h-10 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          >
            Back
          </button>

          <button className="w-32 h-10 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">Next</button>
        </div>
      </div>
    </div>
  )

};
export default GeneralAdmin;
