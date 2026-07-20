# Backend Setup Checklist

This project now expects Supabase to be the primary backend for auth, resources, pending uploads, deadlines, orders, contributors, and profile persistence.

## Manual Steps You Must Do

1. Create a Supabase project.
2. Open the SQL editor and run `supabase/schema.sql`.
3. Put the real keys in `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In Supabase Auth:
   enable Email/Password
   enable Google if you want Google sign-in
   add your local URL and deployed URL to redirect/site URLs
5. Create these Storage buckets manually:
   `resource-files`
   `order-attachments`
6. Make at least one real admin/writer account, then manually update its `profiles.role` to `admin` or `writer`.
7. Clear old browser mock state once backend is ready:
   remove localStorage keys starting with `tsec_`
8. Replace the fake checkout with a real gateway before production:
   recommended: Razorpay or Stripe
   also add webhook handling in a later pass

## What The Current Code Now Persists To Supabase

- Profile edits
- Reviews
- Comments
- Order creation
- Linked order deadlines
- Resource sync after download/admin approval flows
- Pending uploads sync
- Contributors sync

## Important Remaining Manual/Product Decisions

- Decide whether anonymous users should be allowed to upload/comment/review.
  Current schema is safer for authenticated users; pure guest writes are not recommended.
- Decide the real moderation flow for admin approvals.
  The UI already has approve/reject controls, but production role rules should be tightened later.
- Decide file upload storage paths and naming rules.
- Decide payment status lifecycle:
  `Pending` -> `In Progress` -> `Under Review` -> `Delivered`
- Decide whether rewards/coins are real product features or only demo gamification.

## Recommended Next Backend Pass

1. Move admin-only mutations behind Next.js route handlers.
2. Move comments/reviews into separate tables instead of JSON arrays.
3. Replace fake AI widgets with real APIs.
4. Replace default seeded/demo user behavior with proper guest state.
