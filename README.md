# Te Ara Whetū: a pop-up history of Waikanae's library

A tap-to-read game for the opening of Te Ara Whetū, Waikanae's new library. Players read their way through
a pop-up book of Mahara Place from 1977 to 2027 and watch the real buildings change: the 1977 library, the
Post Office that became the library in 1996, its closure, the pop-ups and the temporary library at
9 Mahara Place, the Frances Hodgkins mural, Toi MAHARA, and the building of Te Ara Whetū.

It works offline once it has been opened, and it can be installed on a phone or tablet like an app.

## Put it on GitHub Pages

1. On github.com, create a new **public** repository (for example `te-ara-whetu`).
2. On the repository page, click **Add file → Upload files**. Drag in **everything in this folder,
   including the `assets` folder** (GitHub keeps the folder structure when you drag a folder in).
   If `.nojekyll` doesn't come across because its name starts with a dot, that's fine.
3. Click **Commit changes**.
4. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   **Branch** to `main` and the folder to `/ (root)`, then **Save**.
5. After a minute or two the page shows the address, for example
   `https://<your-username>.github.io/te-ara-whetu/`.

## Two ways to play

- **Normal:** `https://<your-username>.github.io/te-ara-whetu/`
  Progress saves on the player's device, so they can come back later.
- **Library display tablets:** add `?kiosk` to the end:
  `https://<your-username>.github.io/te-ara-whetu/?kiosk`
  Quicker pace, nothing is saved, it goes back to the start screen after 45 seconds without a tap and
  resets after 2 minutes, and it keeps the screen on.

### Setting up a display tablet

1. Open the `?kiosk` address once while connected to the internet, and play for a few seconds.
2. Install it:
   - **Android (Chrome):** menu ⋮ → **Add to Home screen** / **Install app**.
   - **iPad (Safari):** Share → **Add to Home Screen**.
3. Open it from the new **Te Ara Whetū** icon. It opens full screen in display mode, and keeps working
   if the Wi-Fi drops.
4. Turn on screen pinning (Android) or Guided Access (iPad) so kids can't leave the game.

## Updating it later

Upload the new files over the old ones, **always all of them together** (including `sw.js`).
Phones and tablets fetch the new version in the background and use it from the next time the game is
opened. A display tablet that is left running switches over by itself the next time it sits idle for
two minutes.

## What's in the folder

| File | What it is |
|---|---|
| `index.html` | The page |
| `assets/game.css`, `assets/game.js` | The game's look and the game itself |
| `assets/fonts/` | The lettering (Fredoka, Atkinson Hyperlegible Next and Mono), with their licences |
| `assets/icons/` | App icons |
| `manifest.webmanifest`, `kiosk.webmanifest` | Let it be installed as an app (normal and display versions) |
| `sw.js` | The offline helper |
| `preview.png` | The picture shown when the link is shared |

## Notes

- Nothing is loaded from other websites, and the game sends no data anywhere. Saved progress stays in
  the player's own browser.
- Link previews use `preview.png`. Some sites need the full address: if the preview doesn't appear,
  change `content="preview.png"` in `index.html` to
  `content="https://<your-username>.github.io/te-ara-whetu/preview.png"`.
- The buildings are original drawings made from photos and council renders in the project's visual
  archive. No photos are included in the game.
- Te Ara Whetū in 2027 is drawn from the council's design render, since the finished building had not
  been photographed when this was made.
- The fonts are used under the SIL Open Font License 1.1 (see `assets/fonts/OFL-*.txt`).
