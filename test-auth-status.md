# Testing Authentication Status

## Debug Steps:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Try to access the profile page:**
   - Go to http://localhost:3000/users/profil (or /users/settings)
   
3. **Check the terminal/console output** for the debug logs:
   - Look for "=== User Route Debug ===" 
   - Check if "Has session: true" or "Has session: false"
   - Check what "Session role:" shows

4. **Common Issues:**

   **If "Has session: false"**:
   - You're not logged in
   - Solution: Log in first at /auth/signin

   **If "Session role:" is NOT "customer"**:
   - Your account might have a different role (e.g., "driver" or "Driver")
   - Check your user account in the database
   
   **If "Session role:" is empty or undefined**:
   - The JWT token doesn't include the role claim
   - Check the authentication flow when logging in

## Quick Test - Check Your Cookies:

Open Browser DevTools (F12) → Application/Storage → Cookies → http://localhost:3000

Look for: `next-auth.session-token`
- If it exists: You have a session
- If it doesn't exist: You need to log in

## To See Your Full Session:

Add this temporary component to test:

```tsx
// app/[locale]/(site)/test-session/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function TestSessionPage() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
```

Visit: http://localhost:3000/test-session
