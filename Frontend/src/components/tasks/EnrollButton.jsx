import React, { useEffect, useState } from "react";
import taskCompletionApi from "../../api/taskCompletionApi";

const EnrollButton = ({ openEnrollModal, task, enrollingTaskId }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    taskCompletionApi
      .checkCompletionStatus(userId, enrollingTaskId)
      .then((res) => setIsEnrolled(res))
      .catch((err) => console.error(err));
  }, [enrollingTaskId]);
  return (
    <button
      onClick={() => openEnrollModal(task.id)}
      disabled={isEnrolled}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors disabled:bg-green-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
    >
      {isEnrolled ? "Already Enrolled" : "Enroll Now"}
    </button>
  );
};

export default EnrollButton;
