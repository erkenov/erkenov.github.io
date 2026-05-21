"""Re-encode Veo MP4s for buttery scroll-scrubbing.

Veo's default output uses sparse keyframes (one every ~2 sec), so seeking
to a non-keyframe position forces the browser to decode from the nearest
preceding I-frame — visible as a 3-5 second freeze before the target
frame appears. Setting -g 1 makes EVERY frame a keyframe, so each seek
is instant. Audio stripped because the videos play muted anyway.

Output filenames overwrite the originals (after a *.bak backup).
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

FFMPEG = Path(
    r"C:\Users\erken\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe"
)
HERE = Path(__file__).resolve().parent
HERO_DIR = HERE.parent / "public" / "hero"

CLIPS = ["scene-1.mp4", "scene-2.mp4", "scene-3.mp4"]


def reencode(src: Path) -> None:
    backup = src.with_suffix(".mp4.bak")
    tmp = src.with_suffix(".scrub.mp4")
    if not backup.exists():
        shutil.copy2(src, backup)
        print(f"[backup] {backup.name}", flush=True)
    cmd = [
        str(FFMPEG),
        "-y",
        "-i", str(src),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "23",
        # every frame an I-frame -> instant seeking
        "-g", "1",
        "-keyint_min", "1",
        "-sc_threshold", "0",
        # moov atom up front so browser can scrub before full download
        "-movflags", "+faststart",
        # strip audio (we play muted)
        "-an",
        # pixel format that all browsers can decode
        "-pix_fmt", "yuv420p",
        str(tmp),
    ]
    print(f"[encode] {src.name} ...", flush=True)
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        sys.exit(f"[error] ffmpeg failed for {src.name}:\n{result.stderr[-1500:]}")
    src.unlink()
    tmp.rename(src)
    print(f"[done]  {src.name} ({src.stat().st_size:,} bytes)", flush=True)


def main() -> int:
    if not FFMPEG.exists():
        sys.exit(f"[error] ffmpeg not found at {FFMPEG}")
    print(f"[reencode] target dir: {HERO_DIR}", flush=True)
    for name in CLIPS:
        path = HERO_DIR / name
        if not path.exists():
            print(f"[skip] {name} not present", flush=True)
            continue
        reencode(path)
    print("\n[reencode] all done.", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
