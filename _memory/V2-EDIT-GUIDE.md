# V2 edit guide — Maximus Reach

This is for the new site in the `v2/` folder. Your live V1 site at the project root is untouched.

## Turn the site on (every time you come back)

1. Open a terminal in the project folder (`mcclure-realty-overhaul`).
2. Run these two commands, one at a time:
   ```
   cd v2
   npm run dev
   ```
3. Open the link it prints in your browser (usually `http://localhost:5174/`).
4. Leave that terminal window open while you preview. Press `Ctrl + C` in the terminal when you are done.

If it says packages are missing, run `npm install` inside the `v2` folder first, then `npm run dev` again.

## Design tuner (sliders to adjust the site yourself)

While the dev server is running, you will see a **Design tuner** panel on screen (top right area). This only appears in preview mode, not on the live site.

Use the folders to adjust things:

| Folder | What it controls |
|--------|------------------|
| Scroll window | How much the page shrinks, corner roundness, scroll length |
| Headline | The white text above the window ("The clearest view...") |
| Hero in window | Left side text opacity, padding, mouse movement strength |
| Nav | When the top bar moves to the right side during scroll |
| Dock | The pill tabs below the window (Growth, Web, Ads, Creative) |
| Panel | The stat text below the dock (+142%, etc.) |
| 3D scene | How much the 3D objects follow your mouse |

**Your changes save automatically** in the browser. Refresh the page and they stay.

When you like a setup:
1. Open the **Actions** folder in the tuner.
2. Click **Copy JSON**.
3. Paste it in chat and say "lock these values in."

**Reset:** Actions → Reset all.

**Important:** The tuner is removed before the site goes live. It is only for building.

## Change words visitors see

Open: `v2/src/content/siteContent.js`

Edit the text inside the quotes. Save. The browser refreshes automatically.

## Change colors and fonts

Open: `v2/src/styles/tokens.css`

## 21st.dev (UI catalog)

21st.dev is connected in Cursor. You do not use it directly in the browser. You tell me what you want and I search their catalog.

**How to ask me to use it:**
- "Search 21st for a glass pill navigation"
- "Find a scroll hero like Superpower on 21st"
- "Pull the code for that dock component from 21st"

I search, show you previews, and adapt the best match to your brand. Searching is free. Pulling full component code uses a daily quota on free accounts.

## Page animation references (V2)

| Page / section | Reference | Effect |
|----------------|-----------|--------|
| Home hero | Koi Fish layout + Shopify 3D | Glass objects, bottom left copy, cursor parallax |
| Home scroll | Superpower landing | Real page shrinks into a window on dark background |
| Home contact | V1 contact cards | Glass cards, centered intro |
| Home work teaser | V1 work teaser | Right aligned Z pattern grid |

## What not to edit unless you know what you are doing

- Files in `v2/src/scene/` — 3D objects and lighting
- Files in `v2/src/lib/` — performance and scroll sync
- `package.json` — installed tools

For copy and layout changes beyond the tuner, ask in chat.

## Deploying later

V2 is separate from V1. Nothing goes live until you say so.
