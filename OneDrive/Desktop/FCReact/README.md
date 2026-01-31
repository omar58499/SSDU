# Fact Checker (React Native + Expo)

A simple fact-checking app with:
- Home: public news feed
- Verify Queries: submit a claim for verification
- My Queries: view status of submitted claims
- My Account: login/register
- Admin: Check Queries + publish articles when marking false

## Firebase setup

1. Create a Firebase project.
2. Enable **Authentication → Email/Password**.
3. Create **Firestore** database.
4. Replace the placeholder config in [lib/firebase.ts](lib/firebase.ts) with your Firebase config.
5. Update admin emails list in [context/AuthContext.tsx](context/AuthContext.tsx).

### Firestore data
Collections used:
- `users` → { email, role, createdAt }
- `queries` → { userId, text, status, createdAt, resolvedAt, articleId }
- `news` → { title, summary, url?, createdAt, createdByAdmin }

## Run the app

- Android: npm run android
- iOS (macOS): npm run ios
- Web: npm run web

## Notes

- The Home screen is public.
- Verify Queries and My Queries require login.
- Admin users see **Check Queries** instead of **My Queries**.
