# Digital Signature & Document Management Platform

A production-oriented MERN MVP for uploading PDFs, previewing documents, drawing electronic signatures, generating signed PDFs, issuing public verification codes, and auditing user/admin activity.

## Tech Stack

- Frontend: React.js with Vite, React Router DOM, Tailwind CSS, Axios, React PDF Viewer, React Signature Canvas
- Backend: Node.js, Express.js, JWT, bcryptjs, Multer, pdf-lib
- Database: MongoDB Atlas with Mongoose

## Project Structure

```text
digital-signature-platform/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   └── package.json
├── README.md
├── .gitignore
└── docker-compose.yml
```

## Local Setup

1. Install dependencies:

```bash
cd server
npm install
cd ../client
npm install
```

2. Configure environment variables:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Update `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE_MB=10
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Run the backend:

```bash
cd server
npm run dev
```

5. Run the frontend:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Docker Setup

Run the full stack with local MongoDB:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000/api/health`

## API Summary

Authentication:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`

Documents:

- `POST /api/documents/upload`
- `GET /api/documents`
- `GET /api/documents/:id`
- `POST /api/documents/:id/sign`
- `GET /api/documents/:id/download`

Verification:

- `GET /api/verify/:verificationCode`

Admin:

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/documents`
- `DELETE /api/admin/documents/:id`
- `GET /api/admin/logs`

## Security Notes

- Passwords are hashed with bcrypt.
- JWT protects user routes.
- Admin routes require `role: "admin"`.
- PDF upload validates MIME type and file size.
- Helmet, CORS, JSON body limits, and rate limiting are enabled.
- Keep `JWT_SECRET` private and long.
- Store `.env` files outside source control.

## Admin User

The registration flow creates regular users. To promote an admin, update a user in MongoDB Atlas:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## PDF Signing Behavior

Uploaded PDFs are stored in Cloudinary as raw files. The backend saves the Cloudinary URL and public ID in MongoDB, fetches the original PDF from Cloudinary during signing, generates a signed PDF with `pdf-lib`, uploads the signed PDF back to Cloudinary, and proxies protected downloads through the API.

The MVP places the drawn signature on page 1 near the lower-right corner. The backend accepts a `position` object:

```json
{
  "page": 0,
  "x": 390,
  "y": 72,
  "width": 160,
  "height": 64
}
```

This can be extended into drag-and-drop placement by sending coordinates from the viewer surface.

## Deployment

### Backend on Render

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables from `server/.env.example`
- Set `CLIENT_URL` to your Vercel URL
- Use a persistent disk or external object storage for production PDF uploads. Render ephemeral filesystems are not suitable for long-term document storage.

### Frontend on Vercel

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL=https://your-render-api.onrender.com/api`

### MongoDB Atlas

- Create an Atlas cluster.
- Add your Render IP access rule or configure secure network access.
- Create a database user.
- Put the connection string into `MONGODB_URI`.

## Production Follow-Ups

- Configure Cloudinary signed/authenticated delivery if documents must not be accessible through public asset URLs.
- Add email-backed reset tokens in `emailService.js`.
- Add a drag-and-drop signature placement layer.
- Add refresh tokens and optional MFA for higher-security teams.
- Add document retention policies and stronger audit reporting exports.
