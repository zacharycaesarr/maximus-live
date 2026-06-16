# McClure Realty Visual Overhaul — Installation Guide

## Files in This Project

| File | What it does | Where it goes |
|------|-------------|---------------|
| `overhaul.css` | Full site visual overhaul — fonts, colors, typography, layout | WPCode Lite (CSS Snippet) |
| `click-to-call-section.html` | Contact bar + lead conversion section with click-to-call | Elementor HTML Widget |

---

## STEP 0 — Create a Staging Site First (Important)

Before touching anything live:

1. Go to **WP Staging** in the sidebar
2. Click **Create new staging site**
3. Do all work on the staging site first
4. Push to live only when you're happy with results

---

## STEP 1 — Install the CSS Overhaul

### Via WPCode Lite (Recommended)

1. In WordPress admin sidebar, go to **Code Snippets → + Add Snippet**
2. Click **"Add Your Custom Code (New Snippet)"**
3. Give it a name: `McClure Realty Visual Overhaul`
4. In the dropdown next to the code box, select **"CSS Snippet"**
5. Open `overhaul.css` from this folder, **select all (Ctrl+A)**, copy it
6. Paste it into the code box
7. Under "Insertion", make sure **"Site Wide Header"** is selected
8. Toggle it **Active**
9. Click **Save Snippet**

### Alternative: via Elementor

1. Elementor → Site Settings → Custom CSS
2. Paste the contents of `overhaul.css` there

---

## STEP 2 — Set the Fonts in Elementor

The CSS imports the fonts automatically, but for best results also set them in Elementor:

1. Go to **Elementor → Site Settings → Global Fonts**
2. Click **"Primary"** font → search for **"Playfair Display"** → select it
3. Set weight to **600**
4. Click **"Secondary"** font → search for **"Inter"** → select it
5. Set weight to **400**
6. Save and update

---

## STEP 3 — Set the Colors in Elementor

1. Go to **Elementor → Site Settings → Global Colors**
2. Update or add these colors:

| Name | Hex |
|------|-----|
| Primary | `#3B5E4F` |
| Secondary | `#C4A87A` |
| Text | `#1C1C1C` |
| Accent | `#EBF0EB` |
| Background | `#FAF7F2` |

---

## STEP 4 — Add the Contact / Lead Section

For the click-to-call bar and lead conversion section:

1. In Elementor editor, go to the page you want to add it to
2. Add a new **Section** where you want the contact block
3. Inside that section, drag in an **HTML widget**
4. Open `click-to-call-section.html` from this folder
5. Select all and copy it
6. Paste it into the HTML widget's code area
7. **Important:** Update these placeholders in the HTML:
   - `tel:5404305788` → her actual phone number
   - `katie@mcclurerealtyva.com` → her actual email
   - Office hours if different
8. Save and update

**For the form:** Replace the placeholder `<form>` tag in the HTML with either:
- A WPForms shortcode: `[wpforms id="YOUR_FORM_ID"]`
- A Contact Form 7 shortcode: `[contact-form-7 id="YOUR_ID"]`
- Or use Elementor's built-in Form widget in an adjacent column instead

---

## STEP 5 — Mobile Check

After applying everything:

1. In Elementor, use the **Responsive Mode** (bottom toolbar) to check mobile/tablet
2. Look for any text that's too large or columns that aren't stacking
3. The CSS handles most of it automatically, but verify visually

---

## STEP 6 — Things to Tweak Per-Section

Some Elementor sections may need manual adjustments after the CSS is applied:

- **Section backgrounds:** If alternating colors look wrong on a specific section, go into that section's Style tab and set a background color explicitly — it will override the CSS.
- **Button colors:** Go to each button widget → Style tab → set the button type to "Info" for green fill or "Default" for ghost/outline.
- **Heading sizes:** If any heading feels too large/small, override it directly in the widget's Style tab.

---

## Color Reference

| Token | Hex | Use |
|-------|-----|-----|
| `--mc-green` | `#3B5E4F` | Primary color, buttons, links, header |
| `--mc-green-pale` | `#EBF0EB` | Section backgrounds, icon bg |
| `--mc-cream` | `#FAF7F2` | Main page background |
| `--mc-tan` | `#C4A87A` | Accent, highlights, hover |
| `--mc-text` | `#1C1C1C` | Headings, strong text |
| `--mc-muted` | `#5A5A5A` | Body paragraphs |
| `--mc-border` | `#DDD7CC` | Borders, dividers |

To change the color scheme globally: edit the `:root { }` block at the top of `overhaul.css`.

---

## Utility Classes

Add these to any Elementor widget's **"CSS Classes"** field (Advanced tab):

| Class | Effect |
|-------|--------|
| `mc-accent-line` | Adds a tan underline accent below element |
| `mc-badge` | Small green pill badge |
| `mc-highlight` | Tan/gold colored text |
| `mc-card` | White card with border and hover lift |

---

## Notes

- All CSS uses `!important` to reliably override Elementor's inline styles. This is intentional.
- If a specific section looks wrong, it likely has an inline Elementor override — fix it in the Elementor panel for that widget.
- The `overhaul.css` file is organized in numbered sections — easy to comment out a section if something conflicts.
