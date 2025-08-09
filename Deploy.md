# Deploy Guide — AJ HVAC MVP v4

## What you’ll get after this
- Public booking site (prototype) calling your API
- API with two endpoints: `/checkout/deposit` (Square) and `/sms/send` (Twilio)

## 1) Deploy the API (Render)
1. Create a free account at Render.com
2. New + → **Web Service** → **Build from Docker** → upload this `server/` folder (or connect to a repo)
3. Add environment variables:
   - `SQUARE_ACCESS_TOKEN` = your **Sandbox** token
   - `SQUARE_LOCATION_ID` = your **Sandbox** location
   - `TWILIO_SID` / `TWILIO_TOKEN` / `TWILIO_FROM` (optional now)
   - `REDIRECT_URL` = where Square sends customers after deposit (can be any page)
4. Deploy → you’ll get a URL like `https://aj-hvac-api.onrender.com`

## 2) Point the app to your API
1. Open `prototype/config.js` and set:
   ```js
   window.AJ_API_BASE = 'https://YOUR-RENDER-URL';
   ```
2. Open `prototype/index.html` in your browser and test booking:
   - Fill form → **Confirm Booking** → should open Square payment link.

## 3) (Optional) Host the prototype
- Quick: Upload `prototype/` to Netlify or Vercel as a static site.
- Or open locally and “Add to Home Screen” to test as PWA.

## 4) Move to Production
- In Render, duplicate service → switch to **Production** Square credentials.
- Update `Environment.Production` in code if needed, or keep Checkout Links (works fine).

## Notes
- Don’t paste secrets into code or zip files. Use env vars only.
- You can lock service area & time windows in the UI or with server-side checks later.
