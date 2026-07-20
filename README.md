<div align="center">

# 🎻 Violin Mentor: The Premium Violin Learning App

**Violin Mentor makes learning violin interactive, intelligent, and highly accessible across all age groups.**

</div>

---

## 🌟 The Learning Experience

Violin Mentor bridges the gap between professional music theory and accessible, gamified learning. Inspired by industry leaders like Skoove and Flowkey, the app provides a premium interactive experience right in your browser.

### ✨ Core Features
*   **🎼 Professional Sheet Music Rendering:** Powered by VexFlow, Violin Mentor renders real-time, scrolling sheet music for an authentic classical learning experience.
*   **🧠 Adaptive "Smart Tutor" Algorithm:** If a student struggles and misses the same note repeatedly, the Smart Tutor automatically activates. It drops the tempo, isolates the tricky section, and guides the student to play it perfectly 3 times before seamlessly continuing the song.
*   **🎨 Beautiful UI:** A beautiful, card-based library UI allowing users to easily filter by skill level (Beginner 1, 2, 3) and mood/category (Classical, Folk, Kids, etc.).
*   **🎤 Acoustic Microphone Pitch Detection:** No special equipment? No problem. Violin Mentor uses an advanced auto-correlation algorithm via the device microphone to hear the notes you play on a real violin!
*   **🎧 Free Play Mode:** A built-in studio where users can practice freely and explore the violin.

---

## 👨‍👩‍👧 Built for Families

*   **Multi-Profile Support:** Switch between unlimited local profiles for everyone in the family.
*   **Google Sign-In:** Seamlessly back up profiles and learning progress using Firebase authentication.
*   **Infinite Library Expandability:** Users can search the **MusicBrainz** database for songs, or import raw **Public Domain** scores on the fly to practice.

---

## 🛠 For Developers

Violin Mentor is a robust Progressive Web App (PWA) demonstrating complex browser APIs.

### Tech Stack
| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS + Framer Motion |
| **Sheet Music** | VexFlow |
| **Audio Engine** | Tone.js (PolySynth & Sampler) |
| **State Management**| Zustand (Persisted) |
| **Database/Auth** | Firebase |

### Hardware & Web APIs
*   **Web MIDI API:** Plug-and-play support for digital instruments via USB.
*   **Web Audio API:** High-fidelity soundfonts, real-time microphone analysis, and dynamic tempo adjustment.
*   **PWA (Offline Ready):** Installable on mobile and desktop. Practice built-in lessons without an internet connection!

### Getting Started

Want to run Violin Mentor locally or contribute?

```bash
# Clone and install dependencies
npm install

# Start the local server
npm run dev
```
The app will run locally at `http://localhost:5173`.

To enable the Claude-powered violin chatbot, create `.env.local` in the project
root and add your Anthropic API key:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Restart the development server after changing `.env.local`. Keep the key
server-side and never rename it with a `VITE_` prefix, which would expose it to
the browser bundle.

For Firebase Hosting, store the same key in Firebase Secret Manager and deploy
the Hosting site and Cloud Function:

```bash
npx firebase use --add
npx firebase functions:secrets:set ANTHROPIC_API_KEY
npm run firebase:deploy
```

The `/api/chat` Hosting rewrite sends production requests to the `chat` Cloud
Function, so the key remains server-side after deployment.

### Testing

Violin Mentor ships with comprehensive unit tests with near-perfect business logic coverage.

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test -- --coverage
```

---

<div align="center">
  <i>Built to turn screen time into music time.</i>
</div>
