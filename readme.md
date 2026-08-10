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

## File APIs

All uploaded files use `multipart/form-data` with a `file` field and have a 5 MB limit.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/files/upload` | Upload a JPEG, PNG, WEBP, or PDF and save its metadata. |
| GET | `/files` | List active file metadata. |
| GET | `/files/:id` | Get one file's metadata. |
| GET | `/files/:id/download` | Download a file using its original name. |
| GET | `/files/:id/stream` | Stream a file; accepts a single `Range: bytes=start-end` request. |
| DELETE | `/files/:id` | Remove the local file and soft-delete its metadata. |

`GET /files/:id/stream` uses `fs.createReadStream()` and `readStream.pipe(res)` instead of loading the file into memory. Piping lets Node pause and resume the source stream to match the response's capacity (backpressure). Range requests return `206 Partial Content`, enabling media seeking and resumable downloads.

---

## Environment Variables

```
PORT=3000

MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=file-storage-service
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
