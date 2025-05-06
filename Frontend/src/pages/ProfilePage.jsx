import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userApi from "../api/userApi";
import UserBadge from "../components/user/UserBadge";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    gender: "",
    age: "",
    public: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Regex patterns for validation
  const validationPatterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    birthday: /^\d{4}-\d{2}-\d{2}$/,
    gender: /^(male|female|other)$/i,
    age: /^(1[89]|[2-9]\d|1[0-2]\d)$/, // 18-129
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const userData = await userApi.getUserById(userId);
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          birthday: userData.birthday
            ? new Date(userData.birthday).toISOString().split("T")[0]
            : "",
          gender: userData.gender || "",
          age: userData.age ? userData.age.toString() : "",
          public: userData.public || false,
        });
      } catch (error) {
        toast.error("Failed to fetch user data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    if (validationPatterns[name] && !validationPatterns[name].test(value)) {
      setErrors((prev) => ({ ...prev, [name]: true }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (
        validationPatterns[key] &&
        !validationPatterns[key].test(formData[key])
      ) {
        newErrors[key] = true;
      }
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      toast.error("Please correct the errors in the form");
      return;
    }

    try {
      const updatedUser = await userApi.updateUser(user.id, {
        ...user,
        ...formData,
        age: parseInt(formData.age),
        public: formData.public,
      });
      setUser(updatedUser);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  const togglePublicProfile = async () => {
    try {
      const updatedUser = await userApi.updateUser(user.id, {
        ...user,
        public: !user.public,
      });
      setUser(updatedUser);
      setFormData((prev) => ({ ...prev, public: updatedUser.public }));
      toast.success(
        `Profile is now ${updatedUser.public ? "public" : "private"}`
      );
    } catch (error) {
      toast.error("Failed to update profile visibility");
      console.error(error);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      userApi
        .deleteUser(user.id)
        .then(() => {
          toast.success("Account deleted successfully");
          handleLogout();
        })
        .catch((error) => {
          toast.error("Failed to delete account");
          console.error(error);
        });
    }
  };

  const handleLogout = () => {
    userApi.logout();
    navigate("/login");
    toast.info("You have been logged out");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="opacity-75">Manage your account information</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                {user.public ? "Public" : "Private"}
              </span>
              <button
                onClick={togglePublicProfile}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  user.public ? "bg-green-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    user.public ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!editMode ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">
                    Personal Information
                  </h2>
                  <UserBadge />
                </div>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{user.name || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Birthday</p>
                  <p className="font-medium">
                    {user.birthday
                      ? new Date(user.birthday).toLocaleDateString()
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium">{user.gender || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="font-medium">{user.age || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Account Status</p>
                  <p className="font-medium">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.deleteStatus
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.deleteStatus ? "Deleted" : "Active"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">Profile Visibility</p>
                    <p className="text-sm text-gray-600">
                      {user.public
                        ? "Your profile is visible to everyone"
                        : "Your profile is private"}
                    </p>
                  </div>
                  <button
                    onClick={togglePublicProfile}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      user.public ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        user.public ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter a valid name (2-50 characters)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter a valid email
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Birthday</label>
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      errors.birthday ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.birthday && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter a valid date
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${
                      errors.gender ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select a gender
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="129"
                    className={`w-full p-2 border rounded ${
                      errors.age ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="25"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">
                      Please enter a valid age (18-129)
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Profile Visibility
                    </label>
                    <p className="text-sm text-gray-600">
                      {formData.public
                        ? "Your profile will be visible to everyone"
                        : "Your profile will be private"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, public: !prev.public }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                      formData.public ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.public ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ProfilePage;
