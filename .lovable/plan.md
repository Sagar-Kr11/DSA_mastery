## Goal
Connect Google Search Console (GSC) so `https://pattern-quest-guide.lovable.app` can be verified, submitted, and monitored for SEO.

## Steps

1. **Link the Google Search Console connector**
   - Use the standard connector flow to authorize your Google account. This grants the app read access to your GSC properties and the ability to add/verify new sites.

2. **Verify the site with Google (META tag method)**
   - Request a `META` verification token from Google for `https://pattern-quest-guide.lovable.app/`.
   - Add the `<meta name="google-site-verification" content="..." />` tag to the root route head in `src/routes/__root.tsx` so it renders on every page.
   - After you publish the update, call Google's verify endpoint to confirm ownership.

3. **Register the site as a Search Console property**
   - Once verified, add `https://pattern-quest-guide.lovable.app/` to your Search Console properties via the API so it appears in your GSC dashboard.

4. **Submit the sitemap**
   - Submit `https://pattern-quest-guide.lovable.app/sitemap.xml` (already generated) to GSC so Google starts crawling all topic and pattern pages.

5. **Confirm and mark the SEO finding fixed**
   - After verification succeeds, mark the outstanding "Google Search Console" SEO finding as fixed.

## What you'll need to do
- Approve this plan.
- When prompted, sign in with the Google account you want tied to Search Console.
- After I add the verification meta tag, click **Publish → Update** so the new tag goes live before I run the verify step (Google fetches the live URL).

## Technical notes
- Verification tag lives in `src/routes/__root.tsx` `head()` — persists across all routes.
- API calls go through the Lovable connector gateway (`/google_search_console/...`); no keys stored in code.
- Only the META method is supported here (DNS/file upload aren't options for a Lovable-hosted app).
