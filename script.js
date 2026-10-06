// ---------- 1. Morse mapping ----------
const MORSE = {
  A: ".-",    B: "-...",  C: "-.-.",  D: "-..",   E: ".",     F: "..-.",
  G: "--.",   H: "....",  I: "..",    J: ".---",  K: "-.-",   L: ".-..",
  M: "--",    N: "-.",    O: "---",   P: ".--.",  Q: "--.-",  R: ".-.",
  S: "...",   T: "-",     U: "..-",   V: "...-",  W: ".--",   X: "-..-",
  Y: "-.--",  Z: "--..",
  0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-",
  5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "!": "-.-.--",
  "'": ".----.", "/": "-..-.", "@": ".--.-.", ":": "---...", "-": "-....-"
};

// Build the reverse lookup (Morse -> character) with a loop,
// so the mapping is only written once.
const REVERSE = {};
for (const char in MORSE) {
  REVERSE[MORSE[char]] = char;
}

// ---------- 2. DOM references ----------
const inputEl = document.getElementById("input-text");
const outputEl = document.getElementById("output-text");
const messageEl = document.getElementById("message");
const countEl = document.getElementById("char-count");
const fromLabel = document.getElementById("from-label");
const toLabel = document.getElementById("to-label");
const inputHeading = document.getElementById("input-heading");
const outputHeading = document.getElementById("output-heading");
const swapBtn = document.getElementById("swap-btn");
const translateBtn = document.getElementById("translate-btn");
const clearBtn = document.getElementById("clear-btn");
const copyBtn = document.getElementById("copy-btn");
const playBtn = document.getElementById("play-btn");
const wpmEl = document.getElementById("wpm");
const wpmValue = document.getElementById("wpm-value");
const lamp = document.getElementById("lamp");

// ---------- 3. App state ----------
let direction = "textToMorse"; // or "morseToText"

// ---------- 4. Translation logic ----------
function textToMorse(text) {
  const words = text.trim().toUpperCase().split(/\s+/);
  const unsupported = [];
  const morseWords = [];

  for (const word of words) {
    const letters = [];
    for (const ch of word) {
      if (MORSE[ch]) {
        letters.push(MORSE[ch]);
      } else if (!unsupported.includes(ch)) {
        unsupported.push(ch);
      }
    }
    if (letters.length > 0) morseWords.push(letters.join(" "));
  }

  return { result: morseWords.join(" / "), unsupported };
}

function morseToText(morse) {
  // allow people to paste the prettier · and – symbols
  const cleaned = morse.replace(/[·•]/g, ".").replace(/[–—−]/g, "-").trim();

  const invalidChars = cleaned.match(/[^.\-\/\s]/g);
  if (invalidChars) {
    return { result: "", unsupported: [...new Set(invalidChars)] };
  }

  const words = cleaned.split(/\s*\/\s*|\n+/);
  const unsupported = [];
  const textWords = [];

  for (const word of words) {
    const codes = word.trim().split(/\s+/).filter(code => code !== "");
    let text = "";
    for (const code of codes) {
      if (REVERSE[code]) {
        text += REVERSE[code];
      } else {
        unsupported.push(code);
      }
    }
    if (text) textWords.push(text);
  }

  return { result: textWords.join(" "), unsupported };
}

// ---------- 5. UI helpers ----------
function showMessage(text, isOk = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle("ok", isOk);
}

function updateCount() {
  const n = inputEl.value.length;
  countEl.textContent = n + (n === 1 ? " character" : " characters");
}

function translate() {
  const value = inputEl.value;

  if (value.trim() === "") {
    outputEl.value = "";
    showMessage("");
    return;
  }

  const { result, unsupported } =
    direction === "textToMorse" ? textToMorse(value) : morseToText(value);

  outputEl.value = result;

  if (unsupported.length > 0) {
    const label = direction === "textToMorse" ? "Skipped unsupported characters" : "Unrecognised Morse";
    showMessage(label + ": " + unsupported.join("  "));
  } else {
    showMessage("");
  }
}

function updateLabels() {
  const isText = direction === "textToMorse";
  fromLabel.textContent = isText ? "Text" : "Morse";
  toLabel.textContent = isText ? "Morse" : "Text";
  inputHeading.textContent = isText ? "Type your message" : "Enter Morse code";
  outputHeading.textContent = isText ? "Morse code" : "Text";
  inputEl.placeholder = isText ? "Hello world" : ".... . .-.. .-.. --- / .-- --- .-. .-.. -..";
}

function swapDirection() {
  direction = direction === "textToMorse" ? "morseToText" : "textToMorse";
  swapBtn.classList.toggle("flipped");
  // the old result becomes the new input
  const previousOutput = outputEl.value;
  inputEl.value = previousOutput;
  updateLabels();
  updateCount();
  translate();
}

function clearAll() {
  inputEl.value = "";
  outputEl.value = "";
  showMessage("");
  updateCount();
  stopSignal();
  inputEl.focus();
}

async function copyResult() {
  if (outputEl.value === "") {
    showMessage("Nothing to copy yet.");
    return;
  }
  try {
    await navigator.clipboard.writeText(outputEl.value);
    showMessage("Copied to clipboard.", true);
  } catch (err) {
    outputEl.select();
    showMessage("Press Ctrl+C to copy the selected text.");
  }
}

// ---------- 6. Audio + lamp ----------
let audioCtx = null;
let playing = false;
let timers = [];

function stopSignal() {
  playing = false;
  timers.forEach(clearTimeout);
  timers = [];
  lamp.classList.remove("on");
  playBtn.textContent = "Play signal";
}

function playSignal() {
  if (playing) {
    stopSignal();
    return;
  }

  // play whichever box currently holds Morse
  const morse = direction === "textToMorse" ? outputEl.value : inputEl.value;
  if (morse.trim() === "" || /[^.\-\/\s]/.test(morse)) {
    showMessage("Translate some text to Morse first.");
    return;
  }

  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const unit = 1.2 / Number(wpmEl.value); // seconds per dot
  let t = audioCtx.currentTime + 0.1;
  let ms = 100;
  playing = true;
  playBtn.textContent = "Stop";

  const beep = (length) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 650;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.005);
    gain.gain.setValueAtTime(0.3, t + length - 0.005);
    gain.gain.linearRampToValueAtTime(0, t + length);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + length);

    timers.push(setTimeout(() => lamp.classList.add("on"), ms));
    timers.push(setTimeout(() => lamp.classList.remove("on"), ms + length * 1000));
  };

  for (const symbol of morse.trim()) {
    if (symbol === "." || symbol === "-") {
      const length = symbol === "." ? unit : unit * 3;
      beep(length);
      t += length + unit;           // symbol + gap between symbols
      ms += (length + unit) * 1000;
    } else if (symbol === " ") {
      t += unit * 2;                // total 3 units between letters
      ms += unit * 2000;
    } else if (symbol === "/") {
      t += unit * 4;                // total ~7 units between words
      ms += unit * 4000;
    }
  }

  timers.push(setTimeout(stopSignal, ms + 100));
}

// ---------- 7. Event listeners ----------
inputEl.addEventListener("input", () => { updateCount(); translate(); });
translateBtn.addEventListener("click", translate);
clearBtn.addEventListener("click", clearAll);
copyBtn.addEventListener("click", copyResult);
swapBtn.addEventListener("click", swapDirection);
playBtn.addEventListener("click", playSignal);
wpmEl.addEventListener("input", () => { wpmValue.textContent = wpmEl.value + " WPM"; });

// ---------- 8. Init ----------
updateLabels();
updateCount();