# Video-assets for TikTok og Reels

Date: 2026-10-09
Generator: `scripts/build-social-videos.py`
Output (not in git): `/opt/cursor/artifacts/social-videos/`, which holds 3 MP4s, 3 cover PNGs and `video-captions.md`.

## What we learned from the research

- **The hook is in frame 1.** TikTok checks retention around second 2–3, and most people start with the sound off. So the hook text is static from the very first frame, not typed in, and it's short (3–7 words). Sources: [Kompozy, hooks guide](https://kompozy.io/guides/short-form-video-hooks), [SMMNut](https://smmnut.com/blog/tiktok-hook-strategy/), [Sink or Swim, TikTok Creative Center](https://sink-or-swim-marketing.com/blog/tiktok-creative-center-best-practices-hook-retention-2025/).
- **The text has to tell the story without sound.** Design for sound off and reward sound on: the trending sound is added in the app.
- **Safe zones.**
  - TikTok's In-Feed template covers the top 240 px, the bottom 660 px, and a button column on the right (x 780+ from y 840).
  - Reels covers 14 % at the top and 35 % at the bottom.
  - Sources: [ToolsWebPro](https://www.toolswebpro.com/guides/tiktok-reels-shorts-safe-zones-2026), [Echopulse](https://echopulse.media/blog/vertical-video-safe-zones-2026).
- **Studytok and studygram 2026.** Faceless "plan with me" videos with real iPad workflows (GoodNotes-style zoom, Pencil, colour codes) outperform polished, ad-like creative. The style that works is calm and restrained: a light desk, coffee, a clock or time as the motif, and a little decoration.

## Design choices

- **Format:** 1080×1920, 30 fps, H.264 High, yuv420p (bt709), CRF 19, `+faststart`, with a silent AAC track. Each video is 19–22.5 s long.
- **Scene.** A light linen desk in the site's palette, with window light, a soft vignette and fine film grain. There's a coffee cup in the corner, and an iPad on the desk.
  - The iPad screen shows a neutral note app: status bar with a clock that ticks, a toolbar where the active tool lights up, and a page title. There's no GoodNotes logo.
  - A slight handheld drift, a slow push-in, and a small "punch-in" on every new step give a UGC feel without shaking.
- **The real planners.** We render the actual PDFs and type into the real fillable fields, in the planners' own font (Montserrat). Each entry shows a text box and a cursor, just like the text tool in a note app.
  - Ticks, highlighter and the water glasses are drawn with an Apple-Pencil-like stylus that has a shadow.
  - No fake handwriting.
- **Camera.** It zooms and pans on the page like a pinch-zoom, with cubic easing. The active field sits in the upper part of the screen, so it isn't covered by the TikTok text.
  - Page changes are a horizontal swipe on a 0.5 s grid (120 BPM), so the cuts land on the beat of most trending sounds.
- **Typography.**
  - Brand fonts from `app/fonts` (Playfair Display 800 for headings, DM Sans for steps and labels) in brand colours: dark #3D3229, medium #8B7355 and accent #C4A882.
  - The text lives in a calm band at y≈260–640, above the iPad, with:
    - a small, letter-spaced label;
    - a large hook;
    - steps with a number in an accent circle, which slide in and fade out;
    - an end card with one dark URL pill.
  - No yellow boxes and no emoji in the image.
- **Covers.** 1080×1920 with the title inside the centre 3:4 area, so they work in the profile grid. They show the finished, filled-in planner.

## Honesty and the paid PDFs

- The paid pages (Vane Tracker, 30-dagers utfordring, Daglig Gjennomgang, Daglig Planlegger) are only shown zoomed in.
  - The renderer stops with an error if a paid page gets a scale below `MIN_PAID_SCALE = 1.9` px/pt. At that scale at most about 46 % of the page area is visible.
  - The free sample can be shown in full.
- The 30-dagers crop stops above row 4, so the «98%» marker doesn't show.
- There is no exam planner product. Video 2 shows a method that uses the existing planners and doesn't invent a product.
- The prices shown are the real ones: 39 kr each and 5 of your choice for 99 kr. There are no reviews, before-prices or urgency.
- The paid PDFs are read from `PAID_DIR` (outside the repo). Nothing paid is committed.

## The three videos

| # | Hook | Content | End |
|---|---|---|---|
| 1 | «Planlegg studieuka med meg» (søndag kveld 19:42) | Gratis smakebit: 3 mål → ranger → faste avtaler i timeplanen → kryss av | Full page, «Prøv smakebiten gratis», studentplanlegger.no/gratis |
| 2 | «6 uker til eksamen?» + «Sånn deler jeg opp lesingen» | A strip of weeks U6→U1: smakebit (overview), Vane Tracker (reading), 30-dagers (old exams), Daglig Gjennomgang (revise and sleep) | «Lagre til eksamensperioden», 39 kr / 5 for 99 kr |
| 3 | «Morgenplanen min tar 5 minutter» (07:12→07:17) | Daglig Planlegger: one goal → three priorities → time blocks → water and mood | «Daglig Planlegger», 39 kr, gratis smakebit on /gratis |

## Rebuilding

```bash
pip install pillow numpy pymupdf fonttools brotli
PAID_DIR=/path/to/fixed-planners python3 scripts/build-social-videos.py            # all
python3 scripts/build-social-videos.py --only 2 --preview 0,8,15                  # stills
```
