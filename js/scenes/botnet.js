FD.add({
  id: 'botnet',
  title: 'When bots go bad: botnets and DDoS',
  tab: 'Botnets',
  icon: 'botnet',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['botnet', 'a large collection of malware-infected devices (zombies) controlled by an attacker'],
    ['bot herder', 'the attacker who controls a botnet'],
    ['DDoS', 'Distributed Denial of Service: many devices flood one server with requests so real users cannot use it'],
    ['vulnerability', 'a weakness that an attacker can use'],
  ],
  mount(el) {
    const DEV = [['📷', 'Camera'], ['🧊', 'Smart fridge'], ['📡', 'Router'], ['🔊', 'Smart speaker'], ['👶', 'Baby monitor'], ['💡', 'Smart bulb']];
    const VULN = [0, 2, 4];
    const Z = [[40, 30], [40, 100], [40, 170], [40, 240], [150, 30], [150, 240], [150, 100], [150, 170]];
    const SRV = [430, 135];
    el.innerHTML = `
      <div class="sim bn">
        <div class="ptabs" role="group" aria-label="Bad bots">
          <button data-p="fake">👥 Fake followers</button><button data-p="scan">🔎 Scanning devices</button><button data-p="ddos">🧟 Botnet and DDoS</button>
        </div>

        <div data-panel="fake" class="sim">
          <div class="bn-prof">
            <span class="av big" style="--av:var(--c3)">JP</span>
            <div><b>@just_a_person</b><p class="note">Posts opinions about everything</p></div>
            <div class="ro"><small>Followers</small><b id="fol">120</b></div>
          </div>
          <div class="bn-crowd" id="crowd"></div>
          <div class="meter"><span class="meter-l">Looks influential</span><span class="bar"><i id="infl"></i></span></div>
          <div class="ctrls"><button class="btn small-btn" id="addBots">🤖 Add 50,000 bot followers</button></div>
        </div>

        <div data-panel="scan" class="sim" hidden>
          <div class="bn-devs">${DEV.map(([e, n], i) => `<div class="bn-dev" data-i="${i}"><span>${e}</span><b>${n}</b><small>not checked</small></div>`).join('')}</div>
          <div class="cli" id="scanLog"></div>
          <div class="ctrls"><button class="btn small-btn" id="scan">🔎 Run the scanning bot</button></div>
        </div>

        <div data-panel="ddos" class="sim" hidden>
          <div class="bn-net">
            <svg viewBox="0 0 520 300" class="bn-svg" role="img" aria-label="A bot herder controls zombie devices that all send requests to one server">
              ${Z.map(([x, y], i) => `<line class="bn-req" data-i="${i}" x1="${x + 30}" y1="${y + 20}" x2="${SRV[0]}" y2="${SRV[1]}"/>`).join('')}
              <line class="bn-user" id="userLine" x1="288" y1="246" x2="${SRV[0]}" y2="${SRV[1] + 20}"/>
              ${Z.map(([x, y], i) => `<g class="bn-z" data-i="${i}">${FD.dv.laptop(x, y - 4)}<text class="bn-ze" x="${x + 54}" y="${y}">🧟</text></g>`).join('')}
              <g transform="translate(250 6)"><circle class="bn-herd" cx="20" cy="20" r="20"/><text class="emo" x="20" y="21" style="font-size:22px">😈</text><text class="svg-sm" x="20" y="54">bot herder</text></g>
              <g class="bn-srv" id="srv">${FD.dv.server(SRV[0] - 30, SRV[1] - 23)}<text class="svg-lbl" x="${SRV[0]}" y="${SRV[1] + 42}">Shop server</text></g>
              <g transform="translate(262 262)"><text style="font-size:22px">🙋</text><text class="svg-sm" x="12" y="20">real customer</text></g>
            </svg>
          </div>
          <div class="bn-side">
            <div class="meter"><span class="meter-l">Server load</span><span class="bar bn-load"><i id="load"></i></span></div>
            <p class="verdict" id="srvMsg"></p>
            <div class="bn-q" id="q" hidden>
              <p><b>What is the correct name for this type of attack?</b></p>
              <button class="btn small-btn" id="reveal">Show the answer</button>
              <p class="bn-a" id="ans" hidden><b>DDoS</b>: <b>D</b>istributed <b>D</b>enial <b>o</b>f <b>S</b>ervice. Many devices (distributed) flood one server, so it cannot serve real users (denial of service).</p>
            </div>
          </div>
          <div class="ctrls">
            <button class="btn small-btn" id="infect">🦠 Infect devices</button>
            <button class="btn small-btn" id="wake">⏰ Wake the zombies</button>
            <button class="btn ghost small-btn" id="r3">↺ Reset</button>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.bn'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0, wakeT = null;

    // fake followers
    function resetFake() { run++; $('#fol').textContent = '120'; $('#crowd').innerHTML = '🧑‍🦱 🧑 👩'; $('#infl').style.setProperty('--v', '5%'); }
    async function addBots() {
      resetFake();
      const id = run;
      await FD.tween(1800, (t) => {
        if (id !== run) return;
        $('#fol').textContent = FD.fmt(120 + t * 50000);
        $('#infl').style.setProperty('--v', (5 + t * 95) + '%');
        const n = Math.round(t * 40);
        if ($('#crowd').childElementCount < n) $('#crowd').appendChild(FD.h('<span>🤖</span>'));
      });
    }
    $('#addBots').addEventListener('click', addBots);

    // scanning
    function resetScan() {
      run++;
      root.querySelectorAll('.bn-dev').forEach((d) => { d.classList.remove('cur', 'ok', 'bad'); d.querySelector('small').textContent = 'not checked'; });
      $('#scanLog').innerHTML = '<span class="p">scanner-bot ready</span>';
    }
    async function scan() {
      resetScan();
      const id = run;
      for (const d of root.querySelectorAll('.bn-dev')) {
        d.classList.add('cur');
        await FD.wait(500);
        if (dead || id !== run) return;
        d.classList.remove('cur');
        const bad = VULN.includes(+d.dataset.i);
        d.classList.add(bad ? 'bad' : 'ok');
        d.querySelector('small').textContent = bad ? '⚠️ default password' : '✓ updated';
        $('#scanLog').insertAdjacentHTML('beforeend', `\n${bad ? `<span class="e">VULNERABLE: ${d.querySelector('b').textContent} still uses password "admin" → reported</span>` : `${d.querySelector('b').textContent}: no weakness found`}`);
        $('#scanLog').scrollTop = 1e6;
      }
    }
    $('#scan').addEventListener('click', scan);

    // botnet + DDoS
    const zs = [...root.querySelectorAll('.bn-z')], reqs = [...root.querySelectorAll('.bn-req')];
    function resetDdos() {
      run++; clearInterval(wakeT);
      zs.forEach((z) => z.classList.remove('inf'));
      reqs.forEach((r) => r.classList.remove('on'));
      $('#load').style.setProperty('--v', '8%');
      $('#srv').classList.remove('down');
      $('#userLine').classList.remove('fail');
      $('#srvMsg').textContent = ''; $('#srvMsg').className = 'verdict';
      $('#q').hidden = true; $('#ans').hidden = true;
    }
    async function infect() {
      resetDdos();
      const id = run;
      for (const z of zs) { z.classList.add('inf'); await FD.wait(220); if (dead || id !== run) return; }
      $('#srvMsg').textContent = '🧟 8 zombies, sleeping… waiting for the bot herder.';
    }
    async function wake() {
      if (!zs[0].classList.contains('inf')) await infect();
      const id2 = run;
      $('#srvMsg').textContent = '';
      for (let i = 0; i < reqs.length; i++) {
        reqs[i].classList.add('on');
        $('#load').style.setProperty('--v', Math.min(100, 8 + (i + 1) * 12) + '%');
        await FD.wait(250);
        if (dead || id2 !== run) return;
      }
      $('#srv').classList.add('down');
      $('#userLine').classList.add('fail');
      $('#srvMsg').textContent = '503 · Service unavailable. The real customer cannot get in.';
      $('#srvMsg').classList.add('bad');
      $('#q').hidden = false;
    }
    $('#infect').addEventListener('click', infect);
    $('#wake').addEventListener('click', wake);
    $('#r3').addEventListener('click', resetDdos);
    $('#reveal').addEventListener('click', () => { $('#ans').hidden = false; });

    const show = FD.panels(root);
    resetFake(); resetScan(); resetDdos();
    show('fake');
    return {
      show, addBots, scan, infect, wake, resetDdos,
      answer: () => { $('#q').hidden = false; $('#ans').hidden = false; },
      destroy() { dead = true; run++; clearInterval(wakeT); },
    };
  },
  steps: [
    {
      title: 'When bots go bad',
      text: `<p>Many of the bots circulating the web have <strong>malicious intent</strong>.</p>
             <p>Bots can create social media accounts and <strong>follow certain users</strong> to increase people’s <strong>perception of their influence</strong>.</p>`,
      tip: 'Would you trust someone more because they have 50,000 followers?',
      async on(a) { a.show('fake'); await a.addBots(); },
    },
    {
      title: 'Looking for weaknesses',
      text: `<p>Bots can also <strong>scour the web</strong> to look for, and report back on, <strong>vulnerabilities</strong> of internet-connected devices.</p>
             <p>Cameras, routers and baby monitors that still use their default password are easy targets.</p>`,
      async on(a) { a.show('scan'); await a.scan(); },
    },
    {
      title: 'Botnets',
      text: `<p>A <strong>botnet</strong> is a large collection of <strong>malware-infected devices</strong>, called <strong>zombies</strong>.</p>
             <p>The owners usually have no idea that their device is part of a botnet.</p>`,
      async on(a) { a.show('ddos'); await a.infect(); },
    },
    {
      title: 'Waking the zombies',
      text: `<p>An attacker, the <strong>bot herder</strong>, chooses when to <strong>wake the zombies</strong> to perform an attack.</p>
             <p>This might be to send <strong>multiple requests to a single server</strong> at the same time.</p>`,
      tip: 'What is the correct name for this type of attack?',
      async on(a) { a.show('ddos'); a.resetDdos(); await a.wake(); },
    },
    {
      title: 'A DDoS attack',
      text: `<p>This is a <strong>DDoS</strong> attack: <strong>Distributed Denial of Service</strong>.</p>
             <p>The server is so busy with fake requests that <strong>real users cannot use the service</strong>.</p>`,
      async on(a) { a.show('ddos'); a.resetDdos(); await a.wake(); a.answer(); },
    },
  ],
});

FD.check({
  section: 'botnet',
  items: [
    { type: 'mcq', q: 'What is a botnet?', opts: ['A large collection of malware-infected devices controlled by an attacker', 'A network of search engine bots', 'A type of firewall', 'A group of chatbots that help customers'], why: 'The infected devices are called zombies; the attacker is the bot herder.' },
    { type: 'mcq', q: 'Thousands of zombies send requests to one website at the same time, so real users cannot reach it. What is this attack called?', opts: ['A DDoS attack', 'A keylogger', 'A trojan', 'Adware'], why: 'Distributed Denial of Service.' },
    { type: 'tf', q: 'Bots can make an account look more influential by following it.', a: true, why: 'Fake followers change people’s perception of how influential someone is.' },
  ],
});
