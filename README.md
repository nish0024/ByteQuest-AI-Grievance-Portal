# Problem Statement
AI for Grievance Redressal in Public Governance

# Project Name
Smart Grievance AI – Automated Complaint Classification System

# Team Name
The Sirens

# Deployed Link
Not deployed yet

# 2-minute Demonstration Video Link
Will be updated

# PPT Link
Will be updated

---

## Project Overview
Public governance bodies receive thousands of citizen grievances every day related to roads, water supply, sanitation, healthcare, electricity, and other civic issues. These grievances are usually submitted as unstructured text and are manually reviewed, which leads to delays, poor prioritization, and lack of transparency.

Smart Grievance AI is an intelligent grievance redressal system powered by **Google Gemini AI** that automatically analyzes grievance text, intelligently classifies complaints into relevant categories, assigns priority levels based on urgency, and generates concise summaries. This helps authorities resolve critical complaints faster and improves overall citizen satisfaction.

---

## System Architecture
The system follows a modern full-stack architecture:

1. **Citizen Portal** - A React-based responsive web interface for citizens to submit grievances with a multi-step form (personal details, grievance details, document upload)
2. **Backend API** - An Express.js server that handles grievance submission, AI processing, and data management
3. **AI Processing Layer** - Google Gemini Flash API integration for intelligent grievance analysis, categorization, priority detection, and summarization
4. **Database** - MongoDB Atlas for persistent storage of grievances and tracking
5. **Tracking System** - Real-time grievance status tracking using unique tracking IDs

---

## Features

### Citizen Features
- **Multi-Step Grievance Submission Form** - User-friendly 3-step form with validation
  - Step 1: Personal Information (Name, Email, Mobile with OTP verification, Aadhaar, Address)
  - Step 2: Grievance Details (Department selection, Priority, Subject, Description, Incident Date)
  - Step 3: Document Upload and Review
- **OTP-Based Mobile Verification** - Secure verification for citizen identity
- **Real-Time Grievance Tracking** - Track complaint status using unique tracking ID
- **Department Selection** - Choose from 9+ government departments (Water, Electricity, Transport, Health, Education, Police, Municipality, Land, etc.)

### AI-Powered Features
- **Intelligent Category Classification** - Gemini AI automatically categorizes grievances
- **Smart Priority Detection** - AI-assigned priority levels (High/Medium/Low) based on urgency analysis
- **AI-Generated Summaries** - Concise one-sentence summaries of each grievance
- **Automated Department Routing** - Smart routing based on complaint content

### Technical Features
- **Responsive Design** - Modern UI that works on all devices
- **Real-Time Form Validation** - Client-side validation for better UX
- **File Upload Support** - Attach supporting documents (up to 5MB)
- **REST API** - Well-structured API endpoints for all operations

---

## Technology Stack

### Frontend
- **React.js 19** - Modern React with hooks for UI components
- **React Router v7** - Client-side routing and navigation
- **Vite** - Next-generation frontend build tool
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5** - Web application framework
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing support
- **dotenv** - Environment variable management

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database

### AI/ML Layer
- **Google Generative AI SDK** - Official Gemini API integration
- **Gemini Flash** - Fast and efficient AI model for text analysis
- **Prompt Engineering** - Structured prompts for consistent JSON responses

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/report` | Submit a new grievance (triggers AI analysis) |
| GET | `/api/grievances` | Get all grievances (for admin) |
| GET | `/api/grievance/:id` | Get single grievance by tracking ID |

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Google AI Studio API key (for Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ByteQuest-2025/GFGBQ-Team-the-sirens.git
   cd GFGBQ-Team-the-sirens
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Configure your MongoDB URL and Gemini API key in index.js
   node index.js
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

---

## Project Structure
```
GFGBQ-Team-the-sirens/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.jsx        # Main app with routing
│   │   ├── LandingPage.jsx    # Home page with navigation
│   │   ├── GrievanceForm.jsx  # Multi-step grievance form
│   │   ├── TrackRequest.jsx   # Grievance tracking page
│   │   └── App.css        # Global styles
│   └── package.json
├── server/                 # Node.js Backend
│   ├── index.js           # Express server + Gemini AI integration
│   └── package.json
└── README.md
```

---

## Future Enhancements
- Admin dashboard with analytics and grievance management
- Voice-based grievance submission
- Multi-language complaint support (Hindi, Regional languages)
- Email/SMS notifications for status updates
- Integration with official government grievance portals (CPGRAMS)
- Advanced analytics dashboard for government authorities
- Sentiment analysis for priority escalation
- Chatbot for guided grievance submission
