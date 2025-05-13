import React, { useEffect, useState } from 'react'
import mediaApi from '../../api/mediaApi'

const MediaContainer = ({ post }) => {
  const [mediaFiles, setMediaFiles] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeMedia,setActiveMedia] = useState([])

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true)
      const files = await mediaApi.getMediaByPostId(post.id)
      setMediaFiles(files.filter((file) => !file.deleteStatus))
      if(files.length>0){
        setActiveMedia(files[0])
      }
    } catch (error) {
      console.error(`Error fetching media files: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (post && post.id) {
      fetchMediaFiles()
    }
  }, [post])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mediaFiles.length - 1 : prevIndex - 1
    )
    setActiveMedia(mediaFiles[currentIndex])
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === mediaFiles.length - 1 ? 0 : prevIndex + 1
    )
    setActiveMedia(mediaFiles[currentIndex])
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!mediaFiles || mediaFiles.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-[650px] overflow-hidden bg-black">
      {/* Media display area */}
      <div className="relative aspect-square w-full">
      {activeMedia.type === 'video' ? (
              <video 
                src={activeMedia.url} 
                className="w-full h-full object-contain" 
                controls
                playsInline
              />
            ) : (
              <img 
                src={activeMedia.url} 
                alt="Post content" 
                className="w-full object-contain"
              />
            )}
      </div>

      {/* Navigation arrows - only show if more than 1 media */}
      {mediaFiles.length > 1 && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-lg hover:bg-opacity-100 z-20"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-lg hover:bg-opacity-100 z-20"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Media type indicator */}
      {activeMedia?.type === 'video' && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 rounded-full p-1.5 z-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      {/* Instagram-style pagination indicator dots */}
      {mediaFiles.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
          {mediaFiles.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-green-500 w-4' 
                  : 'bg-white bg-opacity-60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Photo count indicator - Instagram style */}
      {mediaFiles.length > 1 && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-1 z-20">
          {currentIndex + 1}/{mediaFiles.length}
        </div>
      )}
    </div>
  )
}

export default MediaContainer