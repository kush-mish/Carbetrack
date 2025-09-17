# Carbetrack

The project Carbon Emissions Tracker is hosted at https://carbetrack.web.app.

## Project Setup Instructions

1. **Clone the repository**

   ```sh
   git clone git@github.com:kush-mish/Carbetrack.git
   cd Carbetrack
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Development Server**

   ```sh
   npm run dev
   ```

   The app will be available at `http://localhost:5173` by default.

4. **Build for Production**

   ```sh
   npm run build
   ```

## Walkthrough

The app has 2 pages:

1. Dashboard
   It displays total emissions across all projects, and the 2 charts.
   This page also has a form that allows the users to log emissions by selecting project and the material causing the emissions. The form opens up in a drawer on the left.
2. Projects Management
   All the projects with basic details are listed in a table. New project can be created by the form through the Add new project button.
