"""Fallback for gmp.json when ipopremium.in's list endpoint fails (fetch_gmp.py exits non-zero).

Builds the same gmp.json shape from the QIB Allotment Desk's feed (apps/qib-desk/docs/data/ipos.json),
which scrapes the same site's IPO pages. IPO ids (src) are ipopremium's own, so saved planner rows
keep matching. Issue size comes from the Deal Desk feed when the names match.
Only open, upcoming and closed-not-listed IPOs are written, like fetch_gmp.py.
"""
import datetime as dt
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
QIB = os.path.join(APP, "..", "qib-desk", "docs", "data", "ipos.json")
DEAL = os.path.join(APP, "..", "deal-desk", "site", "ipos.json")
OUT = os.path.join(APP, "gmp.json")


def name_key(s):
    s = re.sub(r"\(.*?\)", " ", (s or "").lower())
    s = re.sub(r"\b(ltd|limited|ipo|india|the|company|co)\b", "", s)
    return re.sub(r"[^a-z0-9]", "", s)


def name_match(a, b):
    x, y = name_key(a), name_key(b)
    return bool(x and y) and (x == y or x.startswith(y) or y.startswith(x))


def main():
    qib = json.load(open(QIB, encoding="utf-8"))
    rows = qib["ipos"].values() if isinstance(qib["ipos"], dict) else qib["ipos"]
    deal = []
    try:
        deal = json.load(open(DEAL, encoding="utf-8")).get("ipos", [])
    except (OSError, ValueError):
        pass
    # one record per ipopremium id: the feed can hold several slugs for the same IPO page.
    # Keep the one with subscription data, then the most recently seen.
    best = {}
    for r in rows:
        m = re.search(r"/view/ipo/(\d+)/", r.get("url") or "")
        if not m:
            continue
        rank = (bool(r.get("subscription")), r.get("last_seen") or "", r.get("first_seen") or "")
        if m.group(1) not in best or rank > best[m.group(1)][0]:
            best[m.group(1)] = (rank, r)
    ipos = []
    for _, r in best.values():
        if r.get("status") not in ("open", "upcoming", "closed"):
            continue
        m = re.search(r"/view/ipo/(\d+)/", r.get("url") or "")
        if not m:
            continue
        hi = float(r.get("price_band_high") or 0)
        lo = float(r.get("price_band_low") or 0) or hi
        gmp = float(r.get("gmp") or 0)
        sub = r.get("subscription") or {}
        q, tot = sub.get("qib") or {}, sub.get("total") or {}
        name = re.sub(r"\s*\(.*?\)\s*", " ", r.get("name") or "").strip()
        exch = (r.get("exchange") or "").split(",")[0].strip()
        hist = r.get("subscription_history") or []
        item = {
            "src": int(m.group(1)),
            "name": name,
            "exch": (exch if "SME" in exch.upper() else f"{exch or 'NSE'} SME") if r.get("is_sme") else "Mainboard",
            "status": r["status"],
            "priceLow": lo,
            "priceHigh": hi,
            "lot": int(float(r.get("lot_size") or 0)),
            "gmp": gmp,
            "gmpPct": round(gmp / hi * 100, 2) if hi else 0,
            "issueCr": None,
            "open": r.get("open_date") or "",
            "close": r.get("close_date") or "",
            "allot": r.get("allotment_date") or "",
            "listing": r.get("listing_date") or "",
            "subs": float(q.get("times") or 0),
            "qibCr": round(float(q["shares_offered"]) * hi / 1e7, 2) if q.get("shares_offered") and hi else "",
            "mfCr": (r.get("qib_split_cr") or {}).get("mf", ""),
        }
        if tot.get("shares_offered"):
            item.update(maxQibSh=int(tot["shares_offered"]), maxQibSrc="ipopremium (estimate)")
        if q.get("times") is not None and hist:
            item.update(subsSrc="ipopremium", subsAt=str(hist[-1].get("at", "")).replace("T", " ")[:16])
        d = next((x for x in deal if name_match(x.get("name"), name)), None)
        if d and d.get("issueSizeCr") is not None:
            item["issueCr"] = d["issueSizeCr"]
        ipos.append(item)
    if not ipos:
        sys.exit("QIB desk feed has no current IPOs; keeping previous gmp.json")
    out = {"source": "https://www.ipopremium.in/ (via QIB Allotment Desk feed)",
           "updated": qib.get("updated") or dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
           "ipos": ipos}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"wrote {len(ipos)} IPOs from the QIB desk feed")


if __name__ == "__main__":
    main()
