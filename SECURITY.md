# Security Guidelines

## Environment Variables

This project uses **Vite** to handle environment variables for the front end.

1. **Local Development**: Create a `.env` file at the root of the project by copying the `.env.example` file.
2. **Public Variables**: Any environment variable prefixed with `VITE_` (e.g., `VITE_FIREBASE_API_KEY`) will be bundled into the client-side JavaScript by Vite. This is required for Firebase to initialize on the client side.
3. **Secret Variables**: Environment variables without the `VITE_` prefix will NOT be included in the build. Use these for strictly server-side secrets (like Service Account JSONs, Stripe Secret Keys, or JWT Secrets) if you ever add a backend or serverless functions to this project.

## Restricting Google API Keys

Even though Firebase keys are exposed to the client (which is normal for Firebase), you must protect them from unauthorized use on other domains to prevent quota theft.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project (`pjr-fashion`).
3. Navigate to **APIs & Services > Credentials**.
4. Click on the auto-created API Key for Firebase.
5. Under **Application restrictions**, select **HTTP referrers (web sites)**.
6. Add your production domain (e.g., `https://your-domain.com/*`).
7. Also add your local development domain (e.g., `http://localhost:5173/*` for Vite).
8. Save the changes.

## Deployment Instructions

When deploying this static application to providers like Firebase Hosting, Vercel, Netlify, or GitHub Pages:

1. **Do not upload the `.env` file.**
2. Go to your hosting provider's dashboard and configure the Environment Variables there.
3. Add all the `VITE_FIREBASE_*` variables with their corresponding values.
4. Run the build command: `npm run build`. The hosting provider will automatically inject these variables into the static bundle during the build phase.
5. The generated files in the `/dist` directory are safe to be served publicly.
