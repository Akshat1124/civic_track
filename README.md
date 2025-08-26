CIVIC TRACK
Your Voice for a Better City - A comprehensive digital platform for civic engagement and municipal services.

Table of Contents
Overview

Features

Tech Stack

Getting Started

Project Structure

API Endpoints

Available Scripts

Contributing

License

Overview
CIVIC TRACK is a modern web application designed to bridge the gap between citizens and municipal services. It provides a transparent, efficient, and user-friendly platform for filing complaints, tracking their progress, paying taxes, and accessing public information.

Live Demo
Coming Soon - Deployment in progress

Screenshots
Screenshots will be added here

Features
Homepage
Modern hero section with call-to-action buttons

Step-by-step process explanation

Live statistics with animated counters

Interactive complaint tracking

Ward information lookup

Complaint Management
File Complaints: Comprehensive form with photo upload and location detection

Track Status: Real-time tracking with unique complaint IDs

Status History: Complete timeline of complaint resolution

Category-based Filing: Organized complaint categories

Tax Payment Portal
Multiple Tax Types: Property, Water, Trade License, Building Permit, Garbage Collection, Parking

Secure Payment: Multiple payment methods (UPI, Cards, Net Banking, Wallets)

Instant Receipts: Download payment confirmations

Payment History: Track all transactions

Public Information
Public Notices: View and download official notices and tenders

Department Directory: Contact information for all municipal departments

FAQ Section: Comprehensive help and support documentation

User Experience
Responsive Design: Works seamlessly on desktop, tablet, and mobile.

Dark/Light Mode: Toggle between themes.

Multi-language Support: Google Translate integration.

Accessibility: WCAG compliant design.

Progressive Web App: Offline capabilities.

Tech Stack
Frontend
React 19.1.0 - Modern UI library

Tailwind CSS 3.4.17 - Utility-first CSS framework

Chart.js 4.5.0 - Data visualization

React CountUp 6.5.3 - Animated counters

React Intersection Observer 9.16.0 - Scroll animations

Backend
Node.js - JavaScript runtime environment

Express - Web framework for Node.js

MongoDB - NoSQL database for storing complaints and user data

Mongoose - Object Data Modeling (ODM) library for MongoDB

bcryptjs - Library for hashing passwords

cors - Middleware for enabling Cross-Origin Resource Sharing

dotenv - Module for loading environment variables from a .env file

Maps & Location
Leaflet 1.9.4 - Interactive maps

React Leaflet 5.0.0 - React components for Leaflet

Development Tools
Create React App 5.0.1 - Build tooling

PostCSS 8.5.6 - CSS processing

Autoprefixer 10.4.21 - CSS vendor prefixing

Testing
Jest & React Testing Library - Unit and integration testing

Web Vitals 2.1.4 - Performance monitoring

Getting Started
Prerequisites
Node.js (v16 or higher)

npm or yarn

Git

Installation
Clone the repository

Bash

git clone https://github.com/Akshat1124/civic_track.git
cd civic_track
Install frontend dependencies

Bash

cd frontend
npm install
Install server dependencies

Bash

cd ../server
npm install
Start the frontend development server

Bash

cd ../frontend
npm start
Start the backend server

Bash

cd ../server
npm start
Open your browser
Navigate to http://localhost:3000

Environment Setup
Create a .env file in the server directory:

Code snippet

MONGODB_URI=your_mongodb_connection_string
PORT=5000
Project Structure
civic_track/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── App.js                 # Main application component
│   │   ├── App.css               # Application styles
│   │   ├── index.js              # Entry point
│   │   ├── index.css             # Global styles with Tailwind imports
│   │   └── api.js                # API handling
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── package.json              # Dependencies and scripts
│   └── README.md                 # Project documentation
├── server/
│   ├── models/
│   │   ├── Complaint.js          # Complaint schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── complaint.js          # Complaint routes
│   ├── .env                      # Environment variables
│   ├── package.json              # Server dependencies
│   └── server.js                 # Express server setup
└── README.md                     # Main project README
API Endpoints
Authentication
POST /api/auth/register: Register a new user.

POST /api/auth/login: Log in an existing user.

Complaints
POST /api/complaint/file: File a new complaint.

GET /api/complaint/track/:id: Track a complaint by its ID.

Available Scripts
Frontend
npm start: Runs the app in the development mode.

npm test: Launches the test runner in the interactive watch mode.

npm run build: Builds the app for production to the build folder.

npm run eject: Removes the single dependency configuration from the project.

Server
npm start: Starts the server.

npm test: Runs the test suite.

Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch

Bash

git checkout -b feature/your-feature-name
Commit your changes

Bash

git commit -m "Add your feature description"
Push to the branch

Bash

git push origin feature/your-feature-name
Open a Pull Request

Code Style
Use Prettier for code formatting.

Follow React best practices.

Write meaningful commit messages.

Add comments for complex logic.

Testing
Write tests for new features.

Ensure all tests pass before submitting a PR.

Maintain code coverage above 80%.

License
This project is licensed under the MIT License - see the LICENSE file for details.
