# JWT and OAuth Backend

This repository contains a backend implementation that demonstrates how to use JWT (JSON Web Tokens) for authentication and integrate OAuth authentication. This is an API for [Frontend Repository](https://github.com/efkdk/jwt-and-oauth-frontend).

## Features

- JWT-based authentication for secure API access.
- OAuth integration for Google or other third-party services.
- TypeScript implementation for strong typing and modern JavaScript features.
- Dockerized environment for easy setup and deployment.

## Setup

### Prerequisites

- Node.js
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/efkdk/jwt-and-oauth-backend.git
   cd jwt-and-oauth-backend
   
2. Install dependencies:
   ```bash
    npm install
   
### Set up environment variables (.env):

### MongoDB Configuration

- **DB_URI** - Your mongodb access.

*You can find information about how to start with mongodb [here](https://www.w3schools.com/mongodb/mongodb_get_started.php)* 

### Auth Configuration

- **JWT_SECRET**: Secret key for signing JWTs.

*It's recommended to use different secrets for various tokens (e.g., JWT_ACCESS_SECRET for the access token, JWT_REFRESH_SECRET for the refresh token) instead of using one secret for all.*
- **COOKIE_PARSER_SECRET**: Secret key for the cookie parser.
- **API_URL**: URL of your API.
- **CLIENT_URL** : URL of your client application.
- **OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET**: OAuth credentials (as described in the [Frontend JWT and OAuth Repository](https://github.com/efkdk/jwt-and-oauth-frontend)).
  
### SMTP Configuration

For sending verification emails, you'll need to configure the following SMTP settings:

- **SMTP_HOST**
- **SMTP_PORT**
- **SMTP_USER**
- **SMTP_PASSWORD**

### Running the Application
You can run the application in development mode using:

   ```bash
   npm run dev
   ```
Alternatively, build and run it with Docker:

  ```bash
  docker build -t jwt-oauth-backend .
  docker run -p 5000:5000 jwt-oauth-backend
  ```
