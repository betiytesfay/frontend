import React from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { useUserStore } from "../../../stores/useUserStore";

export const UserFilters = () => {
  const { searchId, setSearchId, fetchUserById, showFilter, setShowFilter, isSearchActive, setIsSearchActive } = useUserStore();

  return (
    <div className="mb-2 flex flex-row mt-2">
      <input
        type="text"
        placeholder="User ID or Username"
        value={searchId}
        onFocus={() => setIsSearchActive(true)}
        onChange={(e) => setSearchId(e.target.value)}
        className="border px-3 py-2 rounded w-full"
      />
      <button
        onClick={() => fetchUserById(searchId)}
        className="p-2 bg-[#D7B450] text-white rounded ml-1"
      >
        <FaSearch className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="p-2 bg-gray-200 rounded ml-1"
      >
        <FaFilter className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};
