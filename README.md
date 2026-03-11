# CK Wall — Confidential Kitchen Photo Doodle Wall

## What it does

1. Guest scans QR code → sees "Upload photo" button
2. Guest takes/uploads a photo → it goes to Cloudinary
3. Guest gets shown a random previous guest's photo
4. Guest doodles on it with their finger → submits
5. Doodled photo floats onto a live gallery wall

## Screens

- **/** — Upload + doodle flow (for guests on their phones)
- **/#wall** — Gallery wall display (for a laptop/iPad at the venue)

## Deploy to Render (free)

1. Push this folder to a GitHub repo
2. Go to render.com → New → Web Service
3. Connect your repo
4. Settings:
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables (optional, already has defaults):
     - `CLOUD_NAME` = ddmguyzb7
     - `UPLOAD_PRESET` = Confidential Kitchen
5. Deploy

Your app will be live at `something.onrender.com`.

## Deploy to Railway (free)

1. Push to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. It auto-detects Node.js and deploys
4. Add a domain in settings

## QR Code

Point your QR code at the root URL (e.g. `https://your-app.onrender.com`).

Open `https://your-app.onrender.com/#wall` on a laptop/iPad at the venue for the live gallery.

## Notes

- Gallery is stored in memory — it resets if the server restarts
- This is fine for a single event
- Cloudinary free tier: 25GB storage, 25GB bandwidth/month
- All original photos also saved to Cloudinary under `ck-guest-uploads/`
