# Earth Theme Assets

Generated and curated assets for the earth/cream sustainability theme.

| File | Use |
|------|-----|
| `pattern-earth-tile.png` | Tileable background texture (cream/sage). Used on `body` in `index.css` for subtle depth. |
| `accent-leaf.svg` | Vector leaf (earth green), transparent background. Used on About card and 404. No pixelation. |
| `accent-leaf-hero.svg` | Same leaf in white for hero. Used in hero bottom-right. Transparent background. |

## Hero video

The hero uses a video from `public/`: **5692323-hd_1920_1080_30fps.mp4** (1080p, ~31MB), with fallback to **hero-sustainability.jpg** and `poster` for loading. When `prefers-reduced-motion: reduce` is set, the video is hidden and only the image shows.
