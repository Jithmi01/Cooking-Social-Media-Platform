import React, { useEffect, useState } from 'react';
import UserContainer from '../components/admin/UserContainer';
import TasksContainer from '../components/admin/TasksContainer';
import TaskCompleteContainer from '../components/admin/TaskCompleteContainer';
import userApi from '../api/userApi';
import taskApi from '../api/taskApi';

const AdminDashboardPage = () => {
    const [users,setUsers] = useState([])
    const [tasks,setTasks] = useState([])


    const setInttialData =async()=>{
        const [users,tasks] = await Promise.all([userApi.getAllUsers(),taskApi.getAllTasks()])
        setUsers(users)
        setTasks(tasks)
    }


    useEffect(()=>{
        setInttialData();
    },[])


  const [activeKey, setActiveKey] = useState('dashboard');
    // Menu items
const menuItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'users', icon: '👥', label: 'User Management' },
    { key: 'tasks', icon: '✓', label: 'Task Management' },
    { key: 'completed-tasks', icon: '⚙️', label: 'Completed Tasks' },
  
  ];

 

  

  // Dashboard overview content
  const DashboardContent = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Tasks</h3>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Completed Tasks</h3>
          <p className="text-2xl font-bold">{[].filter(t => t.status === 'Completed').length}</p>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-4">Recent Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 3).map(user => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-4">Recent Tasks</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Title</th>
                 
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 3).map(task => (
                  <tr key={task.id} className="border-b">
                    <td className="py-2">{task.title}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // User management content
  const UsersContent = () => <UserContainer/>;

  // Task management content
  const TasksContent = () => <TasksContainer/>;


 

  // Render content based on active key
  const renderContent = () => {
    switch (activeKey) {
      case 'users':
        return <UsersContent />;
      case 'tasks':
        return <TasksContent />;
      case 'completed-tasks':
        return <TaskCompleteContainer />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map(item => (
              <li key={item.key}>
                <button
                  className={`flex items-center w-full px-4 py-3 text-left ${
                    activeKey === item.key 
                      ? 'bg-gray-700 border-l-4 border-green-500' 
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveKey(item.key)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button 
            className="flex items-center text-white opacity-80 hover:opacity-100"
            onClick={() => window.location.href = '/admin-login'}
          >
            <span className="mr-2">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {menuItems.find(item => item.key === activeKey)?.label || 'Dashboard'}
              </h2>
              <div className="flex items-center">
                <span className="mr-2">Admin User</span>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <span>A</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;