// File: src/pages/upload-training-record.jsx

import React, { useState } from "react";

export default function UploadTrainingRecord() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("trainingRecord", file);

    try {
      const res = await fetch("/api/training/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        setStatus("Training record uploaded and parsed successfully.");
      } else {
        setStatus(result.error || "Failed to upload.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Upload error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto bg-white shadow rounded-xl p-8">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">
          Upload Training Record
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            Upload
          </button>
        </form>
        {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  );
}