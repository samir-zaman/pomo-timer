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

🔧 Next Steps
Implement remaining button functionality:
Dark mode
Full reset (migrate existing reset logic)
Add a confirmation popup when the user refreshes the browser
Improve heatmap tooltip clarity and readability
