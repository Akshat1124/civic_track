# 🏛️ CIVIC TRACK

**Your Voice for a Better City** - A comprehensive digital platform for civic engagement and municipal services.

[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-06B6D4.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Pages & Navigation](#pages--navigation)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

CIVIC TRACK is a modern web application designed to bridge the gap between citizens and municipal services. It provides a transparent, efficient, and user-friendly platform for filing complaints, tracking their progress, paying taxes, and accessing public information.

### 🎭 Live Demo
*Coming Soon - Deployment in progress*

### 🖼️ Screenshots
*Screenshots will be added here*

## ✨ Features

### 🏠 **Homepage**
- Modern hero section with call-to-action buttons
- Step-by-step process explanation
- Live statistics with animated counters
- Interactive complaint tracking
- Ward information lookup

### 📝 **Complaint Management**
- **File Complaints**: Comprehensive form with photo upload and location detection
- **Track Status**: Real-time tracking with unique complaint IDs
- **Status History**: Complete timeline of complaint resolution
- **Category-based Filing**: Organized complaint categories

### 💰 **Tax Payment Portal**
- **Multiple Tax Types**: Property, Water, Trade License, Building Permit, Garbage Collection, Parking
- **Secure Payment**: Multiple payment methods (UPI, Cards, Net Banking, Wallets)
- **Instant Receipts**: Download payment confirmations
- **Payment History**: Track all transactions

### 📢 **Public Information**
- **Public Notices**: View and download official notices and tenders
- **Department Directory**: Contact information for all municipal departments
- **FAQ Section**: Comprehensive help and support documentation

### 🎨 **User Experience**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Multi-language Support**: Google Translate integration
- **Accessibility**: WCAG compliant design
- **Progressive Web App**: Offline capabilities

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Chart.js 4.5.0** - Data visualization
- **React CountUp 6.5.3** - Animated counters
- **React Intersection Observer 9.16.0** - Scroll animations

### Maps & Location
- **Leaflet 1.9.4** - Interactive maps
- **React Leaflet 5.0.0** - React components for Leaflet

### Development Tools
- **Create React App 5.0.1** - Build tooling
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

### Testing
- **Jest & React Testing Library** - Unit and integration testing
- **Web Vitals 2.1.4** - Performance monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshat1124/civic_track.git
   cd civic_track
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create a `.env` file in the root directory (optional):
```env
REACT_APP_API_URL=your_api_endpoint
REACT_APP_GOOGLE_TRANSLATE_KEY=your_google_translate_key
```

## 📁 Project Structure

```
civic_app/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.js                 # Main application component
│   ├── App.css               # Application styles
│   ├── index.js              # Entry point
│   ├── index.css             # Global styles with Tailwind imports
│   └── components/           # Reusable components
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies and scripts
└── README.md                 # Project documentation
```

## 📜 Available Scripts

### Development
```bash
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production
npm run eject      # Eject from Create React App (irreversible)
```

### Linting & Formatting
```bash
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## 🗺️ Pages & Navigation

### Hash-based Routing
The application uses hash-based routing for navigation:

- `#/` - Homepage
- `#/pay-tax` - Tax Payment Portal
- `#/notices` - Public Notices
- `#/departments` - Department Directory
- `#/faq` - Frequently Asked Questions

### Navigation Components
- **Header**: Top navigation with theme toggle and user account
- **Sidebar**: Mobile-friendly slide-out menu
- **Footer**: Links and contact information

## 🔌 API Integration

### Mock Data Structure
Currently using mock data for development:

```javascript
// Complaint Data
mockComplaintData = {
  'C-12345': {
    id: 'C-12345',
    submittedBy: 'User Name',
    category: 'Category',
    status: 'Status',
    history: [...]
  }
}

// Tax Data
mockTaxData = [
  {
    id: 'tax-id',
    title: 'Tax Name',
    description: 'Description',
    baseRate: 'Rate',
    features: [...]
  }
]
```

### Future API Integration
Ready for backend integration with RESTful APIs:
- Complaint CRUD operations
- Payment processing
- User authentication
- Document management

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Code Style
- Use Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

### Testing
- Write tests for new features
- Ensure all tests pass before submitting PR
- Maintain code coverage above 80%

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Akshat Srivastava** - Lead Developer
- *Add team members here*

## 📞 Support

For support and questions:
- 📧 Email: contact@civictrack.gov.in
- 📱 Phone: 0542-2501100
- 🏢 Address: Nagar Nigam Varanasi Head Office, Sigra, Varanasi, UP 221010

## 🙏 Acknowledgments

- Create React App team for the excellent boilerplate
- Tailwind CSS for the utility-first CSS framework
- React community for amazing libraries and tools
- Municipal Corporation of Varanasi for requirements and feedback

---

**Made with ❤️ for better civic engagement**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
>>>>>>> c4f8f4988dcdcac5538a6581830b186d8684ea4f
