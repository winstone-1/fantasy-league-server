# Fantasy League Dashboard - Backend

A high-performance NoSQL backend built with **Node.js**, **Express**, and **MongoDB**. This server manages user authentication, league creation, and integrates with real-time sports APIs (Ball Don't Lie) to provide live player data.

---

## Features

* **User Auth:** Secure JWT-based authentication (Register/Login).
* **League Management:** Create, update, and manage fantasy leagues.
* **Real-time Player Search:** Integrated with **Ball Don't Lie API** for NBA and Soccer (EPL) data.
* **NoSQL Database:** MongoDB schema designed for flexible league rosters.
* **Normalized Data:** Consolidates data from multiple sports into a unified format for the React frontend.

---

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Auth:** JSON Web Tokens (JWT) & bcrypt.js
* **External API:** Ball Don't Lie (NBA/EPL)
* **HTTP Client:** Node-Fetch

---

## Project Structure

```text
fantasy-league-server/
├── src/
│   ├── config/          # Database & Environment configs
│   ├── controllers/     # Business logic for routes
│   ├── middleware/      # Auth & Error handling
│   ├── models/          # Mongoose Schemas (User, League, Player)
│   ├── routes/          # API Endpoint definitions
│   ├── services/        # External API integrations
│   └── index.js         # Entry point
├── .env                 # Environment variables (ignored)
└── package.json
```
## 1. Prerequisites
- Node.js v16+

- MongoDB Atlas Account

## 2. Installation
``` 
# Clone the repository
git clone <your-repo-link>

# Install dependencies
npm install
```
