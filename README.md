# FinDeependence Universe

**Every IPO. Every rupee. One universe.** Six FinDeependence desks in one 3D web app, created by **CA Deep Dalal** (Chartered Accountant · Fund Manager).

**Open the app:** https://deepdalal27.github.io/FinDeependence_Finance-World_CA-Deep-Dalal/

| # | Desk | What it does | Opens at | Was |
|---|---|---|---|---|
| 01 | **IPO Tracker** | Live QIB / sHNI / bHNI / Retail subscription, SEBI allotment odds, family PAN planner, capital planner, scenarios, My Book | `#/desk/ipo-tracker` | FinDeependence-CA_DEEP_DALAL-QIB |
| 02 | **QIB Allotment Desk** | SEBI ICDR Schedule XIV QIB allotment to the share, MF reserve, exact mode, calibration, GMP ladder, A4 PDF | `#/desk/qib-desk` | QIB_IPO_Allotement_Calculator |
| 03 | **Max-Profit Planner** | 4-number calculator, profit at every subscription level, compare IPOs on one amount, PDF | `#/desk/max-profit` | IPO-Max-Profit-FinDeependece-CA_Deep_Dalal |
| 04 | **HNI IPO Ledger** | sHNI / bHNI applications across family accounts, one-click / automatic allotment checks, reports in Excel and PDF | `#/desk/hni-ledger` | Individual-IPO-Filled-Tracker-FinDeependence |
| 05 | **IPO Deal Desk** | Kostak / Subject-to / premium deals with investors and brokers, settlements, predictor, ledgers | `#/desk/deal-desk` | IPO_Profit_Loss_FinDeependence |
| 06 | **Rights Issue Analyser** | Live rights issues, 0–100 RE ratings, credit and default check, subscription, volume, highs and lows | `#/desk/rights` | Right-Issue-Analysis-by-FinDeependence-CA-Deep-Dalal |

