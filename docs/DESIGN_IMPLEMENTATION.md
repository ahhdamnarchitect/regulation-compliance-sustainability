# Editorial-Tech Design Implementation

This document summarizes the design refresh applied to MSRD (editorial-tech spec). All existing features are unchanged; only visuals, layout, and responsiveness were updated.

## What Changed

- **Palette:** Teal accent (`#0D9488`), warm off-white background (`#FAFAF9`), ink text, muted grays, soft borders.
- **Typography:** Plus Jakarta Sans for headings, Inter for body (Google Fonts).
- **Header:** Glass-style nav (backdrop blur), simplified logout (text/ghost), single-row layout.
- **Footer:** Muted links, same structure.
- **Home:** Hero with gradient overlay; map and search in rounded cards with subtle shadow; filter pills with hover states.
- **Search results:** Updated filter sidebar and sheet (mobile); regulation cards with hover lift and “Source” (short for “View Source”); primary accent for CTAs.
- **Regulation detail:** Same content; “Source” button label; cards use new tokens.
- **Checkout:** Short CTA “Start free trial” with microcopy (“7 days free, then $X/mo or $X/yr”); sticky bottom CTA bar on mobile.
- **Modals:** Upgrade popup and login overlay restyled with card border and primary buttons.
- **Map:** Pin color updated to teal; popup text uses new foreground/muted.

## Hero Image

The hero uses `/green-city-solar-panels-header.jpg` in `public/`. The image is **"An aerial view of a city with solar panels"** by Karl Callwood ([Unsplash](https://unsplash.com/photos/an-aerial-view-of-a-city-with-solar-panels-lyl9jNP5SXk)), free under the [Unsplash License](https://unsplash.com/license). If the file is missing, the hero still shows a gradient background.

## Files Touched

- `src/index.css` – CSS variables, body, headings, safe-area utility
- `tailwind.config.ts` – editorial colors, earth aliases, fonts, shadow utilities
- `src/components/layout/Header.tsx`, `Footer.tsx`
- `src/pages/Index.tsx`, `SearchResults.tsx`, `RegulationDetail.tsx`, `Checkout.tsx`, `CheckoutSuccess.tsx`, `Dashboard.tsx`, `AccountSettings.tsx`, `ResetPassword.tsx`, `Login.tsx`, `Privacy.tsx`, `Terms.tsx`, `Disclaimer.tsx`, `About.tsx`
- `src/components/regulations/RegulationCard.tsx`, `FilterSidebar.tsx`
- `src/components/map/InteractiveMap.tsx`
- `src/components/auth/LoginOverlay.tsx`, `UpgradePopup.tsx`
- `src/components/search/SearchInputWithSuggestions.tsx`
- `src/components/TestCredentials.tsx`

## No Functional Changes

Map, search, filters, bookmarks, checkout (Stripe), login/register, upgrade popup, tier restrictions, and all routes behave as before.
