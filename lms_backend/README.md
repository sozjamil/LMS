# My LMS (Learning Management System)

This project is a Learning Management System (LMS) built with Django and React, designed to provide an intuitive platform for students and instructors. It allows students to enroll in courses, view course content, and leave reviews. Instructors can create courses and manage the content. The application features a modern user interface with functionalities like user authentication, course management, and dynamic content rendering.


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
- The system implements a review functionality where enrolled students can provide ratings and comments on courses they have completed.
- Integration of AWS S3 for profile picture handling was added to the user model, enhancing the functionality of the application.
- The application also ensures smooth handling of token expiration and refresh logic, enhancing the user's session persistence experience.

This project was designed to be scalable, with a clean and minimalistic UI and robust backend functionality. The choice to use Django for the backend, combined with React for the frontend, makes this project distinct in its tech stack and approach.

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

