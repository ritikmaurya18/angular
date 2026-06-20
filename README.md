# TODO App

A complete TODO management application built with Angular 17+ (standalone components), TypeScript, and Tailwind CSS.

## Features

- **TODO CRUD**: Create, read, update, delete todos with title, description, priority, due date, category, and status
- **LocalStorage Persistence**: All data persists in localStorage
- **Authentication**: Simple login flow with route guards
- **Dashboard**: Stats cards, recent todos, quick-add form
- **Filtering & Sorting**: Filter by status, priority, category, search; sort by date, priority, title
- **Pagination**: 10 items per page
- **Category Management**: CRUD for categories with color coding
- **Profile Page**: App info, environment variables, reset data, logout
- **Responsive Design**: Works on desktop and mobile

## Demo Credentials

- **Email**: `admin@example.com`
- **Password**: `password123`

## Setup

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build --configuration production
```

## Environment Variables

### Angular Environment Files (`src/environments/`)

| Variable | Key | Default (Dev) | Default (Prod) |
|----------|-----|---------------|----------------|
| API Base URL | `apiBaseUrl` | `http://localhost:3000/api` | `https://api.example.com/api` |
| App Name | `appName` | `TODO App` | `TODO App` |
| App Version | `appVersion` | `1.0.0-dev` | `1.0.0` |
| Enable Analytics | `enableAnalytics` | `true` | `false` |
| Max Todo Items | `maxTodoItems` | `100` | `500` |

### `.env` File (build-time)

| Variable | Description |
|----------|-------------|
| `NG_APP_API_URL` | API base URL |
| `NG_APP_APP_NAME` | Application name |
| `NG_APP_VERSION` | Application version |
| `NG_APP_ANALYTICS` | Enable/disable analytics logging |
| `NG_APP_MAX_TODOS` | Maximum number of todos |

## Project Structure

```
src/
  app/
    guards/           # Route guards (auth)
    services/         # Business logic services
    components/       # Reusable UI components
    pages/            # Route-level page components
    models/           # TypeScript interfaces
    interceptors/     # HTTP interceptors
  environments/       # Environment configurations
```

## Tech Stack

- Angular 17+ (standalone components)
- TypeScript (strict mode)
- Tailwind CSS
- Angular Router
- Angular HttpClient with interceptors
- RxJS BehaviorSubjects for state management
- Angular DatePipe

## localStorage Keys

- `todo_app_data` — Array of todo items
- `todo_categories` — Array of categories
- `auth_token` — Authentication token
- `auth_user` — Current user info
