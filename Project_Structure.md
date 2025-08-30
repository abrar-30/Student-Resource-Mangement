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



