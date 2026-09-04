# How the memory bank works (plain English)

## What it is

A private notebook inside this project folder: `_memory/`

It is blocked from the live website by `.vercelignore`, so visitors never see it.

## What is inside

- `RULES.md` : standing rules I should follow every time (AI privacy, no dashes, explain simply, etc.)
- `CHANGELOG.md` : what we changed and when
- `DECISIONS.md` : bigger choices we locked in
- `FAQ-EDIT-GUIDE.md` : how you edit FAQ text yourself
- `README.md` : short overview of this folder

## How I use it

At the start of work in this project, I should open `_memory/RULES.md` (and related files) and follow them.

When we make an important change, I update the memory bank.

## Starting a new chat in the same project

If you open a new Cursor chat while this folder is still the project:

1. Tell me: "Read `_memory/RULES.md` and `_memory/CHANGELOG.md` first"
2. Or just say "check the memory bank"

I can read those files from the project even in a new chat. The chat history does not auto carry over, but the memory bank files do, because they live in the folder.

## Tip

Pin or bookmark `_memory/RULES.md` for yourself. If a new chat seems lost, paste: "Follow `_memory/RULES.md`. Do not push live until I say so."
