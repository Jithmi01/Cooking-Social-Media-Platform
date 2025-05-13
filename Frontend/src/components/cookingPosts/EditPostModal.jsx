import React, { useEffect, useState, useRef } from 'react';
import cookingPostApi from '../../api/cookingPostApi';
import mediaApi from '../../api/mediaApi';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { uploadFile } from '../../services/uploadFileService';

// Make sure to bind modal to your app element for accessibility
Modal.setAppElement('#root');

const EditPostModal = ({ id, isOpen, onClose, onSubmitSuccess }) => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const userId = localStorage.getItem("userId");

  const setInitialData = async () => {
    try {
      setIsLoading(true);
      const [postData, mediaFilesData] = await Promise.all([
        cookingPostApi.getPostById(id),
        mediaApi.getMediaByPostId(id)
      ]);
      
      setPost(postData);
      setTitle(postData.title || '');
      setDescription(postData.description || '');
      
      // Create media previews from existing media
      if (mediaFilesData && mediaFilesData.length > 0) {
        const previews = mediaFilesData.map(item => ({
          id: item.id,
          url: item.url,
          type: item.type,
          existingMedia: true
        }));
        setMediaPreview(previews);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to load post data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && id) {
      setInitialData();
    }
  }, [id, isOpen]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const invalidFiles = files.filter(file => 
      !file.type.startsWith('image/') && !file.type.startsWith('video/')
    );
    
    if (invalidFiles.length > 0) {
      toast.error('Only image and video files are allowed');
      return;
    }
    
    // Validate media count - maximum 3 media items
    const totalMedia = mediaPreview.length + files.length;
    if (totalMedia > 3) {
      toast.error('Maximum 3 media files allowed');
      return;
    }
    
    // Check for video count
    const existingVideos = mediaPreview.filter(item => item.type === 'video');
    const newVideos = files.filter(file => file.type.startsWith('video/'));
    
    if (existingVideos.length + newVideos.length > 1) {
      toast.error('Only one video is allowed');
      return;
    }
    
    // Validate video duration
    const validateVideoDuration = async (videoFile) => {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            reject('Video must not exceed 30 seconds');
          } else {
            resolve(true);
          }
        };
        video.src = URL.createObjectURL(videoFile);
      });
    };
    
    // Process video files for duration validation
    const processFiles = async () => {
      try {
        for (const file of newVideos) {
          await validateVideoDuration(file);
        }
        
        // All validations passed, update state
        setMediaFiles(prev => [...prev, ...files]);
        
        // Create preview URLs
        const newPreviews = files.map(file => ({
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'video',
          file: file
        }));
        
        setMediaPreview(prev => [...prev, ...newPreviews]);
        
      } catch (error) {
        toast.error(error);
      }
    };
    
    if (newVideos.length > 0) {
      processFiles();
    } else {
      // No videos to validate, just update state
      setMediaFiles(prev => [...prev, ...files]);
      
      // Create preview URLs
      const newPreviews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        file: file
      }));
      
      setMediaPreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index) => {
    // Remove from previews
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
    
    // Remove from files if it's a new file
    if (!mediaPreview[index].existingMedia) {
      const fileIndex = mediaFiles.findIndex(file => 
        file === mediaPreview[index].file
      );
      
      if (fileIndex !== -1) {
        setMediaFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(mediaPreview[index].url);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return false;
    }
    
    if (!description.trim()) {
      toast.error('Description is required');
      return false;
    }
    
    // At least one media item is required
    if (mediaPreview.length === 0) {
      toast.error('At least one photo or video is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let postData = {
        title,
        description,
        updatedAt: new Date(),
        createdBy: userId,
      };
      
      // Update the post
      await cookingPostApi.updatePost(id, postData);
      
      // Handle removed media items
      const existingMediaIds = mediaPreview
        .filter(item => item.existingMedia)
        .map(item => item.id);
      
      // Get all media from the post
      const currentMedia = await mediaApi.getMediaByPostId(id);
      
      // Find media to delete
      const mediaToDelete = currentMedia
        .filter(item => !existingMediaIds.includes(item.id))
        .map(item => item.id);
      
      // Delete media items that were removed
      for (const mediaId of mediaToDelete) {
        await mediaApi.deleteMedia(mediaId);
      }
      
      // Upload new media files to Firebase
      const newFiles = mediaFiles;
      
      // Upload files to Firebase and create media entries
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        
        try {
          // Update progress state for this file
          const updateProgress = (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [i]: progress
            }));
          };
          
          // Upload to Firebase
          const downloadUrl = await uploadFile(file, updateProgress);
          
          // Create media entry with the download URL
          const mediaData = {
            type: fileType,
            url: downloadUrl,
            deleteStatus: false,
            relatedPost: id
          };
          
          await mediaApi.createMedia(mediaData);
        } catch (error) {
          console.error(`Error uploading file ${i}:`, error);
          toast.error(`Failed to upload media ${i + 1}`);
        }
      }
      
      toast.success('Post updated successfully!');
      
      // Clean up and close modal
      resetForm();
      onClose();
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.response?.data?.message || 'Failed to update post');
    } finally {
      setIsLoading(false);
      setUploadProgress({});
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMediaFiles([]);
    setUploadProgress({});
    
    // Clean up object URLs to prevent memory leaks
    mediaPreview.forEach(preview => {
      if (!preview.existingMedia && preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setMediaPreview([]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Custom styles for the modal
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
      borderRadius: '12px',
      padding: '0',
      border: 'none',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(2px)'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCancel}
      style={customStyles}
      contentLabel="Edit Cooking Post"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Cooking Post</h2>
          <button
            onClick={handleCancel}
            className="text-white hover:text-gray-200 transition-colors duration-200 focus:outline-none"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 bg-white rounded-b-lg">
        {isLoading && !post ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Add a title for your post"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Describe your cooking post..."
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Media
                </label>
                <span className={`text-sm ${mediaPreview.length === 3 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                  {mediaPreview.length}/3 files
                </span>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <label className={`flex items-center justify-center w-full px-4 py-3 rounded-lg border-2 border-dashed ${mediaPreview.length >= 3 ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'border-blue-400 hover:border-blue-500 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors duration-200'}`}>
                    <div className="flex flex-col items-center space-y-1">
                      <svg className={`w-6 h-6 ${mediaPreview.length >= 3 ? 'text-gray-400' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className={`text-sm font-medium ${mediaPreview.length >= 3 ? 'text-gray-500' : 'text-blue-600'}`}>
                        {mediaPreview.length === 0 ? 'Add photos/videos' : 'Add more media'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Maximum 3 files (only 1 video allowed)
                      </span>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*,video/*"
                      className="hidden"
                      multiple
                      disabled={isLoading || mediaPreview.length >= 3}
                    />
                  </label>
                </div>
              </div>
            </div>

            {mediaPreview.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Selected Media:</p>
                <div className="grid grid-cols-3 gap-4">
                  {mediaPreview.map((media, index) => (
                    <div key={index} className="relative group">
                      <div className="rounded-lg overflow-hidden shadow-md aspect-w-16 aspect-h-9 bg-gray-100">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Preview ${index}`}
                            className="w-full h-32 object-cover"
                          />
                        ) : (
                          <video
                            src={media.url}
                            className="w-full h-32 object-cover"
                            controls
                          />
                        )}
                      </div>
                      
                      {uploadProgress[index] !== undefined && !media.existingMedia && (
                        <div className="absolute bottom-0 left-0 w-full bg-gray-200 h-2 rounded-b-lg">
                          <div 
                            className="bg-blue-500 h-2 rounded-bl-lg transition-all duration-300" 
                            style={{ width: `${uploadProgress[index]}%` }}
                          ></div>
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-lg transform hover:scale-110 transition-transform duration-200 opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                        disabled={isLoading}
                        aria-label="Remove media"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                      
                     
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span>Update Post</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default EditPostModal;