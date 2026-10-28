FD.add({
  id: 'adware',
  title: 'Adware',
  tab: 'Adware',
  icon: 'adware',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['adware', 'malware that downloads or displays unwanted, often malicious, adverts or pop-ups'],
    ['pop-up', 'a small window that suddenly appears on top of what you are looking at'],
  ],
  mount(el) {
    const ADS = ['🎁 You WON a new phone! Click to claim', '🔥 Trainers 90% off, today only', '⚠️ Your PC is slow! Download Cleaner', '💸 Earn £500 a day from home', '🎰 Spin the wheel: FREE prize', '📱 Your phone has 3 viruses!'];
    el.innerHTML = `
      <div class="sim ad">
        <div class="win ad-win" data-zone="browser">
          <div class="win-bar"><span>news.example · Football scores</span><span class="ad-net" id="net">📶 Online</span></div>
          <div class="win-body ad-body" id="body">
            <p class="ad-art"><b>Match report:</b> Alzira won 3–1 in a fast and exciting game. The second goal came from a brilliant free kick…</p>
            <p class="ad-art muted">▬▬▬▬▬▬▬▬ ▬▬▬▬ ▬▬▬▬▬▬ ▬▬▬▬▬▬▬▬▬▬ ▬▬▬▬▬</p>
            <p class="ad-art muted">▬▬▬▬▬ ▬▬▬▬▬▬▬▬▬ ▬▬▬▬ ▬▬▬▬▬▬▬▬ ▬▬▬</p>
          </div>
        </div>
        <div class="ad-side">
          <div class="readout"><div class="ro" id="roN"><small>Pop-ups on screen</small><b id="n">0</b></div><div class="ro"><small>Closed by you</small><b id="c">0</b></div></div>
          <div class="chips ad-forms" data-zone="forms">
            <span class="ad-f">Adware can be a…</span>
            <button class="tg" data-go="worm">🐛 worm</button><button class="tg" data-go="virus">🦠 virus</button><button class="tg" data-go="trojan">🐴 trojan</button>
          </div>
        </div>
        <div class="ctrls">
          <button class="btn small-btn" id="go">📢 Infect with adware</button>
          <button class="btn small-btn" id="wifi">📴 Go offline</button>
          <button class="btn ghost small-btn" id="reset">↺ Reset</button>
          <p class="note">Close the pop-ups with ✕. Never click on the advert itself.</p>
        </div>
      </div>`;
    const root = el.querySelector('.ad'), $ = (s) => root.querySelector(s);
    let dead = false, timer = null, k = 0, closed = 0, offline = false;
    const count = () => { const n = root.querySelectorAll('.ad-pop').length; $('#n').textContent = n; $('#roN').classList.toggle('bad', n >= 3); $('#c').textContent = closed; };
    function pop() {
      const body = $('#body');
      if (root.querySelectorAll('.ad-pop').length >= 6) return;
      const p = FD.h(`<div class="ad-pop" style="left:${4 + (k * 17) % 46}%;top:${6 + (k * 23) % 52}%"><button class="ad-x" aria-label="Close advert">✕</button><span>${ADS[k % ADS.length]}</span></div>`);
      k++;
      p.querySelector('.ad-x').addEventListener('click', () => { p.remove(); closed++; count(); });
      p.querySelector('span').addEventListener('click', () => FD.toast(body, 'Clicking the advert itself could download more malware!'));
      body.appendChild(p);
      count();
    }
    function start() { clearInterval(timer); pop(); timer = setInterval(() => { if (!dead) pop(); }, FD.dur(1300)); }
    function setOffline(on) { offline = on; $('#net').textContent = on ? '📴 Offline' : '📶 Online'; $('#net').classList.toggle('off', on); $('#wifi').textContent = on ? '📶 Go online' : '📴 Go offline'; }
    function reset() { clearInterval(timer); root.querySelectorAll('.ad-pop').forEach((p) => p.remove()); k = 0; closed = 0; setOffline(false); count(); }
    $('#go').addEventListener('click', start);
    $('#wifi').addEventListener('click', () => setOffline(!offline));
    $('#reset').addEventListener('click', reset);
    root.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
    count();
    return { reset, start, setOffline, focus: (z) => FD.focus(root, z), destroy() { dead = true; clearInterval(timer); } };
  },
  steps: [
    {
      title: 'What is adware?',
      text: `<p><strong>Adware</strong> infects a computer and causes it to <strong>download or display malicious adverts or pop-ups</strong> when the victim is online.</p>`,
      tip: 'Try it: infect the browser, then close the pop-ups as fast as you can.',
      on: (a) => { a.reset(); a.focus('browser'); a.start(); },
    },
    {
      title: 'Warning signs',
      text: `<p>If you are online and see a <strong>large number of adverts</strong>…</p>
             <p>…or you get <strong>pop-ups while you are offline</strong>, then your computer might be infected by malware.</p>`,
      tip: 'Go offline: the pop-ups keep coming!',
      async on(a) { a.focus('browser'); a.start(); await FD.wait(1500); a.setOffline(true); },
    },
    {
      title: 'Worm, virus or trojan',
      text: `<p>Adware is not a separate way of spreading: it can arrive as a <strong>worm</strong>, a <strong>virus</strong> or a <strong>trojan</strong>.</p>
             <p>What makes it adware is what it <em>does</em>: the adverts.</p>`,
      on: (a) => { a.focus('forms'); },
    },
  ],
});

FD.check({
  section: 'adware',
  items: [
    { type: 'mcq', q: 'Which sign suggests that a computer may have adware?', opts: ['Pop-ups appear even when the computer is offline', 'The computer asks for a software update', 'A website shows a padlock in the address bar', 'The battery is low'], why: 'Lots of adverts online, or pop-ups offline, are warning signs.' },
    { type: 'tf', q: 'Adware can be a worm, a virus or a trojan.', a: true, why: 'Adware is defined by what it does (adverts), not by how it spreads.' },
  ],
});
