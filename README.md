# CodeMaster 🚀

**The Ultimate Interactive SDE Preparation Tracker**

CodeMaster is a premium, aesthetically crafted DSA (Data Structures & Algorithms) tracking application designed to streamline your coding interview preparation. Featuring a stunning glassmorphism UI, integrated AI assistance, and robust progress tracking, it transforms the grind of LeetCode/GFG into an engaging experience.

[**🔗 Live Demo**](YOUR_DEPLOYMENT_LINK_HERE)

## ✨ Key Features

### 🧠 Smart Tracking & Organization
*   **Curated Problem Sets:** Pre-loaded with popular sheets like Striver's SDE Sheet, NeetCode 150, and Love Babbar 450.
*   **Progress Visualization:** Smooth, animated progress bars for every topic and sub-topic that fill dynamically as you solve problems.
*   **Status Workflow:** Cycle through `Todo` → `Solved` → `Revision` states with visual indicators.
*   **Drag & Drop:** Reorder topics to prioritize your learning path using `dnd-kit`.
*   **CRUD Functionality:** Add your own topics, sub-topics, and custom questions (with URLs).

### 🤖 AI-Powered Assistant
*   **Integrated ChatBot:** Built-in Gemini AI assistant to help explain concepts, analyze time complexity, or provide hints without giving away the direct code unless asked.
*   **Context Aware:** specifically prompted to act as a Senior SDE Mentor.

### 🎨 Modern UI/UX
*   **Glassmorphism Design:** A beautiful, translucent interface with ambient lighting effects and blurred backdrops.
*   **Dark/Light Mode:** Seamless theme switching with persistent state and dynamic background gradients.
*   **Retractable Sidebar:** Maximize your workspace with a collapsible navigation menu on desktop.
*   **Confetti Celebrations:** Get rewarded with a festive confetti burst whenever you complete a topic!
*   **Responsive:** Fully optimized for Desktop, Tablet, and Mobile devices.

### 🛠 Productivity Tools
*   **Notes System:** Take and save markdown notes for every question (persisted locally).
*   **Bookmarking:** Mark tricky problems for later review.
*   **Advanced Filtering:** Filter by Difficulty (Easy/Medium/Hard), Bookmarks, or Search by name.
*   **Local Persistence:** All your progress is saved automatically using `Zustand` & `LocalStorage`.

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Vite
*   **Styling:** Tailwind CSS (Custom Config & Animations)
*   **State Management:** Zustand (with Persist middleware)
*   **AI:** Google GenAI SDK (Gemini 3 Pro)
*   **Icons:** Lucide React
*   **Interactions:** @dnd-kit (Drag & Drop), canvas-confetti

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/codemaster.git
    cd codemaster
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📦 Deployment

### Deploying to Vercel

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  **Crucial Step:** In the Vercel Project Settings > Environment Variables, add:
    *   **Key:** `VITE_API_KEY`
    *   **Value:** `Your Actual Gemini API Key`
4.  Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with ❤️ for Developers*