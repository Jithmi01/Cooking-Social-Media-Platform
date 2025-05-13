import React, { useState, useEffect } from "react";
import taskApi from "../api/taskApi";
import taskCompletionApi from "../api/taskCompletionApi";
import Modal from "react-modal";
import EnrollButton from "../components/tasks/EnrollButton";

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root"); // Or your app root element ID

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollingTaskId, setEnrollingTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spendTime, setSpendTime] = useState(10); // Default value
  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Modal styles
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "500px",
      width: "90%",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "none",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getAllTasks();
      setTasks(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskApi.getAllTasks();
        setTasks(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const openEnrollModal = (taskId) => {
    setCurrentTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSpendTime(10); // Reset to default
  };

  const handleEnroll = async () => {
    if (!currentTaskId) return;

    try {
      setEnrollingTaskId(currentTaskId);
      await taskCompletionApi.createCompletion(
        currentTaskId,
        localStorage.getItem("userId"),
        spendTime
      );
      await fetchTasks();
      alert("Successfully enrolled in the task!");
    } catch (err) {
      console.error("Error enrolling in task:", err);
      alert("Failed to enroll in task. Please try again.");
    } finally {
      setEnrollingTaskId(null);
      closeModal();
    }
  };

  const getTaskTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "basic":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} hr ${remainingMinutes} min`
      : `${hours} hr`;
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Tasks</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Enroll Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Enroll in Task"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Enter Time Spent
          </h2>
          <p className="text-gray-600 mb-4">
            How many minutes did you spend on this task?
          </p>

          <div className="mb-6">
            <input
              type="number"
              min="1"
              value={spendTime}
              onChange={(e) => setSpendTime(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter time in minutes"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEnroll}
              disabled={!spendTime || spendTime <= 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300"
            >
              {enrollingTaskId === currentTaskId ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enrolling...
                </div>
              ) : (
                "Confirm Enrollment"
              )}
            </button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                No Tasks Found
              </h2>
              <p className="text-gray-500">
                Try adjusting your search or check back later.
              </p>
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {task.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={task.imageUrl}
                    alt={task.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Image+Not+Available";
                    }}
                  />
                  <div className="absolute top-0 right-0 p-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getTaskTypeColor(
                        task.type
                      )}`}
                    >
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {task.title}
                </h2>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {task.description}
                </p>
                <div className="flex items-center mb-5">
                  <svg
                    className="h-5 w-5 text-gray-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">
                    Estimated time: {formatTime(task.estimateTime)}
                  </span>
                </div>
                <EnrollButton
                  task={task}
                  enrollingTaskId={task.id}
                  openEnrollModal={openEnrollModal}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksPage;
