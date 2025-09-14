import { useState,useEffect } from "react";
import axios from "axios"
export default function Notes({
  notes,
  onCreate,
  onDelete,
  tenantPlan,
  onUpgrade,
  onLogout,
  user,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [upgradeRequested, setUpgradeRequested] = useState(false); 
useEffect(() => {
  const checkStatus = async () => {
    try {
      const res = await axios.get("https://notes-saas-app.onrender.com/api/upgrade/status", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data) {
        if (res.data.status === "pending") {
          setUpgradeRequested(true);
        } else if (res.data.status === "approved") {
          alert("Your upgrade was approved! 🎉 You can now add unlimited notes.");
          setUpgradeRequested(false);
        } else if (res.data.status === "rejected") {
          alert("Your upgrade request was rejected 😔");
          setUpgradeRequested(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (tenantPlan === "free") {
    checkStatus();
  }
}, [tenantPlan, user.token]);

const handleUpgrade = async () => {
  console.log("Token being sent:", user.token);
  try {
    await axios.post(
      "https://notes-saas-app.onrender.com/api/upgrade/request",
      {},
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setUpgradeRequested(true); // block adding notes until admin approves
    alert("Upgrade request sent to admin. Waiting for approval...");
  } catch (err) {
    alert(err.response?.data?.message || "Error sending upgrade request");
    console.error(err);
  }
};
  const handleCreate = (e) => {
    e.preventDefault();
    if (tenantPlan === "free" && (notes.length >= 3 || upgradeRequested)) {
      alert(
        upgradeRequested
          ? "Upgrade request pending. Wait for admin approval."
          : "Free plan limit reached."
      );
      return;
    }; 
    onCreate(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Bar with Logout */}
      <div className="flex justify-end mb-4 max-w-4xl mx-auto">
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-3 cursor-pointer py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Greeting */}
      <div className="max-w-4xl mx-auto mb-2">
        <span className="text-gray-700 text-xl font-semibold">
          Hello User @ {user?.company || "Acme"}
        </span>
      </div>

      {/* Heading Below Greeting */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Notes</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        {/* Create Note Form */}
        <form onSubmit={handleCreate} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Note Title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Note Content"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={tenantPlan === "free" && (notes.length >= 3 || upgradeRequested)}
            className={`px-4 py-2 rounded-lg cursor-pointer transition ${
              tenantPlan === "free" && (notes.length >= 3 || upgradeRequested)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Add Note
          </button>
        </form>

        {/* Upgrade Banner */}
        {tenantPlan === "free" && notes.length >= 3 &&  !upgradeRequested && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-lg mb-6">
            <p className="mb-2">
              You’ve reached the Free Plan limit (3 notes).
            </p>
            <button
              onClick={handleUpgrade}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Upgrade to Pro
            </button>
          </div>
        )}
        {/* Pending approval message */}
        {tenantPlan === "free" && upgradeRequested && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6">
            Upgrade request sent. Waiting for admin approval...
          </div>
        )}
        {/* Notes List */}
        {notes.length === 0 ? (
          <p className="text-gray-500 text-center">No notes yet. Add one!</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm flex justify-between items-start hover:shadow-md transition"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    {note.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{note.content}</p>
                </div>
                <button
                  onClick={() => onDelete(note._id)}
                  className="text-red-500 hover:text-red-700 font-medium ml-4"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
