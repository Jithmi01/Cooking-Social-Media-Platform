import React, { useEffect, useState } from "react";
import taskCompletionApi from "../../api/taskCompletionApi";

const TaskCompleteContainer = () => {
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
    taskCompletionApi
      .getAllCompletions()
      .then((res) => setCompletions(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Task Completions
      </h2>
      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Completed By
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Task Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Spent / Estimate Time (min)
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                Completed At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {completions.map((completion) => (
              <tr key={completion.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">
                  {completion.completedBy?.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {completion.completedBy?.email || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {completion.task?.title}
                </td>
                <td className="px-6 py-4 text-sm capitalize text-gray-600">
                  {completion.task?.type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800">
                  {completion.spentTime} / {completion.task?.estimateTime}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(completion.completedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskCompleteContainer;
