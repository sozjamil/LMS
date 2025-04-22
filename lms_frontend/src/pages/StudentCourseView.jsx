import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';

const StudentCourseView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/api/courses/${id}`);
        setCourse(res.data);
        const hasAccess = res.data.lessons?.[0]?.content !== 'Enroll to see the content';
        setIsEnrolled(hasAccess);
        if (hasAccess) {
          setSelectedLesson(res.data.lessons[0]);
        }
      } catch (err) {
        console.error('Failed to load course', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!isEnrolled) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-600 mt-2">You must enroll in this course to view lessons.</p>
        <button
          onClick={() => navigate(`/courses/${id}`)}
          className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-lg"
        >
          Go to Course Page
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6 grid md:grid-cols-4 gap-6">
      {/* Sidebar: List of Lessons */}
      <div className="bg-white shadow-lg rounded-xl p-4 h-[80vh] overflow-y-auto col-span-1">
        <h2 className="text-lg font-semibold mb-4">Lessons</h2>
        {course.lessons.map((lesson, index) => (
          <button
            key={lesson.id}
            onClick={() => setSelectedLesson(lesson)}
            className={`block w-full text-left px-4 py-2 mb-2 rounded-lg ${
              selectedLesson?.id === lesson.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {index + 1}. {lesson.title}
          </button>
        ))}
      </div>

      {/* Content Viewer */}
      <div className="col-span-3 bg-white shadow-lg rounded-xl p-6 space-y-4">
        {selectedLesson ? (
          <>
            <h2 className="text-2xl font-bold">{selectedLesson.title}</h2>
            {selectedLesson.video_url ? (
              <video
                src={selectedLesson.video_url}
                controls
                className="w-full rounded-xl shadow"
              />
            ) : (
              <p className="italic text-red-500">No video available</p>
            )}
            <p className="text-gray-700 mt-4">{selectedLesson.content}</p>
          </>
        ) : (
          <p>Select a lesson to begin.</p>
        )}
      </div>
    </div>
  );
};

export default StudentCourseView;
