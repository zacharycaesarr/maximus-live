# How to edit FAQ questions and answers (plain English)

Your edits live in the project files. When we push live later, those same files go up. So yes: whatever you change here will be on the live site after a push.

## Questions (the clickable lines)

1. Open the project folder in Cursor
2. Open one of these files (you will need to do all three if you want them the same everywhere):
   - `index.html` (home)
   - `about.html`
   - `portfolio.html`
3. Press Ctrl+F and search for: `Frequently asked questions`
4. A little lower you will see lines like:
   `What do you actually do?`
5. Change only the words between the `>` and `</button>`
6. Keep the same number of question buttons (six right now), in the same order

Example:
- Before: `What do you actually do?`
- After: `What services do you offer?`

## Answers (what shows on the right)

1. Open `script.js`
2. Press Ctrl+F and search for: `Edit these answers anytime`
3. You will see a list of six answers inside quotes
4. Edit the text inside the quotes
5. Answer #1 matches question #1, answer #2 matches question #2, and so on
6. Do not delete the commas between answers
7. Do not use dashes in the wording (use commas or periods instead)

## After you edit

1. Save the file(s)
2. Refresh local preview: http://127.0.0.1:5173/ then Ctrl+Shift+R
3. Click Frequently asked questions and check your new text
4. Tell me when you want it pushed live

Nothing goes live until you say to push.
