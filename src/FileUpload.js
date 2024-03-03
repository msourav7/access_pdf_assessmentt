// FileUpload.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onFileUpload }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const allowedExtensions = ['pdf', 'ppt', 'pptx'];

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      setUploadedFile(file);
      onFileUpload(file);
      console.log('File details:', file); 
    } else {
      alert('Invalid file format. Please upload a PDF or PPT file.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop }); 

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #ddd', padding: '20px', textAlign: 'center' }}>
      <input {...getInputProps()} />
      <p>Drag and drop a PDF or PPT file here, or click to select one.</p>
      {uploadedFile && <p>File uploaded: {uploadedFile.name}</p>}
    </div>
  );
};

export default FileUpload;
