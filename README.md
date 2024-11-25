# Aditya Mishra - Portfolio

This is the source code for Aditya Mishra's portfolio website. The site showcases skills, projects, and experiences, providing an interactive and visually appealing way to explore professional and personal achievements.

## Features

- **Netflix-Style Landing Page:** Dynamic animation and sound effects inspired by Netflix.
- **Profile Selection:** Choose different profiles (e.g., Recruiter, Developer) for tailored content.
- **Dynamic Skills Section:** Showcase expertise with an animated display of technologies.
- **Project Gallery:** Detailed cards with descriptions, technologies used, and images.
- **Interactive Work Experience Timeline:** View career and education history in a visually appealing format.
- **Music Integration:** Spotify playlists and tracks embedded for seamless playback.
- **Contact Page:** Reach out via email, phone, or LinkedIn with an elegant design.

## Technologies Used

- **Frontend:**
  - React (v18)
  - React Router DOM
  - React Icons
  - CSS3 (Custom animations and responsive design)

- **Tools & Libraries:**
  - Firebase Hosting (for deployment)
  - Spotify Embed API
  - React Vertical Timeline Component

## Setup and Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/aditya29mishra/my-protforlio.git
   cd my-protforlio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Locally**
   ```bash
   npm start
   ```
   The development server will be available at `http://localhost:3000`.

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Deploy on Firebase**
   Ensure Firebase CLI is installed and initialized for this project:
   ```bash
   firebase deploy
   ```

## Structure

```
my-protforlio/
│
├── src/
│   ├── components/        # Reusable components (Navbar, ProfileBanner, etc.)
│   ├── assets/            # Images, audio, and other static files
│   ├── App.js             # Application entry point
│   ├── index.js           # React DOM rendering
│   └── styles/            # CSS files for individual components
│
├── public/
│   ├── index.html         # Template for the website
│   └── favicon.ico        # Website icon
│
├── package.json           # Project dependencies and scripts
├── firebase.json          # Firebase configuration
├── README.md              # Project documentation
└── .gitignore             # Ignored files for version control
```

## Deployment URL

The portfolio is live at: [https://aditya29mishra.web.app/](https://aditya29mishra.web.app/)

## Contributions

This project is a personal portfolio and is not open for contributions at the moment.

## Contact

For queries, feel free to reach out:

- **Email:** adityarakeshmishra@gmail.com
- **LinkedIn:** [Aditya Mishra](https://linkedin.com/in/adityamishra29)

---

Thank you for visiting my portfolio!
```