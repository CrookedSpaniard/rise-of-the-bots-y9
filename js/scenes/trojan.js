FD.add({
  id: 'trojan',
  title: 'Trojans',
  tab: 'Trojans',
  icon: 'trojan',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['trojan', 'software that appears to do something useful but also performs malicious actions without the user knowing'],
    ['back door', 'a hidden way into a computer that lets an attacker control it remotely'],
    ['remote access', 'controlling a computer from somewhere else, over a network'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim tj">
        <div class="tj-cols">
          <div class="win tj-see" data-zone="see">
            <div class="win-bar">What you see</div>
            <div class="win-body">
              <div class="tj-dl" id="dl">
                <p class="tj-game">🏎️ <b>Turbo Kart 3</b><small>FREE download · ★★★★★</small></p>
                <button class="btn small-btn primary" id="inst">⬇ Install</button>
              </div>
              <div class="tj-play" id="play" hidden>
                <div class="tj-track"><span class="tj-car" id="car">🏎️</span><span class="tj-flag">🏁</span></div>
                <p class="tj-ok">✓ Installed. The game works. Have fun!</p>
              </div>
            </div>
          </div>
          <div class="win tj-real" data-zone="real">
            <div class="win-bar">What really happens</div>
            <div class="win-body">
              <ul class="tj-log" id="log"></ul>
            </div>
          </div>
        </div>
        <div class="tj-horse" data-zone="horse" hidden>
          <svg viewBox="0 0 260 150" role="img" aria-label="A wooden horse on wheels with soldiers hidden inside">
            <rect class="tj-wood" x="60" y="58" width="130" height="46" rx="10"/>
            <path class="tj-wood" d="M170 62 L196 20 L224 20 L230 34 L206 40 L190 70 Z"/>
            <rect class="tj-wood" x="70" y="100" width="12" height="28"/><rect class="tj-wood" x="168" y="100" width="12" height="28"/>
            <rect class="tj-base" x="50" y="126" width="146" height="8" rx="3"/>
            <circle class="tj-wheel" cx="66" cy="138" r="8"/><circle class="tj-wheel" cx="180" cy="138" r="8"/>
            <g class="tj-hide"><rect class="tj-door" x="96" y="66" width="56" height="30" rx="4"/><text x="109" y="88" style="font-size:16px">🪖🪖</text></g>
          </svg>
          <p class="note">A gift on the outside… soldiers hidden on the inside.</p>
        </div>
        <div class="ctrls"><button class="btn ghost small-btn" id="reset">↺ Reset</button></div>
      </div>`;
    const root = el.querySelector('.tj'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0;
    const LOG = [
      ['ok', '⚙️ Installing Turbo Kart 3…'],
      ['bad', '🕳️ Hidden: opening a back door on the computer'],
      ['bad', '📡 Hidden: attacker connected remotely'],
      ['bad', '📂 Hidden: attacker browsing Documents and Photos'],
      ['bad', '📤 Hidden: copying files to the attacker'],
    ];
    function reset() {
      run++;
      $('#dl').hidden = false; $('#play').hidden = true; $('#log').innerHTML = '<li class="muted">Nothing yet.</li>';
      $('#car').style.left = '0%';
    }
    async function install() {
      reset();
      const id = run;
      $('#log').innerHTML = '';
      for (let i = 0; i < LOG.length; i++) {
        if (i === 1) { $('#dl').hidden = true; $('#play').hidden = false; }
        $('#log').appendChild(FD.h(`<li class="${LOG[i][0]}">${LOG[i][1]}</li>`));
        if (i === 1) FD.tween(4000, (t) => { if (id === run) $('#car').style.left = (t * 82) + '%'; });
        await FD.wait(900);
        if (dead || id !== run) return;
      }
    }
    $('#inst').addEventListener('click', install);
    $('#reset').addEventListener('click', reset);
    reset();
    return {
      reset, install,
      horse: (on) => { $('.tj-horse').hidden = !on; root.querySelector('.tj-cols').hidden = on; },
      focus: (z) => FD.focus(root, z),
      destroy() { dead = true; run++; },
    };
  },
  steps: [
    {
      title: 'Looks useful…',
      text: `<p>A <strong>trojan</strong> is a piece of software that <strong>appears to perform a useful function</strong>, such as a game.</p>
             <p>This free game looks great. Why not install it?</p>`,
      tip: 'Try it: press Install and watch both windows.',
      on: (a) => { a.horse(false); a.reset(); a.focus('see'); },
    },
    {
      title: '…but does something else',
      text: `<p>Unknown to the user, it <strong>also performs malicious actions</strong>.</p>
             <p>The game really works, so the user suspects nothing. Look at the right-hand window.</p>`,
      async on(a) { a.horse(false); a.focus(); await a.install(); },
    },
    {
      title: 'A back door',
      text: `<p>For example, it might open a <strong>back door</strong> to give an attacker <strong>remote access</strong> to your computer.</p>
             <p>The attacker can then look at, copy or delete your files.</p>`,
      async on(a) { a.horse(false); a.focus('real'); await a.install(); },
    },
    {
      title: 'Why “trojan”?',
      text: `<p>The name comes from the story of the <strong>Trojan Horse</strong>.</p>
             <p>The Greeks gave the city of Troy a huge wooden horse as a “gift”. Soldiers were hiding inside. At night they came out and opened the city gates.</p>`,
      tip: 'Unlike a virus or a worm, a trojan usually does not replicate itself: the user installs it.',
      on: (a) => { a.horse(true); a.focus(); },
    },
  ],
});

FD.check({
  section: 'trojan',
  items: [
    { type: 'mcq', q: 'What is a trojan?', opts: ['Software that seems useful but also performs hidden malicious actions', 'Malware that spreads through the network on its own', 'Software that only shows adverts', 'A bot that finds new websites'], why: 'Like the wooden horse: a gift on the outside, attackers on the inside.' },
    { type: 'mcq', q: 'A trojan opens a <b>back door</b>. What does that allow?', opts: ['An attacker can access the computer remotely', 'The computer runs faster', 'The user gets free updates', 'Files are backed up automatically'], why: 'Remote access lets the attacker control the computer from somewhere else.' },
  ],
});
