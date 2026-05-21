"""Recover scene-1.mp4 from the operation handle that succeeded but wasn't downloaded.

The previous run crashed on a Unicode print AFTER the operation completed but
BEFORE the download. The Veo operation handle stays valid for hours, so we
can just poll + download it now without re-paying for generation.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_hero_videos import (
    BASE_URL,
    OUT_DIR,
    download,
    extract_video_uri,
    load_env_var,
    poll,
)

OP_NAME = "models/veo-3.0-generate-001/operations/y1s9uyod4shl"
DEST = OUT_DIR / "scene-1.mp4"


def main() -> int:
    api_key = load_env_var("GEMINI_API_KEY")
    print(f"[recover] polling {OP_NAME}", flush=True)
    final = poll(api_key, OP_NAME, "scene-1")
    uri = extract_video_uri(final)
    print(f"[recover] downloading -> {DEST}", flush=True)
    DEST.parent.mkdir(parents=True, exist_ok=True)
    download(api_key, uri, DEST)
    size = DEST.stat().st_size
    print(f"[recover] done. scene-1.mp4 size: {size:,} bytes", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
