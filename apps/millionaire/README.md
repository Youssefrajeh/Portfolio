# Al-Million (من سيربح المليون)

An Arabic-language trivia game in which players answer 15 progressively harder questions to climb from $100 to $1,000,000. The game is a Progressive Web App (PWA): it can be installed on mobile and desktop devices and works offline after the first visit.

## Features

- **982 questions** spread over 15 difficulty levels, from $100 to $1,000,000.
- **No repeats.** The game remembers which questions each player has already seen. It shows them again only after every question in that level has been used.
- **Shuffled answers.** The order of the four options changes every time a question appears.
- **Three lifelines:**
  - **50:50** removes two wrong answers.
  - **Ask the Audience** shows a poll of the audience's answers.
  - **Phone a Friend** suggests an answer.
- **Safe havens** at $1,000 and $32,000.
- **Timer:** 30 seconds for questions 1–5, 45 seconds for questions 6–10, and no limit after that.
- **Walk away** at any point and keep the winnings so far.
- **Offline support** through a service worker. The question bank is served gzip-compressed for faster loading.

## Tech stack

- Plain HTML, CSS and JavaScript, with no framework and no build step
- Web App Manifest and service worker for installation and offline play
- A Python 3 script that generates the question bank

## Getting started

The game loads its questions with `fetch` and registers a service worker, so it must be served over HTTP. Opening `index.html` directly from the file system won't work.

```bash
git clone https://github.com/Youssefrajeh/millionaire.git
cd millionaire
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

Alternatively, open the folder in VS Code and use the **Live Server** extension. Right-click `index.html` and choose **Open with Live Server**.

## Deployment

The project is a static site, so any static host works: GitHub Pages, Netlify, Vercel and similar. Browsers allow installing the game as an app only when it is served over HTTPS.

## Project structure

```
├── index.html              # Markup for the start, game and result screens
├── style.css               # Styles (right-to-left layout)
├── game.js                 # Game logic, lifelines, timer and seen-question tracking
├── sw.js                   # Service worker (offline cache)
├── manifest.json           # PWA manifest
├── icons/                  # App icons (192 px and 512 px)
├── questions.json          # Generated question bank (readable)
├── questions.json.gz       # Compressed copy, which the game loads first
└── tools/
    ├── build_questions.py  # Generates the question bank
    └── hand_questions.json # Hand-written questions, grouped by level
```

## Managing questions

The files `questions.json` and `questions.json.gz` are **generated**. Don't edit them by hand. Edit the sources instead and rebuild:

1. Add or change hand-written questions in `tools/hand_questions.json`. To change generated questions, edit the data tables in `tools/build_questions.py`, such as capitals, currencies, chemical elements, World Cups, books and historical dates.
2. Rebuild the question bank:

   ```bash
   python tools/build_questions.py
   ```

   The script removes duplicate questions, writes both `questions.json` and `questions.json.gz`, and prints the number of questions in each level.

Each question uses this format:

```json
{ "q": "Question text?", "options": ["Correct", "Wrong", "Wrong", "Wrong"], "answer": 0 }
```

- `answer` is the zero-based index of the correct option in `options`.
- A question's position in `levels` sets its difficulty. The first level is worth $100 and the last is worth $1,000,000.

If you edit `questions.json` by hand anyway, delete `questions.json.gz` or rebuild it. The game loads the compressed file first, so it will keep showing the old questions otherwise.

## Releasing updates

After changing any file, increase the `CACHE` version in `sw.js`, for example from `millionaire-v3` to `millionaire-v4`. Otherwise, installed copies of the app keep serving the old cached files.
