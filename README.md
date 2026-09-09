# EV AutoGlass — Website

Plain static site: HTML, CSS, and vanilla JS. No build step, no framework.

## Fixing the Vercel 404

That error almost always means Vercel is serving from the wrong folder level
— i.e. it's looking for `index.html` in a parent folder, but this project's
`index.html` is one level down (e.g. inside `evautoglass-site/`).

**If you used the Vercel dashboard / GitHub import:**
Project → Settings → General → **Root Directory** — make sure it points to
the folder that directly contains `index.html`, not a parent folder that
contains that folder.

**If you used the CLI:**
`cd` into the folder that directly contains `index.html` before running:
```
vercel
vercel --prod
```
Don't run `vercel` from one directory above the site — that deploys the
wrong root and every page 404s.

After fixing the root, redeploy with `vercel --prod` (or trigger a new
deploy from the dashboard).

## Before going live

1. **Images** — see `images/SAVE_THESE_IMAGES.md`. Six generated photos need
   to be manually saved into `images/` (my sandbox couldn't fetch them
   directly due to network restrictions). The logo is already in place.
2. **Contact form** — `contact.html`'s form currently posts to a placeholder
   Formspree endpoint (`YOUR_FORM_ID`). To make it real:
   - Sign up free at formspree.io, create a form, and copy its form ID.
   - In `contact.html`, replace `YOUR_FORM_ID` in the `<form action="...">`
     attribute with your real ID.
   - Until you do this, the site will show an in-page message telling
     whoever tests it that the form isn't connected yet, instead of
     silently pretending a submission worked.
3. **Google Map** — `contact.html` has a placeholder map embed. Replace the
   iframe `src` with your real Google Maps embed code (Google Maps → Share
   → Embed a map).
4. **Google reviews link** — `reviews.html` and the homepage link out to a
   generic Google search. Replace with your actual Google Business Profile
   review link once you have one.

## Local preview

From this folder:
```
python3 -m http.server 8000
```
Then open http://localhost:8000
