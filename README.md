# Angular Practice

A small Angular proof-of-concept focused on authentication flow, NgRx state management, lazy-loaded feature modules, and guards. It runs fully in **demo mode** without a backend.

## Features

- **Sign in / Sign up** with reactive forms and validation
- **Mock authentication** (localStorage) for local development
- **Protected routes** with `CanActivate` / `CanLoad` guards
- **HTTP interceptor** ready for a real API (`Authorization: Bearer`)
- **NgRx store** for auth, UI loading, and items
- **Session restore** on page refresh (`token` + `user`)
- **404 page** for unknown URLs (with contextual navigation)
- **Unit tests** for auth reducer, guard, and auth service

## Tech stack

- Angular 13
- NgRx Store
- RxJS
- Bootstrap 5
- SweetAlert2
- Jasmine + Karma

## Prerequisites

- **Node.js 16 or 18** (recommended for Angular 13)
- **npm**

Tests are configured to use **Microsoft Edge** in headless mode if Chrome is not installed.

## Getting started

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

### Build

```bash
npm run build
```

### Tests

Watch mode:

```bash
npm test
```

Single run (headless):

```bash
npm run test:ci
```

## Demo credentials

| Field    | Value  |
|----------|--------|
| Username | `demo` |
| Password | `demo` |

You can also **register a new account** on `/sign-up`. Users are stored in the browser under `mock-users` and can sign in afterward.

## Routing

| Route       | Access              | Description                          |
|-------------|---------------------|--------------------------------------|
| `/`         | Public              | Redirects to `/home` or `/sign-in`   |
| `/sign-in`  | Public              | Login form                           |
| `/sign-up`  | Public              | Registration form                    |
| `/home`     | Authenticated only  | User profile and items list          |
| `/**`       | Public              | 404 page                             |

## Mock auth

In development (`environment.ts`), `useMockAuth: true` avoids HTTP calls to the API.

- Login and registration are simulated with a short delay
- Session data is stored in `localStorage` (`token`, `user`)
- Registered users are persisted in `mock-users`
- Invalid sessions (e.g. `token` without `user`) trigger logout

To use a real backend, set `useMockAuth: false` in `environment.prod.ts` and run the API at:

```
http://localhost:5000/api/authentication
```

**API contract for backend implementers:** see [docs/api-auth.md](docs/api-auth.md).

## Project structure

```
src/app/
├── guards/           # Route guards (auth, root redirect)
├── interceptors/     # HTTP auth interceptor
├── pages/
│   ├── auth/         # Sign in, sign up, auth service
│   ├── home/         # Dashboard, profile, items
│   └── not-found/    # 404 page
├── shared/           # Navbar, UI NgRx slice
├── models/           # User model
└── app.reducer.ts    # Root NgRx state
```

## Scripts

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm start`     | Dev server                     |
| `npm run build` | Production build               |
| `npm test`      | Unit tests (watch)             |
| `npm run test:ci` | Unit tests (single run)      |

## Notes

- Profile avatar is generated from the username via [ui-avatars.com](https://ui-avatars.com)
- Passwords in mock mode are stored in plain text in `localStorage` (PoC only)
- This project was originally created with Angular CLI 13.3.1
