# 🚀 CodeMaster - Interactive Question Management Sheet

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-34d399?style=for-the-badge&logo=vercel&logoColor=white)](YOUR_DEPLOYMENT_LINK_HERE)
[![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**An interactive DSA problem tracker with AI assistance, drag-and-drop reordering, and real-time progress tracking**

[🌐 Live Demo](YOUR_DEPLOYMENT_LINK_HERE) • [📖 Features](#-features) • [🚀 Quick Start](#-quick-start)

</div>

---

## 📋 Overview

CodeMaster is a single-page web application for managing hierarchical DSA questions organized by topics and sub-topics. Built with React, TypeScript, and Tailwind CSS, it provides an intuitive interface for tracking coding interview preparation.

---

## ✨ Features

### Core Functionality (Assignment Requirements)
- ✅ **Add/Delete Topics** - Create and remove topic categories
- ✅ **Add/Delete Sub-topics** - Organize questions under topics
- ✅ **Add/Delete Questions** - Manage individual problems with URLs, difficulty levels, and descriptions
- ✅ **Drag & Drop Reordering** - Rearrange topics using intuitive drag-and-drop
- ✅ **State Management** - Zustand with LocalStorage persistence
- ✅ **Responsive Design** - Mobile-friendly with Tailwind CSS

### Bonus Features
- 🤖 **AI Chatbot** - Integrated Gemini AI for problem hints and explanations
- 🎨 **Dark/Light Mode** - Theme switching with persistent preferences
- 🎉 **Confetti Celebrations** - Visual feedback when completing topics
- 📊 **Progress Tracking** - Animated progress bars and analytics dashboard
- 📝 **Notes System** - Take notes on individual questions
- 🔖 **Bookmarking** - Mark important problems for quick access
- 🔍 **Advanced Filtering** - Filter by difficulty level and bookmarks
- ✅ **Status Workflow** - Track progress: Todo → Solved → Revision

---

## 🛠️ Tech Stack

- **Frontend**: React 19.2.4, TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (CDN), Custom Glassmorphism UI
- **State Management**: Zustand 5.0.11 with persist middleware
- **AI Integration**: Google GenAI SDK 1.40.0 (Gemini 2.5 Flash Lite)
- **UI Libraries**: 
  - Lucide React (icons)
  - @dnd-kit (drag & drop)
  - canvas-confetti (celebrations)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/codemaster.git
cd codemaster

# Install dependencies
npm install

# Create .env.local file
echo "VITE_API_KEY=your_gemini_api_key_here" > .env.local

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎯 Usage

1. **Add Topics** - Click the `+` button to create new topic categories
2. **Add Sub-topics** - Expand a topic and add sub-categories
3. **Add Questions** - Add problems with title, URL, difficulty, and description
4. **Track Progress** - Click status buttons to cycle: Todo → Solved → Revision
5. **Reorder Topics** - Drag and drop topics to prioritize your learning
6. **Use AI Assistant** - Click the chat button for hints and explanations
7. **Take Notes** - Click the note icon to add personal notes
8. **Filter & Search** - Use difficulty filters and bookmarks to focus your study

---

## 📸 Screenshots

### Main Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Add+Your+Screenshot+Here)

### AI Chatbot
![Chatbot](https://via.placeholder.com/800x400?text=Add+Your+Screenshot+Here)

---

## 🎨 UI Highlights

- **Glassmorphism Design** - Frosted glass effects with backdrop blur
- **Smooth Animations** - Progress bars, hover effects, and transitions
- **Ambient Lighting** - Dynamic gradient backgrounds
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Collapsible Sidebar** - Maximize workspace on desktop

---

## 📝 Assignment Compliance

This project fulfills all requirements from the Interactive Question Management Sheet assignment:

| Requirement | Status |
|------------|--------|
| Add/Delete Topics | ✅ |
| Add/Delete Sub-topics | ✅ |
| Add/Delete Questions | ✅ |
| Drag & Drop Reordering | ✅ |
| React Framework | ✅ |
| Tailwind CSS | ✅ |
| Zustand State Management | ✅ |
| Sample Data Integration | ✅ |
| Clean & Intuitive UI | ✅ |
| Bonus Improvements | ✅ (10+ features) |

---

## 🐛 Known Issues

- Edit functionality for topics/sub-topics not yet implemented
- Drag & drop limited to topics only (sub-topics/questions coming soon)
- API integration uses local state (no backend calls)

---

## 📄 License

This project is licensed under the MIT License.

---

## 📧 Contact

**Developer**: [Your Name]  
**Email**: your.email@example.com  
**GitHub**: [@yourusername](https://github.com/yourusername)  
**LinkedIn**: [Your Profile](https://linkedin.com/in/yourprofile)

---

<div align="center">

**Made with ❤️ for the Internship Assignment**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/codemaster?style=social)](https://github.com/yourusername/codemaster/stargazers)

</div>
