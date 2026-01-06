🍅 pomo-timer
A sleek Pomodoro-style productivity timer that tracks focused work time and visualizes progress through a dynamically scaled heatmap.

🚀 Features
Customizable Intervals: Set your own work and break durations.

Smart Cycling: Automatic transitions between work and break sessions.

User Accounts: Secure authentication via Firebase.

Dynamic Heatmap: Visualizes productivity using Cal-Heatmap.

Note: Unlike static trackers, our index values scale dynamically based on your specific data, ensuring the visualization is always meaningful regardless of your total hours.

🛠 Tech Stack
Frontend	Backend / Tools
React (Vite)	Firebase Auth
React Router	Firebase Realtime DB
Cal-Heatmap	JavaScript (ES6+)
CSS3 (Flexbox/Grid)	NPM
📊 How It Works
Session Tracking: Complete a work block to trigger a data sync.

Data Persistence: Sessions are pushed to Firebase Realtime Database under the user's unique ID.

Visualization: The heatmap fetches historical data and calculates a custom scale (min/max) to color-code your most productive days.

🧑‍💻 Getting Started
Prerequisites

Node.js (v16 or higher)

A Firebase Project

Installation

Bash
# Clone the repository
git clone https://github.com/your-username/pomo-timer.git

# Navigate into the project directory
cd pomo-timer

# Install dependencies
npm install

# Start the development server
npm run dev
🔐 Environment Variables
Create a .env file in the root directory. This project requires the following Firebase keys:

Code snippet
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_DATABASE_URL=your_db_url_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
Warning: Do not commit your .env file to version control.

🛣 Roadmap / Next Steps

[ ] Dark Mode: System-wide theme toggling.

[ ] Safety Nets: Add a confirmation popup when a user tries to refresh/close the tab during an active session.

[ ] UI/UX: Enhanced tooltip readability for the heatmap.

[ ] Global Reset: A "Clear All Data" option for user privacy.
