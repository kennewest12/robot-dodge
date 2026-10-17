# Robot Dodge

A static Three.js endless runner built for start.ng. Signed-in players bring their start.ng character style into the game: body type, top and trousers colors, skin, hair, hat, and accessory all shape the low-poly runner. The game uses start.ng's connect page for identity, score submission, and its shared leaderboard.

## Play locally

Open `index.html` from a static web server (for example `python -m http.server 8000`) and visit `http://localhost:8000`. Three.js is loaded from jsDelivr.

## Publish

Push this folder's contents to a **public** GitHub repository with `index.html` at its root. Then follow the [start.ng game guide](https://start.ng/docs.md): POST `{"repo_url":"https://github.com/OWNER/REPO","name":"robot-dodge"}` to `https://api.start.ng/games/check`, fix any reported issues, and POST the same JSON to `/games/publish`. Open the returned `approve_url` while signed in to start.ng to approve the first publication.

Controls: Left/Right or A/D to change lanes; Space/Up to jump. On touch devices, swipe left/right to change lanes and tap to jump.
