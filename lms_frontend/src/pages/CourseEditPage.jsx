import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CourseEditPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null); // Track the lesson being edited
  const [newLesson, setNewLesson] = useState({ title: "", content: "", video: null });

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
  
      if (editingLesson.video instanceof File) {
        formData.append("video", editingLesson.video);
      } else {
        console.log("No video file provided or invalid file type.");
      }
      
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
      setCourse((prevCourse) => ({
        ...prevCourse,
        lessons: prevCourse.lessons.map((lesson) =>
          lesson.id === editingLesson.id ? response.data : lesson
        ),
      }));
  
      alert("Lesson updated successfully!");
      setEditingLesson(null);
      
    } catch (error) {
      console.error("Error updating lesson:", error.response?.data || error.message);
      alert("Failed to update lesson. Check console for details.");
      
    }
  };
  

  // // Delete a lesson
  // const handleDeleteLesson = async (lessonId) => {
  //   try {
  //     await api.delete(`/api/lessons/${lessonId}/`);
  //     setCourse((prevCourse) => ({
  //       ...prevCourse,
  //       lessons: prevCourse.lessons.filter((lesson) => lesson.id !== lessonId),
  //     }));
  //     alert("Lesson deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting lesson:", error);
  //   }
  // };

  useEffect(() => {
    fetchCourse();
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
          <button onClick={handleSaveCourse}>Save Course</button>

          <div>
            <h2>Lessons</h2>
            {course.lessons.map((lesson) => (
              <div key={lesson.id}>
                <p>{lesson.title}</p>
                <p>{lesson.content}</p>
                {lesson.video_url && <a href={lesson.video_url}>View Video</a>}
                <button onClick={() => setEditingLesson(lesson)}>Edit</button>
                <button onClick={() => handleDeleteLesson(lesson.id)}>Delete</button>
              </div>
            ))}
          </div>

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
              <button onClick={handleEditLesson}>Save Lesson</button>
              <button onClick={() => setEditingLesson(null)}>Cancel</button>
            </div>
          ) : (
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
