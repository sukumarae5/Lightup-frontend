import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const UserProfile = () => {
  const { data = [] } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setProfile({
        firstName: user.name || "",
        lastName: "",
        email: user.email || "",
        phoneNo: user.phone_number || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profile.newPassword !== profile.confirmNewPassword) {
      showSnackbar("New passwords do not match!", "error");
      return;
    }

    // Simulate profile update
    showSnackbar("Profile updated successfully!", "success");
  };

  const handleCancel = () => {
    showSnackbar("Changes canceled!", "info");
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold text-red-500 mb-6">Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        {/* Email and Phone Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            value={profile.phoneNo}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Password Changes */}
        <h3 className="text-lg font-semibold mt-4 mb-2">Password Changes</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={profile.currentPassword}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Confirm New Password</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={profile.confirmNewPassword}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 border rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default UserProfile;
