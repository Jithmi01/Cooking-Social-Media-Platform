```markdown
# 🍳 Cooking Social Media Platform

A social platform for food lovers to share recipes, post photos, and engage with fellow cooking enthusiasts. Built as part of a PAF (Project Application Framework) assignment using **Spring Boot (Backend)** and **React (Frontend)**.

---

## 📌 Features

- 🧑‍🍳 User registration & login (JWT-based authentication)
- 🍝 Post and share recipes with photos
- ❤️ Like, comment, and follow other foodies
- 🔍 Search for recipes by tags or ingredients
- 📸 Image upload support (e.g., for dishes)
- 🧾 Admin panel to manage users and content

---

## 🛠️ Tech Stack

### Backend (Spring Boot)
- Spring Boot 3.x
- Spring Security (JWT Auth)
- Spring Data JPA (Hibernate)
- MySQL (or H2 for testing)
- Lombok

### Frontend (React)
- React 18+
- React Router
- Axios for API requests
- Bootstrap / Tailwind CSS
- React Hook Form

---

## 📁 Project Structure

```

cooking-social-platform/
├── backend/
│   ├── src/main/java/com/example/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── CookingSocialApplication.java
│   └── resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── public/
└── README.md

````

---

## 🚀 Getting Started

### Backend

1. Go to `backend/` folder.
2. Configure `application.properties` for your DB.
3. Run the app:
```bash
./mvnw spring-boot:run
````

### Frontend

1. Go to `frontend/` folder.
2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
