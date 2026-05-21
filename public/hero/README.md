# Hero Scrollytelling Video Files

This directory holds the three MP4 clips that power the new PinnedHero scroll cinematic. Drop them here with these exact names:

- `scene-1.mp4` — phone ringing on desk (~4 sec, 1920x1080)
- `scene-2.mp4` — system answering, transcript builds (~4 sec, 1920x1080)
- `scene-3.mp4` — laptop opens revealing CRM dashboard (~4 sec, 1920x1080)

Optional poster fallbacks (single-frame JPEGs shown while video loads or if browser blocks playback):

- `scene-1-poster.jpg`
- `scene-2-poster.jpg`
- `scene-3-poster.jpg`

**Generation prompts:** see `vault/04-tools/hero-video-generation-prompts.md` for the exact prompts to paste into Veo / Runway, plus brand constraints (no purple-pink gradients, no Web3-NFT vibe, industrial-confident only).

**File size target:** under 2 MB each after compression (use Handbrake).

**When you drop them in:** the React component already loads them automatically. Restart the dev server (`npm run dev`) and scroll to verify.
