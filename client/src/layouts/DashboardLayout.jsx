import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../redux/features/appointmentSlice";
import { clearToken } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { appointments, loading, error } = useSelector(
    (state) => state.appointments
  );
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "pending",
  });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [globalError, setGlobalError] = useState("");

  // Handle global errors (from Redux)
  useEffect(() => {
    if (error) {
      setGlobalError(error);
      const timer = setTimeout(() => setGlobalError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle form errors
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  useEffect(() => {
    if (token) {
      dispatch(getAppointments());
    } else {
      navigate("/auth");
    }
  }, [token, dispatch, navigate]);

  const handleCreateOrUpdate = () => {
    if (
      !formData.title ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime
    ) {
      setFormError("All fields are required");
      return;
    }

    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (
      !timeRegex.test(formData.startTime) ||
      !timeRegex.test(formData.endTime)
    ) {
      setFormError("Invalid time format. Use HH:MM");
      return;
    }

    const [startHour, startMin] = formData.startTime.split(":").map(Number);
    const [endHour, endMin] = formData.endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    if (endMinutes <= startMinutes) {
      setFormError("End time must be after start time");
      return;
    }

    const appointmentDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      setFormError("Cannot create or update appointment for past dates");
      return;
    }

    const appointmentData = {
      title: formData.title,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      status: formData.status,
    };

    if (editingId) {
      dispatch(updateAppointment({ id: editingId, data: appointmentData }));
    } else {
      dispatch(createAppointment(appointmentData));
    }

    setFormData({
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      status: "pending",
    });
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      dispatch(deleteAppointment(id));
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment._id);
    setFormData({
      title: appointment.title,
      date: new Date(appointment.date).toISOString().split("T")[0],
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      status: appointment.status || "pending",
    });
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(clearToken());
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Error Toast */}
      {globalError && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
            <p>{globalError}</p>
          </div>
        </div>
      )}

      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Appointment Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm sm:text-base"
        >
          Logout
        </button>
      </nav>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">My Appointments</h1>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                title: "",
                date: "",
                startTime: "",
                endTime: "",
                status: "pending",
              });
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm sm:text-base w-full sm:w-auto"
          >
            Create Appointment
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
            <p>No appointments found. Create your first appointment!</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Time
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.title}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden">
                        {new Date(appointment.date).toLocaleDateString()} •{" "}
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-gray-900">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold mb-4">
                {editingId ? "Edit Appointment" : "Create Appointment"}
              </h3>

              {/* Form Error */}
              {formError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                  <p>{formError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Appointment title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1"
                    htmlFor="date"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-1"
                      htmlFor="startTime"
                    >
                      Start Time
                    </label>
                    <input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-1"
                      htmlFor="endTime"
                    >
                      End Time
                    </label>
                    <input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-1"
                    htmlFor="status"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormError("");
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateOrUpdate}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
