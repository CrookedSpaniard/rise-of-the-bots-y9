FD.add({
  id: 'spyware',
  title: 'Spyware and keyloggers',
  tab: 'Spyware',
  icon: 'spyware',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['spyware', 'unwanted software that monitors and gathers information on a person and how they use their computer'],
    ['keylogger', 'spyware that records every keystroke a user makes'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim sp">
        <div class="sp-cols">
          <div class="win" data-zone="form">
            <div class="win-bar">schoolportal.example · Log in</div>
            <div class="win-body sp-form">
              <label>Username<input type="text" id="u" autocomplete="off" spellcheck="false" placeholder="type here"></label>
              <label>Password<input type="password" id="p" autocomplete="off" placeholder="made-up password"></label>
              <button class="btn small-btn primary" id="login" type="button">Log in</button>
              <p class="note">Masked with dots… so it is safe, isn’t it?</p>
            </div>
          </div>
          <div class="sp-spy" data-zone="log">
            <p class="sp-h">🕵️ Hidden keylogger · sending to the attacker</p>
            <div class="cli sp-log" id="log"></div>
          </div>
        </div>
        <div class="sim-box sp-web" data-zone="web">
          <p class="mal-h">Spyware also watches your internet use</p>
          <div class="sp-hist" id="hist"></div>
        </div>
        <div class="cards3 sp-use" data-zone="use" hidden>
          <div class="mini" style="--c:var(--c5)"><h5>🔑 Log in as you</h5><p>Read your messages, post as you, change your password.</p></div>
          <div class="mini" style="--c:var(--c5)"><h5>💳 Steal money</h5><p>Use bank or card details to buy things or move money.</p></div>
          <div class="mini" style="--c:var(--c5)"><h5>🪪 Identity theft</h5><p>Pretend to be you to open accounts or borrow money.</p></div>
          <div class="mini" style="--c:var(--c5)"><h5>💰 Sell or blackmail</h5><p>Sell your data to other criminals, or threaten to publish it.</p></div>
        </div>
        <div class="ctrls"><button class="btn ghost small-btn" id="reset">↺ Reset</button><p class="note">Never type a real password here.</p></div>
      </div>`;
    const root = el.querySelector('.sp'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0;
    const log = $('#log');
    const line = (html) => { log.appendChild(FD.h(`<div>${html}</div>`)); log.scrollTop = log.scrollHeight; };
    let cur = '';
    function key(field, ch) {
      if (cur !== field) { cur = field; line(`<span class="p">[${field}]</span> `); }
      log.lastElementChild.insertAdjacentText('beforeend', ch);
      log.scrollTop = log.scrollHeight;
    }
    function reset() {
      run++; cur = '';
      $('#u').value = ''; $('#p').value = '';
      log.innerHTML = '<div class="p">Waiting for keystrokes…</div>';
      $('#hist').innerHTML = '';
    }
    ['u', 'p'].forEach((f) => $('#' + f).addEventListener('keydown', (e) => {
      const name = f === 'u' ? 'username' : 'password';
      if (e.key.length === 1) key(name, e.key);
      else if (e.key === 'Backspace') key(name, '⌫');
      else if (e.key === 'Enter') { line('<span class="e">[enter] → login details captured!</span>'); cur = ''; }
    }));
    $('#login').addEventListener('click', () => { line('<span class="e">[click] Log in → login details captured!</span>'); cur = ''; });
    async function demo() {
      reset();
      const id = run;
      for (const [f, name, text] of [['u', 'username', 'sam.taylor'], ['p', 'password', 'Sunflower22']]) {
        for (const ch of text) {
          $('#' + f).value += ch;
          key(name, ch);
          await FD.wait(110);
          if (dead || id !== run) return;
        }
        await FD.wait(300);
      }
      line('<span class="e">[click] Log in → login details captured!</span>');
      cur = '';
    }
    async function web() {
      const id = run;
      $('#hist').innerHTML = '';
      const H = [['🔍', 'searched “cheap trainers size 6”'], ['🛒', 'visited sportshop.example'], ['🎮', 'watched a gaming video'], ['📢', 'Advert shown: “Trainers 50% off!”']];
      for (const [e, t] of H) {
        $('#hist').appendChild(FD.h(`<span class="sp-h-i">${e} ${t}</span>`));
        await FD.wait(500);
        if (dead || id !== run) return;
      }
    }
    $('#reset').addEventListener('click', reset);
    reset();
    return {
      reset, demo, web,
      use: (on) => { $('.sp-use').hidden = !on; },
      focus: (z) => FD.focus(root, z),
      destroy() { dead = true; run++; },
    };
  },
  steps: [
    {
      title: 'What is spyware?',
      text: `<p><strong>Spyware</strong> is unwanted software that <strong>monitors and gathers information</strong> on a person and how they use their computer.</p>`,
      on: (a) => { a.reset(); a.use(false); a.focus('web'); a.web(); },
    },
    {
      title: 'Watching what you do online',
      text: `<p>Some spyware monitors your <strong>internet usage</strong> to send you <strong>harmless but annoying adverts</strong>.</p>
             <p>It knows what you searched for, so the adverts follow you around.</p>`,
      async on(a) { a.use(false); a.focus('web'); await a.web(); },
    },
    {
      title: 'Keyloggers',
      text: `<p>More sinister spyware includes <strong>keyloggers</strong> that record <strong>every keystroke</strong> a user makes.</p>
             <p>The password is masked on the screen, but the keylogger sees every letter.</p>`,
      tip: 'Try it: type a made-up username and password and watch the black box.',
      async on(a) { a.use(false); a.focus(['form', 'log']); await a.demo(); },
    },
    {
      title: 'What could a criminal do with this data?',
      text: `<p>Think, then discuss with your partner.</p>
             <p>With your usernames, passwords and browsing history, a criminal could…</p>`,
      on: (a) => { a.use(true); a.focus('use'); },
    },
  ],
});

FD.check({
  section: 'spyware',
  items: [
    { type: 'mcq', q: 'What does a keylogger do?', opts: ['Records every keystroke a user makes', 'Encrypts all the files on a computer', 'Slows down the network', 'Shows pop-up adverts when you are offline'], why: 'Including passwords, even when they are masked with dots.' },
    { type: 'tf', q: 'Spyware gathers information about a person and how they use their computer.', a: true, why: 'From browsing habits (for adverts) to passwords (with a keylogger).' },
  ],
});
