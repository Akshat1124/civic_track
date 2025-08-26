# Civic Track

**Your Voice for a Better City**

Civic Track is a comprehensive digital platform for civic engagement and municipal services. The application empowers citizens to interact with their local government, file complaints, access public information, and manage municipal services efficiently.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Civic Track bridges the gap between citizens and municipal services through a transparent, user-friendly web application. With real-time complaint tracking, secure tax payments, and access to public information, Civic Track modernizes the way cities connect with their communities.

---

## Live Demo

Access the application here: [https://civic-track-sooty.vercel.app/](https://civic-track-sooty.vercel.app/)

---

## Screenshots

Below is a preview of the Civic Track landing page:

![image1](image1)

---

## Features

### General

- Modern landing page with intuitive navigation
- Live statistics and real-time counters
- Multi-language support via Google Translate

### Complaint Management

- File complaints with photo uploads and automatic location detection
- Real-time complaint status tracking with unique IDs
- Organized, category-based complaint filing

### Tax Payment Portal

- Support for Property, Water, Trade License, Building Permit, Garbage Collection, and Parking taxes
- Multiple secure payment methods (UPI, Cards, Net Banking, Wallets)
- Instant, downloadable payment receipts and full transaction history

### Public Information

- Access and download official municipal notices and tenders
- Department directory with contact information
- Comprehensive FAQ and help documentation

### User Experience

- Responsive design for desktop, tablet, and mobile
- Dark/Light mode toggle
- Accessibility compliance (WCAG)
- Progressive Web App features for offline support

---

## Tech Stack

### Frontend

- React 19.1.0
- Tailwind CSS 3.4.17
- Chart.js 4.5.0
- React CountUp 6.5.3
- React Intersection Observer 9.16.0

### Backend

- Node.js
- Express
- MongoDB & Mongoose
- bcryptjs
- cors
- dotenv

### Maps & Location

- Leaflet 1.9.4
- React Leaflet 5.0.0

### Development Tools

- Create React App 5.0.1
- PostCSS 8.5.6
- Autoprefixer 10.4.21

### Testing

- Jest & React Testing Library
- Web Vitals 2.1.4

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

#### Clone the repository

```bash
git clone https://github.com/Akshat1124/civic_track.git
cd civic_track
```

#### Install frontend dependencies

```bash
cd frontend
npm install
```

#### Install backend dependencies

```bash
cd ../server
npm install
```

#### Start the frontend development server

```bash
cd ../frontend
npm start
```

#### Start the backend server

```bash
cd ../server
npm start
```

#### Open the application

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the `server` directory:

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

---

## Project Structure

```
civic_track/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   └── api.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
├── server/
│   ├── models/
│   │   ├── Complaint.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── complaint.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── README.md
```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in an existing user

### Complaints

- `POST /api/complaint/file` - File a new complaint
- `GET /api/complaint/track/:id` - Track a complaint by ID

---

## Available Scripts

### Frontend

- `npm start` – Run the app in development mode.
- `npm test` – Launch the test runner.
- `npm run build` – Build the app for production.
- `npm run eject` – Remove Create React App configuration.

### Server

- `npm start` – Start the Express server.
- `npm test` – Run backend tests.

---

## Contributing

We welcome contributions! To get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

**Code Style**

- Use Prettier for formatting.
- Follow React best practices.
- Write meaningful commit messages.
- Add comments for complex logic.

**Testing**

- Write tests for new features.
- Ensure all tests pass before submitting a PR.
- Maintain code coverage above 80%.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
