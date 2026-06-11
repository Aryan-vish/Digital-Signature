# File Structure

```text
digital-signature-platform/
├── client/
│   ├── public/
│   │   └── .gitkeep
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PdfViewer.jsx
│   │   │   ├── SignaturePad.jsx
│   │   │   ├── DocumentCard.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UploadDocument.jsx
│   │   │   ├── SignDocument.jsx
│   │   │   ├── Verification.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authApi.js
│   │   │   ├── documentApi.js
│   │   │   └── adminApi.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── documentController.js
│   │   ├── verificationController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── Signature.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── verificationRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── services/
│   │   ├── pdfService.js
│   │   ├── cloudinaryService.js
│   │   ├── emailService.js
│   │   └── auditService.js
│   ├── uploads/
│   │   ├── original/
│   │   │   └── .gitkeep
│   │   └── signed/
│   │       └── .gitkeep
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── admin/
│   └── Admin is implemented inside:
│       ├── client/src/pages/AdminDashboard.jsx
│       ├── client/src/services/adminApi.js
│       ├── server/controllers/adminController.js
│       ├── server/routes/adminRoutes.js
│       └── server/middleware/adminMiddleware.js
│
├── README.md
├── FILE_STRUCTURE.md
├── docker-compose.yml
└── .gitignore
```

## Admin Module

The admin dashboard is part of the React client and is protected by role-based access:

- Frontend page: `client/src/pages/AdminDashboard.jsx`
- Frontend API service: `client/src/services/adminApi.js`
- Backend controller: `server/controllers/adminController.js`
- Backend routes: `server/routes/adminRoutes.js`
- Backend middleware: `server/middleware/adminMiddleware.js`
