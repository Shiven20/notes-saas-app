import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState("");

  // Fetch pending requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("https://notes-saas-app.onrender.com/api/upgrade/pending", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests", err);
      }
    };

    fetchRequests();
  }, [user.token]);

  const handleApprove = async (id) => {
    try {
      await axios.post(
        `https://notes-saas-app.onrender.com/api/upgrade/approve/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("User upgraded successfully!");
      setRequests(requests.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error approving request");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(
        `https://notes-saas-app.onrender.com/api/upgrade/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Request rejected!");
      setRequests(requests.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error rejecting request");
    }
  };

  // Invite user function
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://notes-saas-app.onrender.com/api/invite",
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setInviteStatus(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (err) {
      console.error(err);
      setInviteStatus("Failed to send invitation");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Hi Admin @ {user?.company || "Acme"}
          </h1>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Invite Users Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Invite Users</h2>
          <form className="flex items-center space-x-2" onSubmit={handleInvite}>
            <input
              type="email"
              placeholder="Enter user email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="border p-2 rounded flex-1"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
            >
              Invite
            </button>
          </form>
          {inviteStatus && <p className="text-sm text-gray-500 mt-1">{inviteStatus}</p>}
        </div>

        {/* Upgrade Requests */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Upgrade Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No pending requests</p>
          ) : (
            <ul className="space-y-2">
              {requests.map((req) => (
                <li
                  key={req._id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>
                    {req.user?.name || "Unknown"} ({req.user?.email})
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
