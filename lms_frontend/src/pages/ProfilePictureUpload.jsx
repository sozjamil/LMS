import { useState } from 'react';
import useAuth from '../context/AuthContext';

export default function ProfilePictureUpload({ onUploadSuccess }) {
  const { accessToken } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadMessage('');

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      setUploading(true);
      const res = await fetch('http://localhost:8000/api/profile/upload-picture/', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
      
      const data = await res.json();
      console.log('Uploaded profile picture:', data.profile_picture);
      alert('Profile picture uploaded successfully!');
      setUploadMessage('Image uploaded successfully!');
            
      // Call parent to refresh profile data
      if (response.status === 200 && onUploadSuccess) {
        onUploadSuccess();
     }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    } 

    
      
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2">Upload Profile Picture</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded-full" />}
      <button
        onClick={handleUpload}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadMessage && (
        <p className="text-green-600 mt-2 font-semibold">{uploadMessage}</p>
      )}
    </div>
  );
}
