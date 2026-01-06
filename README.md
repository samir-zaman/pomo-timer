🍅 pomo-timer
A Pomodoro-style productivity timer that tracks focused work time and visualizes it using a dynamically scaled heatmap.
🚀 Features
Customizable work and break session lengths
Automatic session cycling (work → break → work)
User authentication
Persistent tracking of work time
Dynamic heatmap visualization using Cal-Heatmap, where index values automatically scale based on each user’s logged work time (not hardcoded), ensuring accurate and personalized data representation
🛠 Tech Stack
React
Vite
React Router
Firebase
Authentication
Realtime Database
Cal-Heatmap
HTML / CSS / JavaScript
📊 How It Works
After logging in, users can start Pomodoro sessions by selecting their preferred work and break durations.
Completed work sessions are saved to Firebase and displayed on a heatmap, allowing users to visually track productivity over time.
🧑‍💻 Getting Started (Local Setup)
# Clone the repository
git clone https://github.com/your-username/pomo-timer.git

# Navigate into the project directory
cd pomo-timer

# Install dependencies
npm install

# Start the development server
npm run dev
Once running, open the local URL shown in the terminal (usually http://localhost:5173).
🔐 Environment Variables
This project uses Firebase. Create a .env file in the root directory and add your Firebase configuration values:
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_DATABASE_URL=your_db_url_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
Note: Never commit your .env file to GitHub. Make sure .env is listed in .gitignore.
🔧 Next Steps
Implement remaining button functionality:
Dark mode
Full reset (migrate existing reset logic)
Add a confirmation popup when the user refreshes the browser
Improve heatmap tooltip clarity and readability