Every desk keeps **all** of its original features. Each one runs its own original code, unchanged apart from the small edits listed under [What changed in the desks](#what-changed-in-the-desks).

## What's new on top

- **3D universe.** The FinDeependence core, one orbiting planet per desk (click it to open the desk), a ring of live-IPO bars whose heights are real GMP % and listing gains, the logo's rising teal growth line, and money-flow particles. It adapts to phones and respects "reduce motion".
- **Command Center.** Live KPIs and a ticker. **IPO Radar** merges all desks' feeds into one table: GMP with sparkline, estimated gain, category-wise subscription, retail odds and dates. **Today on Dalal Street** shows the next 7 days. **Rights Radar** lists open and upcoming issues with the discount to market price.
- **IPO 360°.** Tap any IPO for one merged view: GMP journey, timeline, subscription by category, chance of allotment (retail / sHNI / bHNI), key facts, and one-tap jumps into every desk.
- **Research Lab.** Hundreds of past IPOs plotted as total subscription against listing-day gain, with demand buckets, hit rate and how far GMP usually misses.
- **Your universe.** Counts of your accounts, applications, deals and book records, read from this browser. Nothing is uploaded.
- **Search everything** with `Ctrl K` / `⌘K` (or `/`): IPOs, desks, rights issues, actions.
- **60-second tour** (the pitch). A guided camera flight through all six desks, ending with your contact card. Share `…/#/tour` to start someone straight in the tour.
- **One shell.** Desks open inside the app, keep their place when you switch, and have a "How to use in 3 steps" card, a reload button and a "Full screen" button that opens the desk on its own page.
- Light and dark themes, an installable web-app manifest, deep links (`#/desk/<id>`, `#/ipo/<key>`, `#/tour`).

## Your existing data

The old apps and the Universe are on the same site (`deepdalal27.github.io`), so the browser shares their saved data. **Open the Universe in the same browser you used before and your accounts, PANs, applications, deals, My Book and QIB history are already there.** The storage keys are unchanged: `findeependence-ipo-ledger-v1`, `fd-ipo-deal-desk-v1`, `fd_book`, `fd_plan_settings`, `qib-apps`, `ipoPlanner.v1` and the rest. Each desk's backup and restore works as before.

On a new device, use each desk's **Restore backup**.

## Access

Everything is open. The IPO Tracker's licence gate (FD- codes) was removed in this copy. The standalone tracker on its old address is untouched.

## Data pipelines

All scrapers now live in this repository and run on GitHub Actions. They have the same sources, schedules and steps as the original repositories:

| Workflow | Schedule | Writes |
|---|---|---|
| `Data · QIB Allotment Desk` | hourly on weekdays 09:05–19:05 IST, 21:05, and daily 07:05 | `apps/qib-desk/docs/data/`, `apps/qib-desk/data/applications.json` |
| `Data · HNI IPO Ledger` | every 30 min | `apps/hni-ledger/site/ipos.json`, `status.json`, `fd-allotment.user.js` |
| `Data · Deal Desk IPOs & GMP` | every 30 min, 08:41–22:11 IST | `apps/deal-desk/site/ipos.json` |
| `Data · Deal Desk history` | daily 19:07 IST, plus retries | `apps/deal-desk/site/history.json` |
| `Data · Allotment Planner GMP` | every 10 min | `apps/max-profit/gmp.json` |
| `Data · Rights Issues` | every 15 min in market hours, every 3 h otherwise | `rights-data` branch (single commit, so main never bloats) |
| `Deploy FinDeependence Universe` | on every push to main and after every data job | GitHub Pages |

`apps/max-profit/exchange.json` (NSE's maximum QIB bid) is still pushed from your own PC, because NSE blocks cloud servers. Run `powershell -ExecutionPolicy Bypass -File apps\max-profit\scripts\fetch_exchange.ps1` from a clone of this repo.

### One-time setup

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.** (The deploy workflow also tries to switch this on by itself.)
2. **Settings → Actions → General → Workflow permissions → Read and write permissions.**
3. **Actions → run each "Data · …" workflow once** (Run workflow), then "Deploy FinDeependence Universe".
4. When the Universe is live, **turn off the scheduled workflows in the six old repositories** (Actions → workflow → ⋯ → Disable workflow), so the sources aren't scraped twice. Leave the old sites up for as long as you like: they keep working.

### HNI Ledger auto-fill script

The Tampermonkey script is now version 2.1.0. It matches both the old ledger address and the new one (`/apps/hni-ledger/site/`). Reinstall it once from `apps/hni-ledger/site/fd-allotment.user.js` on the live site, so future updates come from the Universe.

## Repository map

```
index.html                 Universe shell (Command Center, desk host, IPO 360°, search, tour)
assets/universe.css        design system (FinDeependence Studio tokens, glass, light/dark)
assets/universe.js         data fusion across feeds, Command Center, routing, palette, tour
assets/cosmos.js           3D scene (Three.js r160, vendored in assets/vendor/)
apps/_universe/            embed.css + embed.js: brand palette and shell bridge for every desk
apps/<desk>/               each original app, with its folder layout, tests and scrapers unchanged
.github/workflows/         ported data pipelines + Pages deploy
.github/scripts/commit-push.sh   commit-and-push with retry (data jobs run in parallel)
```

## What changed in the desks

- Every desk page loads `apps/_universe/embed.css` and `embed.js`. They map the older green palette of desks 01, 02, 03 and 06 to the FinDeependence Studio palette. Inside the Universe they hide the desk's own logo band, because the shell shows it; printing and PDFs are unchanged. No logic, maths or storage is touched.
- IPO Tracker: licence gate removed (open access).
- HNI Ledger: `site/accounts.js` pre-fills sample names ("Investor 01"…) on a first visit only. Real names stay in your browser. The userscript build matches the new address too.
- Deal Desk: the raw-GitHub data fallback now points at this repository.
- `.gitignore` files were adjusted so the data files the pipelines write are tracked.

## Develop

```bash
python3 -m http.server 8080        # then open http://localhost:8080
cd apps/hni-ledger && npm test
cd apps/deal-desk && npm ci && npm test
cd apps/qib-desk && npm test && pip install -r requirements.txt && python -m pytest -q
```

*For education and estimation only. Not investment advice. GMP is unofficial. Allotment is decided by the registrar under SEBI rules.*
