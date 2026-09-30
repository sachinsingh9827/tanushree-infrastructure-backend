# Tanushree Infrastructure Backend

REST API and content management backend for Tanushree Infrastructure, built with Node.js, Express, and MongoDB.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set the MongoDB URI and JWT secrets in `.env`. Configure Cloudinary and SMTP values if those services are needed. The development server uses port `5000` by default.

## Commands

```bash
npm start       # start the API
npm run seed    # seed the database
npm run build   # check server syntax
npm test        # run tests
```

The seed command creates the initial admin account from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. Keep those values private.
