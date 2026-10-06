# Signal Station: Morse Code Translator

[Live Demo](https://dotanddash-puce.vercel.app/)

Signal Station is a browser-based, two-way Morse code translator that converts **text to Morse code** and **Morse code to text**.

The project is built from scratch using HTML, CSS, and vanilla JavaScript, without frameworks, external APIs, or translation libraries. It also includes Morse signal playback using the Web Audio API and a visual signal lamp synchronized with the audio.

## Features

- Two-way translation between text and Morse code
- Swap between translation directions
- Live translation while typing
- Manual translation with a Translate button
- Copy translated output to the clipboard
- Clear input and output
- Input character counter
- Input validation and error messages
- Morse signal audio playback
- Adjustable playback speed from 5–30 WPM
- Signal lamp synchronized with Morse audio
- Responsive design for desktop, tablet, and mobile

## How to Use

### Text to Morse

Enter text into the input area. The corresponding Morse code will be generated automatically.

Example:

```text
HELLO WORLD
```

becomes:

```text
.... . .-.. .-.. --- / .-- --- .-. .-.. -..
```

### Morse to Text

Use the swap button to change the translation direction, then enter Morse code.

- Separate letters with spaces.
- Separate words with `/`.

Example:

```text
.... . .-.. .-.. --- / .-- --- .-. .-.. -..
```

produces:

```text
HELLO WORLD
```

The translator also accepts the symbols `·` and `–` and converts them to standard Morse notation (`.` and `-`).

### Playing Morse Signals

Use **Play Signal** to hear the Morse output as an audio signal.

The speed can be adjusted using the WPM slider. The signal lamp provides a visual representation of the Morse signal while it plays.

## Supported Characters

The translator supports:

- Letters: `A–Z`
- Numbers: `0–9`
- Punctuation: `. , ? ! ' / @ : -`

The translator validates unsupported characters and unrecognised Morse sequences and provides an appropriate message to the user.

## How It Works

### Text to Morse

1. The input is converted to uppercase.
2. The text is divided into words and characters.
3. Each supported character is matched with its Morse representation using the `MORSE` mapping.
4. Letters are separated by spaces and words by `/`.
5. Unsupported characters are identified and reported.

### Morse to Text

1. Morse input is normalised so that `·` becomes `.` and `–` becomes `-`.
2. The input is validated to ensure it contains valid Morse characters and separators.
3. Words are separated using `/`.
4. Individual Morse characters are separated using spaces.
5. Each Morse sequence is matched with its corresponding character using a reverse mapping.
6. Unrecognised Morse sequences are reported to the user.

### Audio Playback

Morse signals are generated directly in the browser using the **Web Audio API**.

The timing follows standard Morse-code spacing:

- Dot: 1 unit
- Dash: 3 units
- Gap between symbols: 1 unit
- Gap between letters: 3 units
- Gap between words: 7 units

Playback speed is controlled using Words Per Minute (WPM).

## Project Structure

```text
signal-station/
│
├── index.html      # Page structure
├── style.css       # Styling, layout, and responsive design
├── script.js       # Translation logic, UI interactions, and audio
└── README.md       # Project documentation
```

## Tech Stack

- HTML5
- CSS3
  - Flexbox
  - CSS custom properties
  - Media queries
- JavaScript (ES6+)
- DOM API
- Web Audio API
- Clipboard API
- Google Fonts

## Running Locally

No build tools or dependencies are required.

Clone the repository:

```bash
git clone https://github.com/vaishnavigopika/morsedecode.git
```

Navigate to the project directory:

```bash
cd signal-station
```

Open `index.html` directly in a browser, or use a local development server such as the VS Code Live Server extension.

## Deployment

Signal Station is a static web application and can be deployed using services such as GitHub Pages, Netlify, or Vercel.

The project requires no backend or server-side processing.

## Roadmap

Future improvements may include:

- Telegraph key mode
- Morse-code practice mode
- Light/dark theme
- Expanded character and prosign support
- Keyboard-based Morse input

## Author

**P. Gopika Vaishnavi**

[GitHub](https://github.com/vaishnavigopika)