# Supabase Auth Setup for AuraSense Playground

## Steps

1. Go to your Supabase project dashboard.
2. Enable Email/Password and SSO (SAML/Google/Entra) authentication providers.
3. Set up redirect URLs for local and production environments:
   - `http://localhost:3000` (or your dev port)
   - Your deployed Vercel/Hostinger URL
4. Copy your Supabase `project URL` and `anon/public key`.
5. Add them to your `.env` files:
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
6. (Optional) Configure JWT claims for custom roles if needed.

## Reference
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [SSO Setup](https://supabase.com/docs/guides/auth/sso)
