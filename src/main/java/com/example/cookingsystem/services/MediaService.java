package com.example.cookingsystem.services;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.cookingsystem.models.CookingPost;
import com.example.cookingsystem.models.Media;
import com.example.cookingsystem.repositories.CookingPostRepository;
import com.example.cookingsystem.repositories.MediaRepository;

@Service
public class MediaService {

    private final MediaRepository mediaRepository;
    private final CookingPostRepository cookingPostRepository;

    @Autowired
    public MediaService(MediaRepository mediaRepository, CookingPostRepository cookingPostRepository) {
        this.mediaRepository = mediaRepository;
        this.cookingPostRepository = cookingPostRepository;
    }


    // Create media (basic version without file upload)
    public Media createMedia(Media media, String postId) {
        Optional<CookingPost> post = cookingPostRepository.findById(postId);
        if (post.isPresent()) {
            media.setRelatedPost(post.get());
            media.setDeleteStatus(false);
            return mediaRepository.save(media);
        }
        return null;
    }

    // Create media with file upload (simplified version)
    public Media createMediaWithFile(String type, MultipartFile file, String postId) throws IOException {
        Optional<CookingPost> post = cookingPostRepository.findById(postId);
        if (post.isPresent()) {
            // In a real implementation, you would save the file to storage (S3, local filesystem, etc.)
            // and store the URL/path in the database
            String fileUrl = "https://your-storage.com/media/" + file.getOriginalFilename();

            Media media = new Media();
            media.setType(type);
            media.setUrl(fileUrl);
            media.setRelatedPost(post.get());
            media.setDeleteStatus(false);

            return mediaRepository.save(media);
        }
        return null;
    }

}