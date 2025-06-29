import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../redux/features/adminSlice";
import { FaCalendarAlt, FaClock, FaSpinner } from "react-icons/fa";

const Appointments = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  if (loading)
    return (
      <div className=" p-4 flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-start space-y-4">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          <p className="text-gray-600 text-lg">Loading appointments...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="ml-[256px] lg:ml-[256px] md:ml-[64px] p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error.message || "Failed to load appointments"}</p>
        </div>
      </div>
    );

  if (!appointments || !Array.isArray(appointments)) {
    return (
      <div className="ml-[256px] lg:ml-[256px] md:ml-[64px] p-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>No appointments found</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-4 pt-5  bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
        <p className="text-gray-600">Manage all patient appointments</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Slot
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr
                  key={appointment._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3" />
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaClock className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
