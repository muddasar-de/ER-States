import React, { useState, useRef } from 'react';
import { Box, Text, Progress } from '@chakra-ui/react';

const UploadDropzone = ({ onUploadComplete, multiple = false, endpoint }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (files) => {
    setIsUploading(true);
    setProgress(10); // Start with some progress to indicate upload began

    try {
      const uploadedUrls = [];
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'property_images';

      // For tracking progress across multiple files
      let totalProgress = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Create form data for upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        // Upload to Cloudinary directly from browser
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
          console.log(`Uploaded URL: ${data.secure_url}`);
        } else {
          console.error('Upload failed:', data);
        }

        // Update progress based on how many files have been processed
        totalProgress = ((i + 1) / files.length) * 90;
        setProgress(10 + totalProgress);
      }

      setProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
        console.log('Completed uploads, URLs:', uploadedUrls);
        onUploadComplete(uploadedUrls);
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setProgress(0);
    }
  };

  // File input change handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadToCloudinary(files);
    }
  };

  // Drag and drop handlers without react-dropzone
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadToCloudinary(files);
    }
  };

  return (
    <Box>
      <Box
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={isDragActive ? "blue.400" : "gray.300"}
        borderRadius="md"
        p={4}
        textAlign="center"
        cursor={isUploading ? "not-allowed" : "pointer"}
        _hover={{ bg: isUploading ? undefined : "gray.50" }}
        bg={isDragActive ? "blue.50" : "transparent"}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple || endpoint === 'propertyGallery'}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {isUploading ? (
          <Text>Uploading...</Text>
        ) : isDragActive ? (
          <Text>Drop the images here...</Text>
        ) : (
          <Text>Drag and drop {multiple || endpoint === 'propertyGallery' ? "images" : "an image"} here, or click to select</Text>
        )}
      </Box>

      {isUploading && (
        <Box mt={2}>
          <Progress value={progress} size="sm" colorScheme="blue" />
          <Text fontSize="xs" mt={1} textAlign="center">{Math.round(progress)}%</Text>
        </Box>
      )}
    </Box>
  );
};

export default UploadDropzone;