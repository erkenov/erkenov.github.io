"""
Generate the 3 PinnedHero scrollytelling clips via Veo 3 (Gemini API).

Reads GEMINI_API_KEY from website/.env.local.
Saves MP4s to website/public/hero/scene-1.mp4, scene-2.mp4, scene-3.mp4.

Veo 3 produces ~8-second clips at $0.75/sec -> ~$18 total for all three.
Skips any scene that already exists (so re-runs don't re-bill).

Usage (from website folder):
    python scripts/generate_hero_videos.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import time
from pathlib import Path

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

HERE = Path(__file__).resolve().parent
WEBSITE_ROOT = HERE.parent
ENV_FILE = WEBSITE_ROOT / ".env.local"
OUT_DIR = WEBSITE_ROOT / "public" / "hero"

BASE_URL = "https://generativelanguage.googleapis.com/v1beta"
# Available 2026-05: veo-3.1-generate-preview (newest), veo-3.0-generate-001 (GA),
# veo-3.0-fast-generate-001 (cheaper/faster), veo-3.1-fast-generate-preview,
# veo-3.1-lite-generate-preview, veo-2.0-generate-001
MODEL = "veo-3.0-generate-001"
POLL_INTERVAL_SEC = 15
POLL_TIMEOUT_SEC = 60 * 8  # 8 min per clip (Veo 3 says max ~6 min)

# Brand constraints baked into every prompt
BRAND_PRELUDE = (
    "Cinematic, restrained, industrial-confident aesthetic. Apple Vision Pro launch reel vibe, "
    "NOT Web3 NFT vibe. Moody near-black backgrounds. Only accent is industrial orange #ff7849. "
    "No purple, no pink, no chrome-neon. Real environments and objects. No glowing voxels or "
    "abstract AI spheres. Restrained motion. No text overlays in the video. No people's faces "
    "visible — hands and shoulders only. 16:9, 1080p. "
)

PROMPTS = {
    "scene-1.mp4": BRAND_PRELUDE + (
        "Cinematic close-up shot. A modern smartphone sits face-up on a clean dark wooden desk. "
        "The desk has a few professional objects scattered nearby — a coffee cup with steam barely "
        "rising, a notebook, a pen, the edge of a laptop. Industrial overhead lighting creates a "
        "single soft spotlight on the phone. Color grading is moody and near-black with deep "
        "neutrals; a faint warm amber-orange glow accents the scene from off-camera. The phone "
        "begins to ring — the screen illuminates with an incoming call notification, and a subtle "
        "vibration ripple runs across the wooden surface. Slow dolly-in toward the phone over the "
        "eight seconds. Documentary realism, not glossy stock-video aesthetic. Shot on Arri Alexa, "
        "anamorphic lens, shallow depth of field."
    ),
    "scene-2.mp4": BRAND_PRELUDE + (
        "Cinematic close-up shot. The same phone from before, now showing an active call interface. "
        "Below the call timer, a thin horizontal audio waveform pulses gently in industrial orange "
        "(#ff7849), responding to inaudible voice. The phone screen shows a clean transcript "
        "building up live, appearing one character at a time in a clean monospace font: "
        "'Hi, this is Sam — how can I help your business today?'. Behind the phone, the rest of "
        "the desk fades into shadow. Subtle ambient particles drift in the negative space — like "
        "dust in a sunbeam, not glowing magic. No glowing AI sphere, no abstract data "
        "visualization. The scene says: this is just a phone call, but the receptionist is "
        "invisible and works at 2 AM. Continued slow push-in. Color palette: 90% near-black, "
        "10% warm orange accent."
    ),
    "scene-3.mp4": BRAND_PRELUDE + (
        "Cinematic medium shot. A modern laptop sits on the same dark wooden desk, partially "
        "closed but rotating open toward the camera in slow smooth motion, like an Apple unboxing "
        "reveal. As the lid passes 90 degrees, the screen brightens to reveal a clean dark-mode "
        "CRM dashboard interface (Linear-like or Notion-like — restrained typography, clean rows, "
        "no fake data clutter). The dashboard shows a single new entry appearing at the top of a "
        "contact list: 'New lead — booked appointment — 2 minutes ago.'. A subtle orange (#ff7849) "
        "dot pulses next to the entry. The room around the laptop stays in moody shadow. No hands "
        "visible. Slow tilt-up and dolly-in continues, landing on the new dashboard entry. Color "
        "grading like Mr. Robot or Severance — desaturated, surgical, premium."
    ),
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def load_env_var(name: str) -> str:
    if not ENV_FILE.exists():
        sys.exit(f"[error] env file not found: {ENV_FILE}")
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        if key.strip() == name:
            return value.strip().strip('"').strip("'")
    sys.exit(f"[error] {name} not set in {ENV_FILE}")


def _retryable_post(url: str, headers: dict, body: dict, attempts: int = 8) -> requests.Response:
    """POST with retry on 5xx and network timeouts. Exponential backoff."""
    backoffs = [5, 15, 30, 60, 120, 180, 240]
    last_exc = None
    for i in range(attempts):
        try:
            resp = requests.post(url, headers=headers, json=body, timeout=300)
            if resp.status_code < 500:
                return resp
            print(f"  [transient] {resp.status_code}, retrying in {backoffs[min(i, len(backoffs)-1)]}s...", flush=True)
        except (requests.exceptions.Timeout, requests.exceptions.ConnectionError) as e:
            last_exc = e
            print(f"  [transient network] {type(e).__name__}, retrying in {backoffs[min(i, len(backoffs)-1)]}s...", flush=True)
        if i < attempts - 1:
            time.sleep(backoffs[min(i, len(backoffs)-1)])
    if last_exc:
        raise last_exc
    return resp  # type: ignore[name-defined]


def submit(api_key: str, prompt: str) -> str:
    url = f"{BASE_URL}/models/{MODEL}:predictLongRunning"
    headers = {"x-goog-api-key": api_key, "Content-Type": "application/json"}
    body = {"instances": [{"prompt": prompt}]}
    resp = _retryable_post(url, headers, body)
    if resp.status_code >= 300:
        sys.exit(f"[error] submit failed {resp.status_code}: {resp.text[:600]}")
    data = resp.json()
    op_name = data.get("name")
    if not op_name:
        sys.exit(f"[error] submit response missing 'name': {data}")
    print(f"  submitted, operation: {op_name}", flush=True)
    return op_name


def poll(api_key: str, op_name: str, label: str) -> dict:
    url = f"{BASE_URL}/{op_name}"
    headers = {"x-goog-api-key": api_key}
    start = time.time()
    while True:
        resp = requests.get(url, headers=headers, timeout=60)
        if resp.status_code >= 300:
            sys.exit(f"[error] poll failed {resp.status_code}: {resp.text[:600]}")
        data = resp.json()
        if data.get("done"):
            err = data.get("error")
            if err:
                sys.exit(f"[error] {label} generation errored: {err}")
            return data
        elapsed = int(time.time() - start)
        print(f"  [{label}] still generating... ({elapsed}s elapsed)", flush=True)
        if elapsed > POLL_TIMEOUT_SEC:
            sys.exit(f"[error] {label} polling exceeded {POLL_TIMEOUT_SEC}s")
        time.sleep(POLL_INTERVAL_SEC)


def extract_video_uri(poll_response: dict) -> str:
    response = poll_response.get("response", {})
    # Try the common shapes — API surface has shifted a few times across Veo versions
    candidates = []
    if isinstance(response.get("generateVideoResponse"), dict):
        samples = response["generateVideoResponse"].get("generatedSamples", [])
        for s in samples:
            v = s.get("video", {})
            if isinstance(v, dict) and v.get("uri"):
                candidates.append(v["uri"])
    if isinstance(response.get("generatedVideos"), list):
        for s in response["generatedVideos"]:
            v = s.get("video", {})
            if isinstance(v, dict) and v.get("uri"):
                candidates.append(v["uri"])
    if not candidates:
        sys.exit(f"[error] could not find video URI in: {json.dumps(response)[:800]}")
    return candidates[0]


def download(api_key: str, uri: str, dest: Path) -> None:
    headers = {"x-goog-api-key": api_key}
    with requests.get(uri, headers=headers, stream=True, allow_redirects=True, timeout=300) as r:
        if r.status_code >= 300:
            sys.exit(f"[error] download failed {r.status_code}: {r.text[:300]}")
        dest.parent.mkdir(parents=True, exist_ok=True)
        with open(dest, "wb") as f:
            for chunk in r.iter_content(chunk_size=1 << 16):
                if chunk:
                    f.write(chunk)


def generate_one(api_key: str, filename: str, prompt: str) -> None:
    dest = OUT_DIR / filename
    if dest.exists() and dest.stat().st_size > 1024:
        print(f"[skip] {filename} already exists ({dest.stat().st_size:,} bytes) — delete to regenerate")
        return
    label = filename.removesuffix(".mp4")
    print(f"\n[submit] {label}")
    op_name = submit(api_key, prompt)
    print(f"  operation: {op_name}")
    final = poll(api_key, op_name, label)
    uri = extract_video_uri(final)
    print(f"  downloading -> {dest}")
    download(api_key, uri, dest)
    size = dest.stat().st_size
    print(f"[done]   {filename} ({size:,} bytes)")


def main() -> int:
    api_key = load_env_var("GEMINI_API_KEY")
    if not re.match(r"^AIza[A-Za-z0-9_-]{30,}$", api_key):
        sys.exit(f"[error] GEMINI_API_KEY format unexpected: {api_key[:8]}...")
    print(f"[veo] generating {len(PROMPTS)} clips to {OUT_DIR}")
    print(f"[veo] model: {MODEL}")
    print(f"[veo] expected wall time: 5-20 min total")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, prompt in PROMPTS.items():
        generate_one(api_key, filename, prompt)
    print("\n[veo] all done. Files in", OUT_DIR)
    return 0


if __name__ == "__main__":
    sys.exit(main())
