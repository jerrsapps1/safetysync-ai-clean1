// File: src/pages/instructor-background-upload.jsx

import React, { useState } from "react";

export default function InstructorBackgroundUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setStatus("Uploading background image...");

    const formData = new FormData();
    formData.append("backgroundImage", file);

    try {
      const res = await fetch("/api/instructor/upload-background", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        setStatus("Background uploaded successfully.");
      } else {
        setStatus(result.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Error during upload.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-10">
      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-sm shadow rounded-xl p-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          Upload Certificate Background
        </h1>
        <div className="mb-6">
          <p className="text-blue-100 text-sm mb-4">
            Upload custom background images for certificates and digital wallet cards. 
            Recommended size: 480x280 pixels for wallet cards, 800x600 for certificates.
          </p>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Supported formats:</h3>
            <ul className="text-blue-100 text-sm space-y-1">
              <li>• JPG/JPEG - Best for photos</li>
              <li>• PNG - Best for logos with transparency</li>
              <li>• Maximum file size: 5MB</li>
            </ul>
          </div>
        </div>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-white mb-2 font-medium">Select Background Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-white file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:bg-white/20 file:text-white hover:file:bg-white/30 file:cursor-pointer cursor-pointer"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={!file}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              file 
                ? 'bg-white text-blue-600 hover:bg-blue-50' 
                : 'bg-white/50 text-blue-400 cursor-not-allowed'
            }`}
          >
            {file ? 'Upload Background' : 'Select a file first'}
          </button>
        </form>
        
        {status && (
          <div className={`mt-4 p-3 rounded-lg ${
            status.includes('successfully') 
              ? 'bg-green-500/20 text-green-100' 
              : 'bg-red-500/20 text-red-100'
          }`}>
            {status}
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="text-white font-semibold mb-2">How to use uploaded backgrounds:</h3>
          <p className="text-blue-100 text-sm">
            After uploading, your background will be available at a URL like:
            <code className="bg-white/10 px-2 py-1 rounded text-xs block mt-2">
              /uploads/instructor-backgrounds/[instructorId]-cert-background.jpg
            </code>
            Use this URL when generating certificates or wallet cards with custom backgrounds.
          </p>
        </div>
      </div>
    </div>
  );
}