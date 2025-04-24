### CodeSpace (Learning Management System)
This project is a full-stack Learning Management System (LMS) developed using Django (backend) and React (frontend). It was built to facilitate the delivery of educational content in a user-friendly, scalable, and modern environment. The LMS offers a platform where instructors can create and manage courses, while students can enroll in those courses, access video lessons, and leave feedback through course reviews.

-----------------------------------------------  

### Specification

## Authentication and User Roles
- Users must be able to register, log in, and log out using JWT-based authentication.
- During registration, users must select a role: either “Student” or “Instructor.”
- Upon login, users will be have specific dashboards to their role.
   - Instructors will see their created courses.
   - Students will see their enrolled courses.

## Instructor Features
Course Creation
 - Authenticated instructors must be able to create new courses by providing a course title, description, and image.
 - Courses are saved in the backend and are immediately available in the “All Courses” listing after publishing.

Lesson Management
 - Instructors must be able to add multiple lessons to each course.
 - Each lesson must include:
   - A title
   - A optional video (uploaded and stored via AWS S3)
   - An optional description
 - Instructors must be able to update or delete lessons after creation.

Course Dashboard
- Instructors must have access to a dashboard that lists their created courses and provides options to:
   - Edit course info
   - Delete or publish the course
   - Add or edit lessons
   - View student reviews

Instructor Analytics
- Provide instructors with basic analytics, such as:
   - Number of enrolled students
   - Number of their published courses

## Student Features
Course Enrollment
 - Authenticated students must be able to enroll in any available course.
 - Once enrolled, the course is added to their "My Courses" dashboard.

Viewing Lessons
 - Enrolled students must be able to view lessons one at a time via a dynamic layout:
   - The left sidebar should list all lessons.
   - The main content area displays the currently selected lesson video and description.

Review and Rating
 - After enrolling, students must be able to leave a review and a rating (1 to 5 stars) for a course.
 - Only enrolled users can submit reviews.
 - The course page must display all reviews, along with reviewer names, comments, and rating scores.

## Course Pages
 - All users (including unauthenticated) must be able to view a landing page listing all published courses.
 - Clicking on a course must open a course detail page with:
   - Course title and description
   - Instructor name
   - List of reviews and average rating
   - A button to enroll (for students only, and only if not already enrolled)

## Profile and Media Uploads
- All users should have a profile page showing their name, email, and role.
- Users can optionally upload a profile picture, which is stored via AWS S3 and displayed throughout the app.
- Users can optionally add bio for their profile.

## Protected Routes and Access Control
- Students should not be able to access course creation or lesson management routes.
- Instructors should not be able to enroll in courses.
- Lesson content must be restricted to enrolled students only — non-enrolled users should be blocked or redirected.

## Responsive UI
The application must be fully responsive and styled with Tailwind CSS v4, ensuring usability on both desktop and mobile devices.

## Search and Filter
- Add functionality to search for courses by title.
- Allow users to filter courses based on category.

--------------------------------------

## Tech Stack

### Backend (Django)
- Django 5.2 with Django REST Framework
- djangorestframework-simplejwt for authentication
- django-storages & boto3 for AWS S3 file storage
- PostgreSQL / SQLite as database
- Custom `Profile` model with user roles and media fields

### Frontend (React + Vite)
- React 18.3.1 with Vite
- React Router v6 for routing
- Axios for API calls
- Tailwind CSS v4 for UI styling
- Framer Motion for animations
- React Context API for global auth state


### Distinctiveness:
- The project allows students to enroll in courses, view lesson content, and provide course reviews, all while maintaining user-friendly interfaces built with React and styled using Tailwind CSS.
- Instructors have a separate dashboard for course creation, management, and interaction with students. 
- The backend is powered by Django, utilizing JWT authentication for secure login and access to protected routes.
- The system features an enrollment flow that is dependent on user authentication, ensuring that only authorized users can access course materials.
- The project implements real-time features with dynamic rendering, such as loading course content and reviews on the same page without page refreshes.

### Complexity:
- The app integrates Django’s REST framework to build a backend with CRUD functionality for courses, lessons, and reviews.
- React and Axios were used to build the frontend, which dynamically loads course and lesson information. This setup allows for a responsive, interactive UI.
- JWT-based authentication ensures a secure login and protected route management.
- The system implements a review functionality where enro lled students can provide ratings and comments on courses they have completed.
- Integration of AWS S3 for profile picture handling was added to the user model, enhancing the functionality of the application.
- The application also ensures smooth handling of token expiration and refresh logic, enhancing the user's session persistence experience.

This project can serve as:
- A full-stack portfolio project
- A freelance LMS starter kit
- A nonprofit teaching platform

## Project Files

### Backend:
- `api/`: Contains Django REST framework views and serializers for courses, lessons, and reviews.
- `lms_project/settings.py`: Configuration of Django settings, including JWT settings.
- `lms_project/urls.py`: Routing for API endpoints and views.
- `lms_project/models.py`: Models defining the structure of course, lesson, and user-related data.
- `lms_project/serializers.py`: Serializers for transforming data into JSON format and validating user input.
- `lms_project/views.py`: Views for handling HTTP requests and returning responses.

### Frontend:
- `src/`: Contains all frontend React components, including those for authentication, course management, and student views.
- `src/context/`: Contains the `AuthContext.js` for managing global authentication state across the React app.
- `src/components/`: Includes reusable components such as `Navbar`, `Laypout`, and `ProectedRoute`.
- `src/App.js`: Main file where routes are defined for different views (course list, course page, login, etc.).
- `src/utils/api.js`: Contains Axios configuration to make HTTP requests to the backend API with token-based authentication.

### Miscellaneous:
- `requirements.txt`: Lists the Python packages necessary to run the application. It includes Django, Django REST framework, JWT, and other dependencies required for the backend.


## How to Run the Application

### Prerequisites:
- Python 3.13.3
- Node.js and npm (or Yarn)
   yarn : 1.22.22
   node : v20.19.0

                                                         
         
### Steps to Run:

1. **Backend (Django)**:
    1. Clone the repository to your local machine.
    2. Install the required Python packages:
       pip install -r requirements.txt
       
    3. Set up the database and run migrations:
       python manage.py migrate
       
    4. Create a superuser to access the admin interface:
       python manage.py createsuperuser
       
    5. Run the Django development server:
       python manage.py runserver
       
    6. The API will be running at `http://localhost:8000/`.

2. **Frontend (React+ Vite)**:
    1. Navigate to the frontend directory:
       cd lms_frontend
      
    2. Install the required Node.js packages:
       yarn install
       
    3. Run the React development server:
       yarn dev
       
    4. The frontend will be running at `http://localhost:5173/`.

## Additional Information

### Key Features:
- JWT-based authentication for user login and session management.
- Role-based access control, allowing for distinct views for instructors and students.
- Dynamic course and lesson content rendering.
- AWS S3 integration for profile pictures.
- Real-time course enrollment and review functionality.
- Modern UI design using Tailwind CSS.



Here is the `requirements.txt` file for the backend:

