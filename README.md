# Hit the Note 🎶

**Hit the Note** is an engaging and fun game where players use their voice to match the notes of popular songs. Perfect for aspiring singers, music enthusiasts, or anyone looking to have a great time!

---

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building the Project](#building-the-project)
- [Generating Documentation](#generating-documentation)
- [Running the Project with Docker Compose](#running-the-project-with-docker-compose)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- 🎤 **Voice Recognition**: Sing and match notes in real-time.
- 🎵 **Popular Songs**: Play with a curated collection of your favorite tracks.
- 📊 **Score Tracking**: Compete with friends and aim for the high score.
- 🌟 **Interactive UI**: An immersive and user-friendly experience.

---

## Requirements
- Node.js v20+
- PHP 8.2+
- Composer
- SQLite 
- Docker
- Cypress
- Vite
- Vue
- Laravel

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/alkapone312/hit-the-note.git
   cd hit-the-note
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   composer install
   ```
3. Install application dependencies:
   ```bash
   cd ../app
   npm install
   ```

---

## Running the Application
### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the PHP development server:
   ```bash
   php artisan serve
   ```
   The backend server should now be running at `http://localhost:8000`.

### Application
1. Navigate to the `app` directory:
   ```bash
   cd ../app
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   The app server should now be running at `http://localhost:3000`.

---

## Building the Project
### Backend
```bash
cd backend
php artisan migrate --force
php artisan optimize
```

### Application
```bash
cd app
npm run build
```

---

## Generating Documentation
To generate project documentation, use the following commands:

1. **Backend Docs**:
   ```bash
   cd backend
   php artisan l5-swagger:generate # TODO
   ```

2. **Application Docs**:
   ```bash
   cd ../app
   npm run docs
   ```

---

## Running the Project with Docker Compose
Use Docker Compose for a fully containerized setup.

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
2. Access the application:
   - Backend: `http://localhost:8080`
   - Application: `http://localhost:3000`

3. Stop the containers:
   ```bash
   docker-compose down
   ```

---

## Contributing
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

Fill in the placeholders with your specific details. Happy coding! 🎉