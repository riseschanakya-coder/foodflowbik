# FoodFlow

A polished Zomato-inspired React Native + Expo food delivery app.

## Features

- Location and search experience
- Food categories and restaurant discovery
- Restaurant menus and add-to-cart controls
- Persistent in-session cart state
- Favorites and profile screens
- Checkout confirmation

## Run

```sh
npm install
npm start
```

Use Expo Go or an emulator to open the app.

## Google authentication

1. Create a Google OAuth 2.0 Web application in Google Cloud Console.
2. Add `http://localhost:8081` and `foodflow://` (plus the Expo-generated redirect URI) to Authorized JavaScript origins / redirect URIs.
3. Copy `.env.example` to `.env` and add the Web Client ID, Client Secret, and a random JWT secret.
4. Start the authentication backend:
   ```sh
   npm run server
   ```
5. Start Expo in another terminal:
   ```sh
   npm start
   ```

The backend verifies Google's ID token and issues a short-lived FoodFlow session JWT. Never place `GOOGLE_CLIENT_SECRET` or `JWT_SECRET` in an `EXPO_PUBLIC_*` variable.

## Scripts

- `npm start` – start Expo
- `npm run android` – open Android
- `npm run ios` – open iOS
- `npm run web` – open web
- `npm run typecheck` – run TypeScript checks
