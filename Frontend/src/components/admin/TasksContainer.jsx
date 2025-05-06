import React, { useEffect, useState } from 'react'
import taskApi from '../../api/taskApi'
import Modal from 'react-modal'
import { uploadFile } from '../../services/uploadFileService'

Modal.setAppElement('#root') 

const initialForm = {
  title: '',
  description: '',
  type: 'beginner',
  estimateTime: '',
  imageUrl: '',
}

const TasksContainer = () => {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [selectedId, setSelectedId] = useState(null)
  const [errors, setErrors] = useState({})
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const fetchTasks = async () => {
    const all = await taskApi.getAllTasks()
    setTasks(all.filter(task => !task.deleteStatus))
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!/^[\w\s]{3,50}$/.test(form.title)) {
      newErrors.title = 'Title must be 3-50 characters (letters/numbers/spaces)'
    }

    if (!/^.{10,200}$/.test(form.description)) {
      newErrors.description = 'Description must be 10-200 characters'
    }

    if (!/^\d{1,3}$/.test(form.estimateTime) || parseInt(form.estimateTime) <= 0) {
      newErrors.estimateTime = 'Estimate must be a number between 1-999'
    }

    // Only validate imageUrl if not currently uploading
    if (!form.imageUrl && !isUploading) {
      newErrors.imageUrl = 'Image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      setUploadProgress(0)
      try {
        const url = await uploadFile(file, setUploadProgress)
        setForm((prev) => ({ ...prev, imageUrl: url }))
        // Clear any image error when upload succeeds
        setErrors(prev => ({ ...prev, imageUrl: undefined }))
      } catch (error) {
        console.error(error)
        setErrors(prev => ({ ...prev, imageUrl: 'Upload failed. Please try again.' }))
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const data = {
      ...form,
      estimateTime: parseInt(form.estimateTime),
      deleteStatus: false,
    }

    if (selectedId) {
      await taskApi.updateTask(selectedId, data)
    } else {
      await taskApi.createTask(data)
    }

    setForm(initialForm)
    setSelectedId(null)
    setModalOpen(false)
    fetchTasks()
  }

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description,
      type: task.type,
      estimateTime: task.estimateTime.toString(),
      imageUrl: task.imageUrl,
    })
    setSelectedId(task.id)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await taskApi.deleteTask(id)
      fetchTasks()
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  const typeColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Manager</h1>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search tasks..."
            className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 shadow-md flex items-center w-full md:w-auto justify-center"
          onClick={() => {
            setSelectedId(null);
            setForm(initialForm);
            setModalOpen(true);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Task
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No tasks found. Create a new task to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={task.imageUrl} 
                  alt={task.title} 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full ${typeColors[task.type]} text-xs font-medium`}>
                  {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{task.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{task.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{task.estimateTime} min</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition duration-200 flex items-center justify-center"
                    onClick={() => handleEdit(task)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition duration-200 flex items-center justify-center"
                    onClick={() => handleDelete(task.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-xl mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{selectedId ? 'Edit Task' : 'Add New Task'}</h2>
          <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Task description"
              value={form.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Time (minutes)</label>
              <input
                type="number"
                name="estimateTime"
                placeholder="Time in minutes"
                value={form.estimateTime}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {errors.estimateTime && <p className="text-red-500 text-sm mt-1">{errors.estimateTime}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Image</label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="flex justify-center px-4 py-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="text-center">
                    <svg className="mx-auto h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">Choose image</p>
                  </div>
                  <input type="file" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              
              {form.imageUrl && (
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
            
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
          </div>

          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg mr-2 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : selectedId ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TasksContainer