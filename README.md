**TaskFlowX – Real-Time Workflow Orchestration Platform 🚀**

A distributed task orchestration platform that enables users to submit file-based tasks, workers to process them in real time, and administrators to monitor, assign, and manage workflows through dedicated dashboards.

Built with modern backend technologies including Redis, BullMQ, PostgreSQL, Socket.io, Cloudinary, and Docker to simulate a production-grade task processing system.

🌟 Features
👤 User Features
Secure JWT Authentication
Create and manage tasks
Upload files (images, documents, videos)
Real-time task tracking
Live progress updates
Download processed results
Task history dashboard
👷 Worker Features
Dedicated worker dashboard
Automatic task assignment
View uploaded input files
Update task progress
Upload processed output files
Mark tasks as completed or failed
Real-time status synchronization
👑 Admin Features
System-wide monitoring dashboard
View all users, workers, and tasks
Manual task assignment
Worker workload management
Task priority management
Live system statistics
Queue monitoring
🏗️ System Architecture
User Dashboard
      │
      ▼
Create Task + Upload File
      │
      ▼
PostgreSQL Database
      │
      ▼
Redis Queue (BullMQ)
      │
      ▼
Worker Assignment Engine
      │
      ▼
Worker Dashboard
      │
      ▼
Process Task
      │
      ▼
Upload Result (Cloudinary)
      │
      ▼
Real-Time Socket Updates
      │
      ▼
User Downloads Result
⚙️ Tech Stack
Frontend
React.js
Tailwind CSS
Framer Motion
Axios
Socket.io Client
React Hot Toast
Backend
Node.js
Express.js
JWT Authentication
Socket.io
Multer
Database & Queue
PostgreSQL
Redis
BullMQ
File Storage
Cloudinary
DevOps
Docker
Docker Compose
🔐 Authentication & Authorization

Implemented Role-Based Access Control (RBAC):

Role	Permissions
User	Create and track tasks
Worker	Process assigned tasks
Admin	Manage entire system

Authentication Features:

JWT Access Tokens
Refresh Tokens
Protected Routes
Role-Based Dashboards
Worker Online Status Tracking
📂 Task Lifecycle
Task Created
      │
      ▼
Pending
      │
      ▼
Assigned
      │
      ▼
Processing
      │
      ▼
Completed / Failed
🔄 Queue Processing

BullMQ + Redis powers the background processing pipeline.

Features:

Distributed queue architecture
Smart worker assignment
Automatic retries
Exponential backoff
Priority-based execution
Worker load balancing

Example:

await taskQueue.add(
  "process-task",
  {
    taskId: task.id
  },
  {
    jobId: `task-${task.id}`
  }
);
📡 Real-Time Communication

Socket.io enables live synchronization across dashboards.

Events:

task_created
task_update
worker_online
worker_offline

Benefits:

Instant UI updates
No page refresh required
Real-time progress tracking
Live worker monitoring
📁 File Management

Cloudinary integration supports:

Images
PDFs
Documents
Videos
Result uploads

Workflow:

User Upload
     │
     ▼
Cloudinary
     │
     ▼
Database URL Storage
     │
     ▼
Worker Access
     │
     ▼
Result Upload
     │
     ▼
User Download
🐳 Dockerized Architecture

Services:

Frontend
Backend API
Worker Service
PostgreSQL
Redis

Run entire stack:

docker-compose up --build

Stop services:

docker-compose down
📊 Database Schema
Users
id
email
password
role
is_online
refresh_token
created_at
Tasks
id
title
description
priority
status
progress
user_id
worker_id
file_url
result_url
created_at
started_at
completed_at
🚀 Installation
Clone Repository
git clone https://github.com/your-username/taskflowx.git
cd taskflowx
Install Dependencies
npm install
Environment Variables

Create .env

PORT=8080

DATABASE_URL=your_database_url

CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
Start Development
docker-compose up --build
📈 Future Enhancements
Payment Gateway Integration
Escrow-based Task Payments
AI Worker Matching
Email Notifications
Analytics Dashboard
Task SLA Monitoring
Kubernetes Deployment
CI/CD Pipelines
Worker Performance Metrics
Multi-Tenant Architecture
🎯 Learning Outcomes

This project demonstrates practical experience with:

Distributed Systems
Queue-Based Architectures
Real-Time Applications
Authentication & Authorization
Worker Scheduling
Cloud File Storage
Dockerized Deployments
PostgreSQL Database Design
Redis-Based Processing
Production Backend Development
👨‍💻 Author

Guna Sai Venkata Reddy Kovvuri

B.Tech Mechanical Engineering, NIT Delhi

Aspiring Software Development Engineer | Full Stack Developer | Backend Systems Enthusiast
