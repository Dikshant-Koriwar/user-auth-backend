
```markdown
# 🛡️ Node.js Authentication API

A complete and secure user authentication API built using **Node.js**, **Express**, **MongoDB**, **JWT**, and **Mailtrap**. This backend service supports registration with email verification, login, logout, forgot/reset password, and protected routes.

---


---

## 🚀 Features

- ✅ User registration with email verification
- ✅ Login with JWT (stored in secure, HTTP-only cookie)
- ✅ Logout user by clearing cookie
- ✅ Get authenticated user (`/me`)
- ✅ Forgot password and email-based reset
- ✅ Reset password via token
- 🔐 Passwords are securely hashed with `bcryptjs`
- 📧 Nodemailer used with Mailtrap for testing email flows
- 🔗 Environment-based configuration using `.env`

---

## 🌱 Environment Variables

Create a `.env` file in the root of your project with the following:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret

# Application URL
BASE_URL=http://localhost:5000

# Mailtrap SMTP Configuration
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your_mailtrap_username
MAILTRAP_PASSWORD=your_mailtrap_password
MAILTRAP_SENDEREMAIL=no-reply@example.com
```

---

## 🛠 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Dikshant-Koriwar/user-auth-backend.git
cd auth-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up `.env`

Create and configure your `.env` file as shown above.

### 4. Connect to MongoDB

Set your MongoDB connection string in `index.js`. Use MongoDB locally or from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### 5. Run the Server

```bash
npm run dev
```

> API will be live at: `http://localhost:3000`

---

## 📮 API Endpoints

| Method | Endpoint                                | Description                     |
|--------|-----------------------------------------|---------------------------------|
| POST   | `/api/v1/user/register`                 | Register user                   |
| GET    | `/api/v1/user/verify/:token`            | Email verification              |
| POST   | `/api/v1/user/login`                    | Login and receive token         |
| GET    | `/api/v1/user/me`                       | Get logged-in user's data       |
| POST   | `/api/v1/user/logout`                   | Logout user                     |
| POST   | `/api/v1/user/forgot-password`          | Send reset password email       |
| POST   | `/api/v1/user/reset-password/:token`    | Reset password with token       |

---

## 📬 Email Verification & Password Reset

- Emails are handled via [Mailtrap](https://mailtrap.io/), ideal for dev/testing.
- On **register**, user receives a verification email.
- On **forgot password**, user receives a reset link with expiry.
- **Reset password** validates token & updates password securely.

---

## 🔐 Security Highlights

- Passwords are hashed using `bcryptjs`.
- JWT stored securely in HTTP-only cookies.
- Email verification ensures account authenticity.
- Reset tokens expire for added security.

---

## 🧪 Testing API

Use **Postman**, **Thunder Client**, or any API testing tool to interact with endpoints.

### Sample Register Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePass123"
}
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Got suggestions or improvements? Feel free to open issues or PRs!

---

## 💬 Contact

- GitHub: [@DikshantKoriwar](https://github.com/Dikshant-Koriwar)
- Twitter: [@DikshantKoriwar](https://x.com/Dikshantk29)
```

---

Let me know if you'd like:

- A `.env.example` template ✅  
- A `Postman` collection ✅  
- Swagger/OpenAPI docs ✅  
- Docker setup 🐳

I can generate any of those instantly.
