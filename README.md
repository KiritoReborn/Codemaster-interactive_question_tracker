# 🚀 CodeMaster - Ultimate Interactive SDE Tracker

<div align="center">

![CodeMaster Banner](https://img.shields.io/badge/CodeMaster-v2.0.4-6366f1?style=for-the-badge&logo=code&logoColor=white)
[![Live Demo](https://img.shields.io/badge/Live-Demo-34d399?style=for-the-badge&logo=vercel&logoColor=white)](YOUR_DEPLOYMENT_LINK_HERE)
[![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**A premium, AI-powered DSA tracking application with glassmorphism UI, confetti celebrations, and intelligent progress analytics**

[🌐 Live Demo](YOUR_DEPLOYMENT_LINK_HERE) • [📖 Documentation](#features) • [🚀 Quick Start](#getting-started)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Key Features](#-key-features)
- [🎨 UI/UX Highlights](#-uiux-highlights)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📦 Deployment](#-deployment)
- [🎯 Usage Guide](#-usage-guide)
- [🤝 Contributing](#-contributing)
- [� Licednse](#-license)

---

## Overview

**CodeMaster** is a next-generation DSA (Data Structures & Algorithms) preparation tracker designed to transform your coding interview preparation into an engaging, visually stunning experience. Built with modern web technologies and featuring an integrated AI assistant, CodeMaster helps you stay organized, motivated, and on track to ace your technical interviews.

### 🎯 Perfect For:
- Software Engineering Interview Preparation
- Competitive Programming Practice
- DSA Learning & Revision
- Technical Interview Tracking
- Coding Challenge Management

---

## ✨ Key Features

### 🧠 **Smart Problem Tracking**
- **Pre-loaded Problem Sets**: Includes popular sheets like:
  - 🔥 Striver's SDE Sheet
  - ⚡ NeetCode 150
  - 📁 Love Babbar 450
- **Custom Problem Management**: Add your own topics, sub-topics, and questions with URLs
- **Status Workflow**: Seamlessly cycle through `Todo` → `Solved` → `Revision` states
- **Progress Visualization**: Beautiful animated progress bars that update in real-time
- **Drag & Drop Reordering**: Prioritize topics using intuitive drag-and-drop powered by `@dnd-kit`

### 🤖 **AI-Powered Assistant**
- **Integrated Gemini AI Chatbot**: Get instant help with:
  - Problem explanations and hints
  - Time/space complexity analysis
  - Algorithm concept clarification
  - Code review and optimization suggestions
- **Context-Aware**: Acts as a Senior SDE Mentor
- **Smart Responses**: Provides hints without spoiling solutions (unless requested)
- **Expandable Interface**: Full-screen mode for detailed discussions

### 🎨 **Modern Glassmorphism UI**
- **Stunning Visual Design**: 
  - Translucent glass-effect panels with blur effects
  - Ambient lighting animations
  - Smooth gradient transitions
  - Neon glow effects on interactive elements
- **Dark/Light Mode**: 
  - Seamless theme switching with persistent state
  - Dynamic background gradients
  - Optimized color schemes for both modes
- **Responsive Design**: 
  - Fully optimized for Desktop, Tablet, and Mobile
  - Collapsible sidebar on desktop
  - Mobile-friendly drawer navigation
  - Touch-optimized interactions

### 🎉 **Celebration & Gamification**
- **Confetti Celebrations**: Automatic confetti burst when you complete a topic
- **Visual Feedback**: Smooth animations and transitions throughout
- **Progress Milestones**: Track your achievements with detailed analytics

### 📊 **Advanced Analytics Dashboard**
- **Performance Metrics**:
  - Total problems solved
  - Difficulty-wise breakdown (Easy/Medium/Hard)
  - Progress percentage tracking
  - Visual statistics cards with gradient effects
- **Detailed Analytics View**: 
  - Weekly/Monthly tracking (UI ready for chart integration)
  - Problem distribution visualization
  - Completion rate monitoring

### 🛠️ **Productivity Tools**
- **Notes System**: 
  - Take markdown-formatted notes for each question
  - Expandable note editor
  - Persistent storage using LocalStorage
- **Bookmarking**: 
  - Mark challenging problems for quick access
  - Filter view to show only bookmarked items
- **Advanced Filtering**:
  - Filter by difficulty (Easy/Medium/Hard)
  - Search by problem name
  - Bookmark-only view
  - Combined filter support
- **Problem Descriptions**: Store and view problem statements directly in the app

### 💾 **Data Persistence**
- **Local Storage Integration**: All progress automatically saved
- **State Management**: Powered by Zustand with persist middleware
- **No Data Loss**: Your progress is safe even after browser refresh

---

## 🎨 UI/UX Highlights

### Design Philosophy
CodeMaster follows a **premium glassmorphism design language** with:
- Frosted glass effects with backdrop blur
- Subtle animations and micro-interactions
- Gradient accents and neon highlights
- Ambient lighting effects
- Smooth state transitions

### Color Palette
```css
Primary:   #6366f1 (Indigo)
Secondary: #a855f7 (Purple)
Accent:    #ec4899 (Pink)
Easy:      #34d399 (Emerald)
Medium:    #fbbf24 (Amber)
Hard:      #fb7185 (Rose)
```

### Typography
- **Display Font**: Space Grotesk (Headings)
- **Body Font**: Inter (Content)
- Optimized for readability with proper font weights and spacing

### Animations
- Smooth page transitions
- Hover effects on interactive elements
- Progress bar fill animations
- Confetti particle effects
- Shimmer effects on progress indicators
- Pulse animations on status indicators

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.2.4** - Latest React with concurrent features
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Lightning-fast build tool

### Styling
- **Tailwind CSS** (CDN) - Utility-first CSS framework
- **Custom CSS** - Glassmorphism effects and animations
- **Google Fonts** - Space Grotesk & Inter

### State Management
- **Zustand 5.0.11** - Lightweight state management
- **Persist Middleware** - LocalStorage integration

### AI Integration
- **Google GenAI SDK 1.40.0** - Gemini AI integration
- **Gemini 2.5 Flash Lite** - Fast, efficient AI responses

### UI Libraries
- **Lucide React 0.563.0** - Beautiful icon library
- **@dnd-kit** - Drag and drop functionality
  - `@dnd-kit/core` 6.1.0
  - `@dnd-kit/sortable` 8.0.0
  - `@dnd-kit/utilities` 3.2.2
- **canvas-confetti 1.9.2** - Celebration effects

### Utilities
- **UUID 13.0.0** - Unique ID generation

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/codemaster.git
   cd codemaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   ```
   
   > ⚠️ **Important**: Never commit your API key to version control!

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 📦 Deployment

### Deploying to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   
   In Vercel Project Settings → Environment Variables, add:
   - **Key**: `VITE_API_KEY`
   - **Value**: Your Gemini API Key
   - **Environment**: Production, Preview, Development

4. **Deploy**
   
   Click "Deploy" and wait for the build to complete!

### Deploying to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Set Environment Variables**
   
   In Netlify Site Settings → Environment Variables:
   - Add `VITE_API_KEY` with your Gemini API key

### Other Platforms

CodeMaster can be deployed to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

---

## 🎯 Usage Guide

### Getting Started with CodeMaster

1. **Choose a Problem Set**
   - Click on "Striver SDE Sheet", "NeetCode 150", or "Love Babbar 450" from the sidebar

2. **Track Your Progress**
   - Click on a topic to expand and view sub-topics
   - Click the status button to cycle: `Todo` → `Solved` → `Revision`
   - Use the checkbox for quick completion marking

3. **Add Custom Content**
   - Click the `+` button to add new topics
   - Add sub-topics within any topic
   - Add custom questions with URLs and descriptions

4. **Use the AI Assistant**
   - Click the floating chat button in the bottom-right
   - Ask questions about algorithms, data structures, or specific problems
   - Get hints, explanations, and code reviews

5. **Take Notes**
   - Click the note icon on any question
   - Write markdown-formatted notes
   - Notes are automatically saved

6. **Filter and Search**
   - Use the difficulty filter to focus on specific levels
   - Toggle bookmarks to view only marked problems
   - Use the search bar to find specific questions

7. **View Analytics**
   - Click "Performance" in the sidebar
   - View your progress statistics
   - Track completion rates by difficulty

### Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search (coming soon)
- `Ctrl/Cmd + B` - Toggle bookmark filter (coming soon)
- `Ctrl/Cmd + /` - Open AI assistant (coming soon)

---

## 🎨 Customization

### Adding Your Own Problem Sets

Edit `data.ts` to add custom problem sets:

```typescript
export const initialData: Topic[] = [
  {
    id: 'topic-custom',
    title: 'My Custom Topic',
    isExpanded: true,
    subTopics: [
      {
        id: 'sub-custom',
        title: 'Custom Sub-Topic',
        questions: [
          {
            id: 'q-custom',
            title: 'Custom Problem',
            url: 'https://leetcode.com/problems/...',
            difficulty: 'Medium',
            status: 'Todo',
            isBookmarked: false,
            description: 'Problem description here'
          }
        ]
      }
    ]
  }
];
```

### Customizing Colors

Edit the Tailwind config in `index.html`:

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
        // ... more colors
      }
    }
  }
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Maintain the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 Roadmap

### Upcoming Features

- [ ] Chart.js integration for detailed analytics
- [ ] Export progress as PDF/CSV
- [ ] Cloud sync with user accounts
- [ ] Collaborative study groups
- [ ] Spaced repetition algorithm
- [ ] Code snippet storage
- [ ] Video solution links
- [ ] Timer for practice sessions
- [ ] Streak tracking
- [ ] Achievement badges

---

## 🐛 Known Issues

- Chart visualization module not yet implemented (placeholder shown)
- Some TypeScript type definitions need refinement
- Mobile landscape mode needs optimization

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Striver** for the amazing SDE Sheet
- **NeetCode** for the curated 150 problems
- **Love Babbar** for the comprehensive 450 DSA problems
- **Google** for the Gemini AI API
- **Lucide** for the beautiful icon set
- **Tailwind CSS** for the utility-first framework

---

## 📧 Contact

**Developer**: [Your Name]  
**Email**: your.email@example.com  
**LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)  
**GitHub**: [@yourusername](https://github.com/yourusername)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**Made with ❤️ for Developers**

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=yourusername.codemaster)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/codemaster?style=social)](https://github.com/yourusername/codemaster/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/codemaster?style=social)](https://github.com/yourusername/codemaster/network/members)

</div>
