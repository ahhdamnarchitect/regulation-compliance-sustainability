# Auth security checklist

This document describes how to keep auth (sign-in, password reset, email change) secure using Supabase and this app.

---

## 1. Short expiry for recovery links

**Goal:** Password reset and magic links expire quickly so a stolen link is less useful.

**Where:** Supabase Dashboard → **Authentication** → **Providers** → **Email** (or **Settings** → Auth).

**What to set:**

- **Email OTP expiration** (or equivalent “recovery / magic link expiry”): **3600** seconds (**1 hour**).
- Supabase’s default is often 1 hour; do not increase it beyond what you need (max allowed is 24 hours).

**Why:** Limits the time window in which a leaked reset link can be used.

---

## 2. One-time use (no change needed)

**Goal:** Each recovery link works only once.

**What Supabase does:** Recovery links (password reset, magic link) are **one-time use by default**. After the user completes the action (e.g. sets a new password), the link is invalid. Reusing it returns an error like “Email link is invalid or has expired.”

**Action:** No configuration or code change required. Avoid turning off or relaxing this behavior.

---

## 3. Redirect URL allowlist

**Goal:** Auth redirects (e.g. after password reset) only go to your real app, not an attacker’s site.

**Where:** Supabase Dashboard → **Authentication** → **URL Configuration** → **Redirect URLs**.

**What to add (and only these):**

- **Production:** Your live app URL(s), e.g.  
  `https://regulation-compliance-sustainabilit.vercel.app`  
  `https://regulation-compliance-sustainabilit.vercel.app/reset-password`
- **Local dev (optional):**  
  `http://localhost:5173`  
  `http://localhost:5173/reset-password`  
  (or your dev port, e.g. `3000`)

**Do not add:** Unknown or third-party domains. Remove any URLs you no longer use.

**Why:** Ensures Supabase only redirects users to URLs you control.

---

## 4. HTTPS only in production

**Goal:** Auth links and tokens are never sent over plain HTTP in production.

**What this app does:** In production builds, if the user loads the site over `http://`, the app redirects to the same URL with `https://`. (See `src/main.tsx`.)

**What you should do:**

- Deploy production to a host that serves over HTTPS (e.g. Vercel, Netlify). They do this by default.
- In Supabase **Site URL** and **Redirect URLs**, use `https://` for production URLs, never `http://`.

**Why:** Prevents tokens and links from being sent in cleartext on the network.

---

## Summary

| Item              | Where / how                                      | Action                                      |
|-------------------|---------------------------------------------------|---------------------------------------------|
| Short expiry      | Auth → Providers → Email (or Auth settings)      | Set recovery/OTP expiry to 1 hour (3600 s)  |
| One-time use      | Supabase default                                 | None; leave as-is                           |
| Redirect allowlist| Auth → URL Configuration → Redirect URLs         | Only add your real app + localhost URLs     |
| HTTPS in prod     | App code + deployment                            | App redirects http→https; use HTTPS in Supabase |
