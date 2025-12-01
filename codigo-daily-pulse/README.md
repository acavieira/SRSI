# Base44 App


This app was created automatically by Base44.
It's a Vite+React app that communicates with the Base44 API.

## Running the app

```bash
npm install
npm run dev
```

## Building the app

```bash
npm run build
```

## Mock mode for local development

This project uses **Base44 SDK** for authentication and data access.
However, Base44 does not support `localhost` as a valid callback domain, which blocks normal authentication when running the app locally.

To make local development possible, a **mock client** has been implemented.

When mock mode is enabled:

* No requests are sent to `base44.app`
* Authentication is simulated
* A fake user is returned (`User.me()`, `getUser()`, etc.)
* `DailyEntry` requests work using in-memory mock data
* All API calls stay local

---

## How to enable mock mode

Create a file named `.env.local` in the root of the frontend project and add:

```bash
VITE_MOCK_AUTH=true
```

Then restart the dev server:

```bash
npm run dev
```

You should see this in the console:

```
[MOCK] Using mock Base44 client (no network calls)
```

This means mock mode is active and the app will run without Base44 authentication.

---
