import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:8080/api/user/profile",
          {
            headers: { token },
          }
        );

        setUser(data.user[0]);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white w-2xl p-6 rounded-lg shadow-lg text-center">
        <div className="w-32 h-32 rounded-full border-2 border-blue-500 overflow-hidden mx-auto mt-4">
          <img
            src={user.image || <img src="./userIcon.jpg" />}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-3xl mt-3 font-semibold text-gray-700">Welcome</h2>
        <h3 className="mt-1 text-lg font-medium text-gray-800">
          {user.fullName}
        </h3>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Welcome;
