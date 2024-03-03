import React, { useState } from 'react';
import FileUpload from './FileUpload';
import BoundingBox from './BoundingBox';

const App = () => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const handleSaveChanges = () => {
    alert('Changes saved successfully!');
  };

  return (
    <div>
      <h1>File Upload and Editing</h1>
      <FileUpload onFileUpload={handleFileUpload} />
      {uploadedFile && (
        <div>
          <BoundingBox file={uploadedFile} />
          <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
      )}
    </div> 
  );
};

export default App;
