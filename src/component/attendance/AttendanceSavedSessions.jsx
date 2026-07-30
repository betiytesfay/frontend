import React from "react";

export const AttendanceSavedSessions = ({
  savedSessions,
  modalSession, setModalSession,
  getCourseNameById,
  handleSendSession,
  deleteSession,
  handleExportSession,
  handleSendAll,
  loading,
}) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-[#D4AF35] mb-2">Saved Attendance Sessions</h2>
      {savedSessions.length === 0 ? (
        <p className="text-gray-600">No saved sessions yet.</p>
      ) : (
        <>
          {/* Mobile view */}
          <div className="flex flex-col gap-2 sm:hidden">
            {savedSessions.map((session) => (
              <div
                key={session.id}
                className="border rounded-lg p-4 shadow-sm cursor-pointer flex justify-between items-center bg-white hover:bg-gray-50"
                onClick={() => setModalSession(session)}
              >
                <div>
                  <h3 className="font-bold text-gray-800">{session.date}</h3>
                  <p className="text-gray-600 text-sm">
                    Batch: {session.batchId} | Course: {getCourseNameById(session.courseId)}
                  </p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            ))}

            {modalSession && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg">
                  <h3 className="font-bold text-lg mb-2">Session: {modalSession.date}</h3>
                  <p><strong>Batch:</strong> {modalSession.batchId}</p>
                  <p><strong>Course:</strong> {getCourseNameById(modalSession.courseId)}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Students Present:</h4>
                    <ul className="max-h-48 overflow-y-auto">
                      {modalSession.students.map((s) => (
                        <li key={s.student_id} className="border-b py-1 text-sm">
                          {s.student_id} - {s.name || "Present"}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleSendSession(modalSession)}
                      disabled={loading}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1 text-sm"
                    >
                      {loading ? "Sending..." : "Send"}
                    </button>
                    <button
                      onClick={() => { deleteSession(modalSession.id); setModalSession(null); }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1 text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setModalSession(null)}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 flex-1 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Desktop view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left">Date</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Course</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Batch</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Students</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2">{session.date}</td>
                    <td className="border border-gray-300 px-3 py-2">{getCourseNameById(session.courseId)}</td>
                    <td className="border border-gray-300 px-3 py-2">{session.batchId}</td>
                    <td className="border border-gray-300 px-3 py-2">{session.students.length}</td>
                    <td className="border border-gray-300 px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendSession(session)}
                          disabled={loading}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs font-medium"
                        >
                          {loading ? "..." : "Send"}
                        </button>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-medium"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleExportSession(session)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs font-medium"
                        >
                          Export
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {savedSessions.length > 0 && (
        <button
          onClick={handleSendAll}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50 mt-4 w-full font-medium"
        >
          {loading ? "Sending..." : "Send All Sessions to Backend"}
        </button>
      )}
    </div>
  );
};
