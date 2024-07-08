
## Description

This is a simple backend developed mainly for study purposes, focused on JWT Authentication, refresh tokens, password cryptography, user roles and protected API routes.

### Features
- Users can signUp 
- Users can signIn
- Everyone can access the public API route (feature/public)
- Only authenticated users can access private API routes (feature/private)
- Only authenticated users with the **admin** role can access the protected API route (feature/admin)

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```