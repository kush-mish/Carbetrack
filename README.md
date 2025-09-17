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

### UI

I have used [DaisyUI](https://daisyui.com/) frontend library to style the components with TailwindCSS.

### Firebase with Vue.js

I used [VueFire](https://vuefire.vuejs.org/) for its reactive and seamless integration with Vue's reactivity system and Firebase. Because of its realtime data bindings, we don't have to worry about syncing the UI with the database.

### Database

Firestore is used as the database. I have created 3 collections:

```
Firestore
├── projects (collection)
│   └── {projectId} (document)
│       ├── name
│       ├── totalEmissions
│       └── location
│       └── createdAt
├── materials (collection)
│   └── {materialId} (document)
│       ├── name
│       ├── emissionFactor
│       └── unit
└── emissions (collection)
    └── {emissionId} (document)
        ├── projectId
        ├── material
        ├── quantity
        ├── unit
        ├── emissionFactor
        ├── totalEmissions
        └── date
```

## Potential Bottlenecks & Security concerns

- **Aggregation**: `totalEmissions` is denormalized on the `projects` collection for fast dashboard queries, but this requires careful updates to avoid race conditions/stale data.
  I would prefer to update the `totalEmissions` value in the `projects` docs using Firestore triggers in the functions since the database choice is restricted to Firestore. Otherwises I would vouch for an SQL database so that we can directly perform joins to get the total emissions from all the emission logs.
- **Authentication & User Security**: Implement Firebase Authentication to require users to sign in before accessing the app. This allows associating data with specific users and restricting access.
- **Firestore Security Rules**: We should implement Firestore security rules to ensure users can only read and write their own data and rules like `request.auth != null` to require authentication.
- **Firestore Write/Read Limits**: Firestore has per-document and per-collection throughput limits. High-frequency logging or analytics on large collections (e.g., `emissions`) may hit these limits.
- **Indexing**: For complex queries we need to ensure proper Firestore indexes are created.
- **Client-Side Performance**: The projects list needs to be paginated to handle a larger number of projects. Same with the dropdown in the emissions logging form.
