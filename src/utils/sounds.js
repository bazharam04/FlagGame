// ── Web Audio primitive helpers ──────────────────────────────────────────────

function tone(ctx, freq, start, dur, type = "sine", gain = 0.3) {
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.type            = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

function noise(ctx, start, dur, gain = 0.5, hipass = 0) {
  const bufSize = Math.floor(ctx.sampleRate * dur);
  const buf     = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data    = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const src  = ctx.createBufferSource();
  src.buffer = buf;

  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);

  if (hipass > 0) {
    const hp = ctx.createBiquadFilter();
    hp.type           = "highpass";
    hp.frequency.value = hipass;
    src.connect(hp);
    hp.connect(g);
  } else {
    src.connect(g);
  }
  g.connect(ctx.destination);
  src.start(start);
}

function snare(ctx, time) {
  noise(ctx, time, 0.12, 0.7, 1200);
}

function kick(ctx, time) {
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.15);
  g.gain.setValueAtTime(0.8, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.25);
}

function cymbal(ctx, time) {
  noise(ctx, time, 0.9, 0.5, 5000);
}

// ── Per-milestone sounds ─────────────────────────────────────────────────────

const SOUNDS = {

  // 25 — Happy claps + "Yay!" ascending arpeggio
  25(ctx) {
    const t = ctx.currentTime;
    [0, 0.22, 0.44, 0.66].forEach((dt) => snare(ctx, t + dt));
    [523, 659, 784, 1047].forEach((freq, i) =>
      tone(ctx, freq, t + 0.9 + i * 0.15, 0.4, "sine", 0.3)
    );
  },

  // 50 — Drum roll building to a big cymbal crash
  50(ctx) {
    const t = ctx.currentTime;
    for (let i = 0; i < 14; i++) snare(ctx, t + i * 0.055);
    cymbal(ctx, t + 0.85);
    kick(ctx, t + 0.85);
  },

  // 75 — Rocket whoosh + ascending power sweep
  75(ctx) {
    const t = ctx.currentTime;
    noise(ctx, t, 1.6, 0.35, 300);
    const osc = ctx.createOscillator();
    const g   = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(2400, t + 1.6);
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.65);
    [1047, 1319, 1568].forEach((freq, i) =>
      tone(ctx, freq, t + 1.6 + i * 0.1, 0.35, "sine", 0.2)
    );
  },

  // 100 — Triumphant fanfare: da-da-da-DAAA!
  100(ctx) {
    const t = ctx.currentTime;
    [
      { freq: 523, time: 0,    dur: 0.18 },
      { freq: 523, time: 0.22, dur: 0.18 },
      { freq: 523, time: 0.44, dur: 0.18 },
      { freq: 784, time: 0.68, dur: 0.75 },
    ].forEach(({ freq, time, dur }) => {
      tone(ctx, freq,        t + time, dur, "sawtooth", 0.38);
      tone(ctx, freq * 1.25, t + time, dur, "square",   0.1);
    });
    kick(ctx, t);
    kick(ctx, t + 0.68);
    cymbal(ctx, t + 0.68);
  },

  // 125 — Video-game power-up: notes speed up and shoot high
  125(ctx) {
    const t     = ctx.currentTime;
    const notes = [262, 330, 392, 523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) =>
      tone(ctx, freq, t + i * 0.09, 0.2, "square", 0.28)
    );
  },

  // 150 — Hero march: kick + rising melody
  150(ctx) {
    const t = ctx.currentTime;
    [
      { freq: 392,  time: 0   },
      { freq: 523,  time: 0.3 },
      { freq: 659,  time: 0.6 },
      { freq: 784,  time: 0.9 },
      { freq: 1047, time: 1.2 },
    ].forEach(({ freq, time }) => {
      tone(ctx, freq, t + time, 0.3, "triangle", 0.35);
      kick(ctx, t + time);
    });
  },

  // 175 — Royal trumpet fanfare with bass and cymbal finish
  175(ctx) {
    const t = ctx.currentTime;
    [
      { freq: 523, time: 0,    dur: 0.2  },
      { freq: 659, time: 0.25, dur: 0.2  },
      { freq: 784, time: 0.5,  dur: 0.2  },
      { freq: 659, time: 0.75, dur: 0.15 },
      { freq: 784, time: 0.95, dur: 0.85 },
    ].forEach(({ freq, time, dur }) => {
      tone(ctx, freq,      t + time, dur, "sawtooth", 0.4);
      tone(ctx, freq * 0.5, t + time, dur, "sine",    0.15);
    });
    cymbal(ctx, t + 0.95);
    kick(ctx, t + 0.95);
  },

  // 193 — Grand finale: drum roll → crash → triumphant bells
  193(ctx) {
    const t = ctx.currentTime;
    for (let i = 0; i < 22; i++) snare(ctx, t + i * 0.038);
    cymbal(ctx, t + 0.9);
    kick(ctx, t + 0.9);
    [
      { freq: 523,  time: 1.1 },
      { freq: 659,  time: 1.3 },
      { freq: 784,  time: 1.5 },
      { freq: 1047, time: 1.7 },
      { freq: 1319, time: 1.9 },
    ].forEach(({ freq, time }) => {
      tone(ctx, freq, t + time, 0.25, "sawtooth", 0.4);
    });
    [1047, 1319, 1568, 2093].forEach((freq, i) =>
      tone(ctx, freq, t + 2.1 + i * 0.1, 1.0, "sine", 0.22)
    );
    kick(ctx, t + 1.1);
    kick(ctx, t + 2.1);
    cymbal(ctx, t + 2.1);
  },
};

// ── Public API ───────────────────────────────────────────────────────────────

export function playMilestoneSound(count) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const fn  = SOUNDS[count];
    if (fn) fn(ctx);
    setTimeout(() => ctx.close(), 4500);
  } catch (_) {
    // Web Audio unavailable — skip silently
  }
}
