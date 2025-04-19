import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CourseEditPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null); // Track the lesson being edited
  const [newLesson, setNewLesson] = useState({ title: "", content: "", video: null });
  const [removeVideoChecked, setRemoveVideoChecked] = useState(false);
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  // Fetch course data
  const fetchCourse = async () => {
    try {
      const response = await api.get(`/api/courses/${id}`);
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };

  // Save course (excluding lessons)
  const handleSaveCourse = async () => {
    setLoading(true); // Set loading to true before the API call
    try {
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("price", course.price);
      formData.append("category", course.category);
      formData.append("category", course.category);
          if (thumbnail) {
            formData.append("thumbnail", thumbnail);
          }

      console.log('Access Token:', localStorage.getItem('accessToken'));
      console.log('Refresh Token:', localStorage.getItem('refreshToken'));

      await api.put(`/api/courses/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  // Add a lesson
  const handleAddLesson = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newLesson.title);
      formData.append("content", newLesson.content);
      if (newLesson.video) {
        formData.append("video", newLesson.video);
      }

      console.log("FormData before sending:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await api.post(`/api/courses/${id}/lessons/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCourse((prevCourse) => ({
        ...prevCourse,
        lessons: [...prevCourse.lessons, response.data],
      }));

      setNewLesson({ title: "", content: "", video: null }); // Reset new lesson form
      alert("Lesson added successfully!");
    } catch (error) {
      console.error("Error adding lesson:", error);
    }
  };

  // Edit a lesson
  const handleEditLesson = async () => {

    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');
     // Debug: Check if the token exists
    console.log('Access Token:', accessToken); // <---
    
    try {
      const formData = new FormData();
      formData.append("title", editingLesson.title);
      formData.append("content", editingLesson.content);
       
      // remove video checkbox
      if (removeVideoChecked) {
        formData.append('remove_video', 'true');
      } else if (editingLesson.video instanceof File) {
        formData.append("video", editingLesson.video);
      } else {
        console.log("No video file provided or invalid file type.");
      }
      
     // Debug Test: Check FormData entries before sending 
      console.log("Editing lesson FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      const response = await api.put(`/api/lessons/${editingLesson.id}/`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data", 
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      // Update the course state with the updated lesson
      // setCourse((prevCourse) => ({
      //   ...prevCourse,
      //   lessons: prevCourse.lessons.map((lesson) =>
      //     lesson.id === editingLesson.id ? response.data : lesson
      //   ),
      // }));

      // update the course state with the updated lesson
      await fetchCourse();
      alert("Lesson updated successfully!");
      setEditingLesson(null);
  
      // auto-uncheck the checkbox after editing is done:
      setRemoveVideoChecked(false);

    } catch (error) {
      console.error("Error updating lesson:", error.response?.data || error.message);
      alert("Failed to update lesson. Check console for details.");
      
    }
  };

  
  // Delete a lesson
  const handleDeleteLesson = async (lessonId) => {
    const accessToken = localStorage.getItem('accessToken');
  
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
  
    try {
      await api.delete(`/api/lessons/${lessonId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      // Re-fetch course to reflect the updated lesson list
      await fetchCourse();
      alert("Lesson deleted successfully!");
    } catch (error) {
      console.error("Error deleting lesson:", error.response?.data || error.message);
      alert("Failed to delete lesson. Check console for details.");
    }
  };

 // fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories/"); // adjust if your URL is different
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchCategories();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }
 

  return (
    <div>
      {loading ? (
        <p>Loading...</p> // Replace this with a spinner component for better UX
      ) : (
        <>

          {/* edit course title, description, thumbnail and category */}
          <h1>Edit Course</h1>
          <input
            type="text"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
          />
          <textarea
            value={course.description}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <input
            type="number"
            value={course.price}
            onChange={(e) => setCourse({ ...course, price: e.target.value })}
          />
          <select
            value={course.category || ""}
            onChange={(e) => setCourse({ ...course, category: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <div>
            <label htmlFor="thumbnail">Thumbnail:</label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
            />
            {/* Preview existing thumbnail */}
            {course.thumbnail && (
              <div>
                <p>Current Thumbnail:</p>
                <img src={course.thumbnail} alt="Course thumbnail" style={{ maxWidth: '200px' }} />
              </div>
            )}
          </div>
          <button onClick={handleSaveCourse}>Save Course</button>

          {/* showing lessons with edit and delete button  */}
          <div>
            <h2>Lessons</h2>
            {course.lessons.map((lesson) => (
              <div key={lesson.id}>
                <p>{lesson.title}</p>
                <p>{lesson.content}</p>
                {lesson.video_url && <a href={lesson.video_url}>{lesson.video_url}</a>}
                <button onClick={() => 
                  setEditingLesson({
                    id: lesson.id,
                    title: lesson.title,
                    content: lesson.content,
                    video: null, })
                    }>Edit
                </button>
                <button onClick={() => handleDeleteLesson(lesson.id)} style={{ color: "red" }}>
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* editing lesson */}
          {editingLesson ? (
            <div>
              <h3>Edit Lesson</h3>
              <input
                type="text"
                value={editingLesson.title}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, title: e.target.value })
                }
              />
              <textarea
                value={editingLesson.content}
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, content: e.target.value })
                }
              />
              <input
                type="file"
                id="video"
                accept="video/*"
                onChange={(e) =>
                  setEditingLesson({ ...editingLesson, video: e.target.files[0] })
                }
              />
              <label htmlFor="remove_video">Remove Video</label>
              <input
                type="checkbox"
                id="remove_video"
                onChange={(e) => setRemoveVideoChecked(e.target.checked)}></input>
              <button onClick={handleEditLesson}>Save Lesson</button>
              <button onClick={() => setEditingLesson(null)}>Cancel</button>
            </div>
          ) : (

            // Add lesson form
            <div>
              <h3>Add Lesson</h3>
              <input
                type="text"
                value={newLesson.title}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, title: e.target.value })
                }
              />
              <textarea
                value={newLesson.content}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, content: e.target.value })
                }
              />
              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  setNewLesson({ ...newLesson, video: e.target.files[0] })
                }
              />
              <button onClick={handleAddLesson}>Add Lesson</button>
            </div>
          )}
          </>
      )}
    </div>
  );
};

export default CourseEditPage;
