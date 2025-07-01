# CodeSpace LMS

A full-stack Learning Management System (LMS) built with Django (backend) and React (frontend), deployed on Render with AWS RDS and S3 integration.

---

## Live Demo

- **Frontend:** [https://codespace-t4xo.onrender.com/](https://codespace-t4xo.onrender.com/)
- **Backend API:** [https://codespace-uq5o.onrender.com/](https://codespace-uq5o.onrender.com/)
- **Admin Panel:** [https://codespace-uq5o.onrender.com/admin/](https://codespace-uq5o.onrender.com/admin/)

---

## Features

- **JWT Authentication**: Secure login, registration, and role-based dashboards (Student/Instructor).
- **Course Management**: Instructors can create, edit, and manage courses and lessons.
- **Student Dashboard**: Students can enroll in courses, view lessons, and leave reviews.
- **Profile Management**: Users can upload profile pictures (stored on AWS S3) and edit their bio.
- **Media Storage**: All user-uploaded files and lesson videos are stored on AWS S3.
- **Database**: Uses AWS RDS (MySQL or PostgreSQL) for persistent data storage.
- **Responsive UI**: Built with React, Vite, and Tailwind CSS for a modern look and mobile support.
- **Protected Routes**: Access control for students and instructors.
- **Real-time Updates**: Dynamic course and lesson content loading.
- **Admin Panel**: Beautiful Jazzmin-styled Django admin for superusers.

---

## Tech Stack

- **Backend**: Django 5.x, Django REST Framework, SimpleJWT, django-storages, boto3
- **Frontend**: React 18.x, Vite, React Router v6, Axios, Tailwind CSS v4
- **Database**: AWS RDS (MySQL/PostgreSQL)
- **Media Storage**: AWS S3
- **Deployment**: Render.com (for both frontend and backend)

---

## Project Structure

```
lms_backend/
  ├── api/                # Django REST API views & serializers
  ├── courses/            # Course & lesson models
  ├── lms_backend/        # Django settings, URLs, wsgi
  ├── requirements.txt    # Python dependencies
lms_frontend/
  ├── src/
      ├── components/     # React components (Navbar, Layout, etc.)
      ├── context/        # AuthContext for global auth state
      ├── utils/          # api.js (Axios config), auth.js (JWT helpers)
      ├── App.js          # Main app routes
  ├── package.json        # Node dependencies
README.md
```

---

## How to Run Locally

### Prerequisites

- Python 3.13+
- Node.js v20+ and Yarn

### Backend (Django)

```bash
cd lms_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

- The API will be running at `http://localhost:8000/`

### Frontend (React + Vite)

```bash
cd lms_frontend
yarn install
yarn dev
```

- The frontend will be running at `http://localhost:5173/`

---

## Deployment

- **Backend**: Deployed on Render.com, connected to AWS RDS and AWS S3.
- **Frontend**: Deployed on Render.com as a static site.
- **Environment Variables**: All secrets (DB, S3, JWT, etc.) are set via Render’s dashboard.
- **Static & Media Files**: Static files served with Whitenoise; media files stored on S3.

---

## Environment Variables (example)

**Backend (.env or Render dashboard):**
```
DJANGO_SECRET_KEY=your-secret-key
DATABASE_URL=your-aws-rds-url
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket
AWS_REGION=your-region
```

**Frontend (Render dashboard):**
```
VITE_API_URL=https://codespace-uq5o.onrender.com
```

---

## Key Updates

- Switched database to AWS RDS for production.
- Media files (profile pics, lesson videos) now use AWS S3.
- Static files served with Whitenoise (no S3 for static).
- Jazzmin admin theme enabled and working.
- All API URLs in frontend use `VITE_API_URL` for easy deployment.
- CORS configured for frontend-backend communication.
- Navbar and authentication state managed via React Context API.

---

## Troubleshooting

- If static files (admin/Jazzmin styles) are missing, ensure `python manage.py collectstatic --noinput` runs on deploy and Whitenoise is installed.
- If frontend cannot connect to backend, check `VITE_API_URL` and CORS settings.
- If navbar does not update after login, check React Context and localStorage logic.

---


## Credits

- Built by Soz Jamil
- Powered by Django, React, AWS, and Render
