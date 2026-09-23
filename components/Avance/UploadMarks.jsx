import { useState } from "react";
import axios from "axios";
import { getToken } from '@/utils';
import { base_api_path } from "@/utils/reportList";
import { useDataContext } from "@/context/DataProvider";

export default function UploadMarks() {
  const { theme_bg } = useDataContext();
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Directly handles file selection and immediate upload
  const handleFileChangeAndUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (!selectedFiles.length) return;

    setIsUploading(true);
    setProgress(0);
    setMessage("");

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file); // Change "files" to "file" if backend expects singular
    });

    try {
      await axios.post(`${base_api_path}upload-excel?sheet1=MARKS&sheet2=INFO`, formData, {
        headers: {
          'Authorization': `Bearer ${getToken('access_token')}`
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        },
      });

      setMessage(`${selectedFiles.length} file${selectedFiles.length>1?'s':''} uploaded successfully!`);
    } catch (error) {
      console.log(error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      e.target.value = ""; // Reset file input so selecting the same file again triggers onChange
    }
  };

  return (
    <div className="p-4 border rounded w-full max-w-md">
      <h2 className="text-lg font-bold mb-2 text-slate-800">Upload Marks in Excel Files</h2>

      <input
        type="file"
        accept=".xlsx,.xls"
        multiple
        disabled={isUploading}
        onChange={handleFileChangeAndUpload}
        className="mb-2 block mt-3 bg-gray-200 text-black text-sm p-2 rounded-full file:bg-gray-100 file:outline-none file:text-pink-700 file:px-2 file:border-1 file:rounded-full file:border-pink-700 disabled:opacity-50"
      />

      {isUploading && (
        <p className="text-xs text-slate-500 mb-2">Uploading Marks...</p>
      )}

      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded h-3 my-2">
          <div
            className="h-3 rounded text-white text-xs flex items-center justify-center transition-all duration-200"
            style={{ width: `${progress}%`, backgroundColor: theme_bg || '#be185d' }}
          >
            {progress}%
          </div>
        </div>
      )}

      {message && (
        <p className={`mt-2 text-sm ${message.includes("failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}