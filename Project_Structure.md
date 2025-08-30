📘 Student Resource Manager

A web application to manage and share academic resources among students.
Students can upload notes, books, lab manuals, past exam papers, and presentations.
Admins can review and approve resources before publishing.
Guests can search, filter, and download resources without logging in.

🚀 Features
👤 User Roles

=>Guest (Not Logged-in)

Search resources

Filter by semester, branch, type

Download resources

=>Student

Register/Login

Upload resources via website form

View their uploaded resources

Download resources

=>Admin

Approve/Reject uploaded resources

Edit/Delete resources

Manage students

View analytics (downloads, uploads, etc.)

📂 Resource Types

PPTs

Notes

Lab Manuals

Books

Mid Papers

GTU Papers

🏗️ Tech Stack

Frontend: React.js / Next.js

Backend: Node.js (Express) / FastAPI

Database: MongoDB

Storage: Cloudinary / AWS S3  

Authentication: Passport-JWT based Authentication

📑 Database Design
Users Table
Field	    Type	    Description
id	        int (PK)	User ID
name	    varchar	    Student/Admin name
email	    varchar	    Unique email
password	varchar	    Encrypted password
role	    enum	    student / admin
created_at	timestamp	Registration date

Resources Table
Field	    Type	    Description
id	        int (PK)	Resource ID
title	    varchar	    Resource title
type	    enum	    ppt, notes, book, lab manual, mid paper, gtu paper
branch	    varchar	    Branch (CSE, IT, ME, etc.)
semester	int	        Semester (1–8)
subject	    varchar	    Subject name
description	text	    Short description
file_url	varchar	    Path/URL to file
uploaded_by	int (FK)	User ID
status	    enum	    pending / approved / rejected
created_at	timestamp	Upload date

Reviews (new ✅)

For storing student feedback on resources.

Column	        Type	    Description
id (PK)	        int	        Review ID
resource_id	    int (FK)	Which resource is reviewed
user_id	        int (FK)	Student who reviewed
rating	        int	        Rating (1–5 stars)
comment	        text	    Review message
created_at	    timestamp	Review date

🔄 Workflow

Student uploads a resource → status = pending

Admin reviews → approve/reject

Approved resources become visible for all users

Guests & Students can search, filter, and download



Project Flow – Student Resource Manager
1. Setup & Project Structure

 Initialize Git repository

 Setup frontend (React/Next.js)

 Setup backend (Node.js + Express)

 Setup database (MongoDB)

 Configure environment variables (DB, storage, JWT secret)

2. User Management

 User registration (student)

 User login (JWT authentication)

 Role-based access (student vs admin)

 Profile page (student resources uploaded)

 Admin dashboard

3. Resources Module

 Create Resources table in DB

 Build upload form (title, type, branch, semester, subject, description, file upload)

 File storage (local folder or cloud e.g., AWS S3)

 API to upload resource (status = pending)

 Admin review (approve/reject resources)

 List & display approved resources

 Search & filter (by semester, branch, type, subject)

 Download resource functionality

4. Reviews Module

 Create Reviews table in DB

 Allow students to add review (rating + comment)

 Display reviews under each resource

 Show average rating for each resource

5. FAQs Module

 Create FAQs table in DB

 Admin can add/edit/delete FAQs

 Display FAQs page for all users

 Search/filter FAQs

6. Extra Features (Optional but Recommended)

 Downloads tracking table (analytics)

 Branches/Subjects tables (cleaner normalization)

 Resource statistics (most downloaded, top-rated)

 Bookmark/Favorite resources (student personal list)

 Email notifications when new resource is uploaded in student’s branch/semester

7. Final Touches

 Responsive frontend (mobile-friendly UI)

 Protect admin routes (middleware for role check)

 Error handling & validation (file type, required fields)

 Seed initial FAQs (common queries)

 Deployment (Vercel/Netlify for frontend, Render/Heroku for backend, Railway for DB)



