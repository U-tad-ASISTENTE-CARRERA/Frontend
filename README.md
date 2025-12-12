# Asistente de Carrera Profesional - Frontend

This repository contains the frontend of the **Asistente de Carrera Profesional**, a tool designed to support students in planning their professional path by analyzing their academic progress and generating a personalized career roadmap.

The project was developed under the internal name **GPS Académico** as part of the Proyectos III course at U-tad university, following a Scrum-based workflow with periodic client meetings and team coordination through Jira.

> [!IMPORTANT]
> The branch used for **production** and for deployment on Vercel is `main`


## Prerequisites

> [!IMPORTANT]
> The backend must be running before starting the frontend

Backend repository:
[https://github.com/U-tad-ASISTENTE-CARRERA/Backend](https://github.com/U-tad-ASISTENTE-CARRERA/Backend)


## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/U-tad-ASISTENTE-CARRERA/Frontend.git
cd Frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at:
[http://localhost:3001](http://localhost:3001)


## User Roles and Interfaces

GPS Académico platform includes three user roles: student, professor, and administrator, each with its own interface adapted to its purpose.

> [!NOTE]
> * Students log in using `@live.u-tad.com` email addresses
> * Professors log in using `@u-tad.com` addresses
> * The administrator also uses an `@u-tad.com` address

### Student

This is the main interface of the system, currently focused on 3rd- and 4th-year Software Engineering students who are close to starting internships or entering the job market.

Features include:

* **Career roadmap**, defined based on the student’s desired career path and enriched with degree content and additional training added by the student
* Academic, language and work experience records
* Generation of a report that consolidates all this information

The platform is designed to expand to additional degrees in the future.

### Professor

This interface supports professors who have been selected as tutors by students.

Features include:

* Access to reports submitted by each student, containing their academic progress and professional roadmap
* A list of assigned students

### Administrator

The administrator has access to internal tools for platform maintenance, not visible to students or professors.


## Branch Workflow and Deployment

The project uses two main branches:

### `salis`

Development branch.
All active development takes place here.

### `main`

Production branch.
This branch receives stable changes from `salis` and is used for deployment.

Branch synchronization is handled through GitHub Actions.


### Deployment via Mirror Repository

To enable deployment on Vercel:

1. The `main` branch is automatically copied to a personal mirror repository through GitHub Actions.
2. Vercel pulls and deploys the frontend from that personal repository.

This approach was necessary because, during the development period, Vercel’s Hobby plan did not allow deploying directly from organization repositories. Using a personal mirror repository made deployment possible without requiring a Pro plan.


## Technologies used

### Frontend

* Next.js
* React
* JavaScript
* Tailwind CSS

### Backend *(separate repository)*

* Node.js

### Database

* Firebase Firestore

### Automation & Deployment

* GitHub Actions
* Vercel
