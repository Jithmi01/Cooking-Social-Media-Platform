import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth2Redirect = () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const userId = params.get("userId");

      if (token && userId) {
        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        // Redirect to home or desired page
        navigate("/");
      } else {
        // Handle error case
        navigate("/login", { state: { error: "Authentication failed" } });
      }
    };

    handleOAuth2Redirect();
  }, [location, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
