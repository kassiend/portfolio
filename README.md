# Dauren Kassen — Portfolio

A one-page portfolio for **Dauren Kassen**, Senior Android Developer (Kotlin, Compose Multiplatform, KMM).

Minimal, text-first single-column design with a **Minimal / Creative** view toggle.

## Live

https://kassiend.github.io/portfolio/

## Stack

- Plain HTML / CSS / JS — no build step
- Google Fonts: Hanken Grotesk, Bricolage Grotesque, JetBrains Mono
- Live Almaty clock, mode toggle with `localStorage`, CSS animations

## Structure

```
index.html      # markup — both Minimal and Creative views
styles.css      # design system + animations
script.js       # mode toggle + clock
assets/         # company logos
```

## Run locally

Just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```
