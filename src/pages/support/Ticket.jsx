import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import TicketSkeletonLoader from "../../components/TicketSckeletonLoader";

const Ticket = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  const [ticket, setTicket] = useState();
  const successNotify = (message) => {
    return toast.success(message);
  };
  const errorsNotify = (message) => {
    return toast.error(message);
  };
  const { state } = useLocation();
  const ticketId = state.ticketid;
  const [loading, setLoading] = useState(true);

  

  //get the ticket
  const getTicket = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:5000/api/ticket?id=${ticketId}`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `bearer ${token}` },
      });

      if (data.statusCode === 0) {
        return errorsNotify(data.message);
      }

      setTicket(data.data.ticket);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      return errorsNotify(error.message);
    }
  };



  //delete ticket
  const deleteTicket = async (id) => {
    try {
      const url = `http://localhost:5000/api/delete/ticket?ticketid=${id}`;
      const { data } = await axios.delete(url, {
        headers: { Authorization: `bearer ${token}` },
      });
      if (data.statusCode === 0) return errorsNotify(data.message);
      return successNotify(data.message);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        return errorsNotify("Unauthorized");
      }
      return errorsNotify(error.message);
    }
  };



  //updating the status of the ticket
  const updateStatus = async (id) => {
    try {
      const url = `http://localhost:5000/api/update/ticket?ticketid=${id}`;
      const { data } = await axios.patch(
        url,
        {},
        {
          headers: { Authorization: `bearer ${token}` },
        }
      );
      if (data.statusCode === 0) return errorsNotify(data.message);
      getTicket();
      return successNotify(data.message);
    } catch (error) {
      return errorsNotify(error.message);
    }
  };



  useEffect(() => {
    getTicket();
  }, []);



  return (
    <>
      <ToastContainer />
      {/* {ticket && (  */}

      {
        loading ? (
          <TicketSkeletonLoader />
        ) : (
          <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full bg-gray-800 shadow-lg rounded-lg p-6">
              {/* Header Section */}
              <div>
                <button
                  onClick={() => navigate("/Support")}
                  className="bg-gray-600 p-2 rounded hover:bg-gray-700"
                >
                  Back
                </button>
              </div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-1xl font-semibold text-white">
                  Issue: {ticket.issue}
                </h2>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    ticket.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : ticket.status === "Resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              {/* User Info */}
              <div className="text-sm text-white mb-4">
                <p>
                  User:{" "}
                  <span className="font-medium text-white0">
                    {ticket.username}
                  </span>
                </p>
                <p>
                  Email: <span className="text-white">{ticket.useremail}</span>
                </p>
              </div>

              {/* Ticket Message */}
              <div className="bg-gray-600 p-3 rounded-lg mb-6">
                <p className="text-white text-"> Message: {ticket.message}</p>
              </div>

              {/* Ticket Actions */}
              <div className="flex gap-4 items-center mb-6">
                {ticket.status !== "Resolved" && (
                  <button
                    onClick={() => updateStatus(ticket.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                  >
                    Resolve Issue
                  </button>
                )}
                <button
                  onClick={() => deleteTicket(ticket.id)}
                  className="px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
                >
                  Delete Ticket
                </button>
                <button
                  onClick={() =>
                    navigate("/support/chat", {
                      state: { ticketid: ticket.id },
                    })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Chat
                </button>
              </div>

              {/* Date Information */}
              <div className="flex justify-between text-sm text-gray-500">
                <p>Created At: {new Date(ticket.createdAt).toLocaleString()}</p>
                <p>
                  Last Updated: {new Date(ticket.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )
        // )}
      }
    </>
  );
};

export default Ticket;
