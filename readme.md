# File Storage Service

a.

The goal of this project is to deeply understand how file uploads work—from the HTTP protocol to production cloud storage.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- AWS S3
- Cloudinary
- Streams
- Buffers

---

## Features

- Single File Upload
- Multiple File Upload
- Image Upload
- File Validation
- File Metadata Storage
- File Download API
- File Delete API
- Streaming Downloads
- AWS S3 Integration
- Cloudinary Integration
- Signed URLs
- Large File Upload Support

---

## Project Structure

```
src/
│
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── uploads/
├── utils/
│
├── app.js
└── server.js
```

---

## Run Project

Install dependencies

```bash
npm install
```

Run

```bash
npm run dev
```

---

## Environment Variables

```
PORT=3000

MONGODB_URI=mongodb://localhost:27017/file-storage
```

---

## Learning Goals

This project focuses on understanding

- Multipart Form Data
- Multer
- Streams
- Buffers
- Storage Engines
- AWS S3
- Cloudinary
- File Security
- Production Best Practices

---

See **PROJECT_PLAN.md** for the complete roadmap.