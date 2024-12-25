import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          Swal.fire("Error", "User is not authenticated.", "error");
          return;
        }

        const response = await fetch(
          `https://ecommerce-backend-server-production.up.railway.app/details`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile details");
        }

        const data = await response.json();
        setProfileData({
          name: data.name || "",
          address: data.address || "",
          email: data.email || "",
        });
      } catch (error) {
        Swal.fire("Error", "Failed to load profile data.", "error");
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditProfile = () => {
    Swal.fire({
      title: "Edit Profile",
      html: `
        <input id="name" type="text" class="swal2-input" value="${profileData.name}" placeholder="Name" />
        <input id="address" type="text" class="swal2-input" value="${profileData.address}" placeholder="Address" />
      `,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        const name = Swal.getPopup().querySelector("#name").value;
        const address = Swal.getPopup().querySelector("#address").value;

        if (!name || !address) {
          Swal.showValidationMessage("Please fill out all fields");
        }
        return { name, address };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setProfileData((prevState) => ({
          ...prevState,
          name: result.value.name,
          address: result.value.address,
        }));
        Swal.fire("Saved!", "Your profile has been updated.", "success");
      }
    });
  };

  return (
    <div className="max-w-screen-md mx-auto mt-8 p-4 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Name:</span>
          <span className="text-gray-900">{profileData.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Address:</span>
          <span className="text-gray-900">{profileData.address}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Email:</span>
          <span className="text-gray-900">{profileData.email}</span>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={handleEditProfile}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
