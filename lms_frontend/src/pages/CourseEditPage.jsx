import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Optional basic styles


const CourseEditPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({ title: "", content: "", video: null });
  const [removeVideoChecked, setRemoveVideoChecked] = useState(false);
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false); // for "lesson video upload" loading state

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  const handleSaveCourse = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("price", course.price);
      formData.append("category", course.category);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      await api.put(`/api/courses/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course updated successfully!");
      
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async () => {
    setLessonLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", newLesson.title);
      formData.append("content", newLesson.content);
      if (newLesson.video) formData.append("video", newLesson.video);

      const response = await api.post(`/api/courses/${id}/lessons/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCourse((prev) => ({ ...prev, lessons: [...prev.lessons, response.data] }));
      setNewLesson({ title: "", content: "", video: null });
      toast.success("Lesson added successfully!");
      
    } catch (error) {
      console.error("Error adding lesson:", error);
      toast.error("Failed to add lesson.");
    } finally {
      setLessonLoading(false);
    }
  };

  const handleEditLesson = async () => {
    setLessonLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const formData = new FormData();
      formData.append("title", editingLesson.title);
      formData.append("content", editingLesson.content);
      // remove video checkbox
      if (removeVideoChecked) {
        formData.append("remove_video", "true");
      } else if (editingLesson.video instanceof File) {
        formData.append("video", editingLesson.video);
      }

      await api.put(`/api/lessons/${editingLesson.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await fetchCourse();
      toast.success("Lesson added successfully!");
      setEditingLesson(null);
      setRemoveVideoChecked(false);
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast.error("Failed to update lesson.");
    }finally {
      setLessonLoading(false);
    }
  };

  // adding delete lesson logic and using confirm alert to confirm deletion
  const handleDeleteLesson = (lessonId) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this lesson?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteLesson(lessonId),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const deleteLesson = async (lessonId) => {
    try {
      await axios.delete(`${BASE_URL}/lessons/${lessonId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      toast.success('Lesson deleted');
      // update state
    } catch (err) {
      toast.error('Failed to delete lesson');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchCategories();
  }, [id]);

    if (loading || !course) {
      return (
        <div className="text-center py-4">
          <span className="text-lg animate-pulse text-blue-600">Loading course...</span>
        </div>
      );
    }
  
    return (
    
    // {loading && (
    //   <div className="text-center py-4">
    //     <span className="text-lg animate-pulse text-blue-600">Saving...</span>
    //   </div>
    // )}

    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Edit Course</h1>
      <div className="space-y-4">
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          placeholder="Course Title"
        />
        <textarea
          className="w-full border p-2 rounded"
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          placeholder="Course Description"
        />
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={course.price}
          onChange={(e) => setCourse({ ...course, price: e.target.value })}
          placeholder="Course Price"
        />
        <select
          className="w-full border p-2 rounded"
          value={course.category || ""}
          onChange={(e) => setCourse({ ...course, category: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />
        {course.thumbnail && (
          <img src={course.thumbnail} alt="Course thumbnail" className="w-48 mt-2 rounded" />
        )}
        <button
          onClick={handleSaveCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Course
        </button>
      </div>

      {/* showing lessons with edit and delete button  */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Lessons</h2>
        {course.lessons.map((lesson) => (
          <div key={lesson.id} className="border p-4 rounded mt-4">
            <h3 className="text-lg font-bold">{lesson.title}</h3>
            <p>{lesson.content}</p>
            {lesson.video_url && <a className="text-blue-500" href={lesson.video_url}>{lesson.video_url}</a>}
            <div className="space-x-2 mt-2">
              <button
                onClick={() => setEditingLesson({ id: lesson.id, title: lesson.title, content: lesson.content, video: null })}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >Edit</button>
              <button
                onClick={() => handleDeleteLesson(lesson.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* editing lesson */}
      <div className="mt-10">
        {editingLesson ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Edit Lesson</h3>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editingLesson.title}
              onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
              placeholder="Lesson Title"
            />
            <textarea
              className="w-full border p-2 rounded"
              value={editingLesson.content}
              onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
              placeholder="Lesson Content"
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setEditingLesson({ ...editingLesson, video: e.target.files[0] })}
            />
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={removeVideoChecked}
                onChange={(e) => setRemoveVideoChecked(e.target.checked)}
              />
              Remove Video
            </label>
            <div className="space-x-2">
              <button onClick={handleEditLesson} 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={lessonLoading}
                 >
                {lessonLoading ? "Uploading..." : "Save Lesson"}
              </button>
              <button onClick={() => setEditingLesson(null)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Add Lesson</h3>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={newLesson.title}
              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              placeholder="Lesson Title"
            />
            <textarea
              className="w-full border p-2 rounded"
              value={newLesson.content}
              onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
              placeholder="Lesson Content"
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setNewLesson({ ...newLesson, video: e.target.files[0] })}
            />
            <button
              onClick={handleAddLesson}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={lessonLoading}
            >
              {lessonLoading ? "Uploading..." : "Add Lesson"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditPage;