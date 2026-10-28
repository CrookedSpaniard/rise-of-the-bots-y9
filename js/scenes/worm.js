FD.add({
  id: 'worm',
  title: 'Worms',
  tab: 'Worms',
  icon: 'worm',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['worm', 'malware that replicates itself and spreads through a network on its own, without attaching itself to files'],
    ['bandwidth', 'how much data a network connection can carry each second'],
  ],
  mount(el) {
    const PCS = [[30, 14], [160, 14], [300, 14], [430, 14], [30, 196], [160, 196], [300, 196], [430, 196]];
    const C = [260, 130];
    const mid = ([x, y]) => [x + 30, y + 23];
    el.innerHTML = `
      <div class="sim wm">
        <div class="sim-box" data-zone="net">
          <svg viewBox="0 0 520 262" class="wm-svg" role="img" aria-label="Eight computers connected to a switch">
            ${PCS.map((p, i) => `<line class="wire wm-w" data-i="${i}" x1="${mid(p)[0]}" y1="${mid(p)[1]}" x2="${C[0]}" y2="${C[1]}"/>`).join('')}
            ${FD.dv.switch(C[0] - 30, C[1] - 23)}
            ${PCS.map((p, i) => `<g class="wm-pc" data-i="${i}">${FD.dv.desktop(p[0], p[1])}<text class="svg-sm" x="${p[0] + 30}" y="${p[1] + 58}">PC ${i + 1}</text><text class="wm-bug" x="${p[0] + 52}" y="${p[1] + 8}">🐛</text></g>`).join('')}
            <circle class="wm-dot" id="dot" r="7" cx="-20" cy="-20"/>
          </svg>
        </div>
        <div class="wm-side">
          <div class="meter"><span class="meter-l">Network used</span><span class="bar wm-bar"><i id="bw"></i></span></div>
          <div class="readout">
            <div class="ro" id="roSp"><small>Download speed</small><b id="speed">100 Mbps</b></div>
            <div class="ro" id="roN"><small>Infected</small><b id="nInf">0 / 8</b></div>
          </div>
        </div>
        <div class="tbl-wrap wm-cmp" data-zone="cmp" hidden>
          <table class="tbl">
            <thead><tr><th></th><th>Virus</th><th>Worm</th></tr></thead>
            <tbody>
              <tr><th>Replicates itself?</th><td>✓ Yes</td><td>✓ Yes</td></tr>
              <tr><th>Attaches to files?</th><td>✓ Yes, inserts code into programs</td><td>✗ No</td></tr>
              <tr><th>Needs a user to run it?</th><td>✓ Yes</td><td>✗ No, spreads through the network</td></tr>
              <tr><th>Main problem</th><td>Damages programs and files</td><td>Uses up bandwidth: slows the network</td></tr>
            </tbody>
          </table>
        </div>
        <div class="ctrls">
          <button class="btn small-btn" id="go">🐛 Release the worm</button>
          <button class="btn ghost small-btn" id="reset">↺ Reset</button>
        </div>
      </div>`;
    const root = el.querySelector('.wm'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0;
    const pcs = [...root.querySelectorAll('.wm-pc')], wires = [...root.querySelectorAll('.wm-w')];
    function set(n) {
      $('#bw').style.setProperty('--v', Math.min(100, 6 + n * 12) + '%');
      const sp = [100, 80, 55, 35, 20, 11, 6, 3, 1][n];
      $('#speed').textContent = sp + ' Mbps';
      $('#roSp').classList.toggle('bad', n >= 4);
      $('#nInf').textContent = `${n} / 8`;
      $('#roN').classList.toggle('bad', n > 0);
    }
    function reset() {
      run++;
      pcs.forEach((p) => p.classList.remove('inf'));
      wires.forEach((w) => w.classList.remove('on', 'wave'));
      $('#dot').setAttribute('cx', -20); $('#dot').setAttribute('cy', -20);
      set(0);
    }
    async function hop(a, b, id) {
      const path = [mid(PCS[a]), C, mid(PCS[b])];
      await FD.tween(700, (t) => {
        if (id !== run) return;
        const [x, y] = FD.along(path, t);
        $('#dot').setAttribute('cx', x); $('#dot').setAttribute('cy', y);
      });
    }
    async function release() {
      reset();
      const id = run;
      const order = [0, 5, 2, 7, 4, 1, 6, 3];
      pcs[0].classList.add('inf'); wires[0].classList.add('wave'); set(1);
      for (let k = 1; k < order.length; k++) {
        await hop(order[k - 1], order[k], id);
        if (dead || id !== run) return;
        pcs[order[k]].classList.add('inf');
        wires[order[k]].classList.add('wave');
        set(k + 1);
      }
      $('#dot').setAttribute('cx', -20); $('#dot').setAttribute('cy', -20);
    }
    $('#go').addEventListener('click', release);
    $('#reset').addEventListener('click', reset);
    set(0);
    return {
      reset, release,
      cmp: (on) => { $('.wm-cmp').hidden = !on; },
      focus: (z) => FD.focus(root, z),
      destroy() { dead = true; run++; },
    };
  },
  steps: [
    {
      title: 'What is a worm?',
      text: `<p><strong>Worms</strong> replicate themselves, like viruses…</p>
             <p>…but they <strong>do not attach themselves to files</strong> as a virus does.</p>`,
      on: (a) => { a.reset(); a.cmp(false); },
    },
    {
      title: 'Spreading through the network',
      text: `<p>Instead, worms <strong>spread through the network</strong> on their own and use the system’s resources.</p>
             <p>Nobody needs to click anything: watch the worm jump from computer to computer.</p>`,
      tip: 'Try it: release the worm and watch the speed.',
      async on(a) { a.cmp(false); await a.release(); },
    },
    {
      title: 'Using up bandwidth',
      text: `<p>Most worms cause problems by <strong>using up network bandwidth</strong>.</p>
             <p>Every infected computer sends more and more data, so the network <strong>slows down significantly</strong> for everybody.</p>`,
      async on(a) { a.cmp(false); await a.release(); },
    },
    {
      title: 'Virus or worm?',
      text: `<p>Both replicate. The difference is <strong>how they spread</strong>:</p>
             <ul><li>a <strong>virus</strong> attaches to programs and needs a user to run it</li><li>a <strong>worm</strong> spreads through the network by itself</li></ul>`,
      on: (a) => a.cmp(true),
    },
  ],
});

FD.check({
  section: 'worm',
  items: [
    { type: 'mcq', q: 'How is a worm different from a virus?', opts: ['It spreads through the network without attaching itself to files', 'It does not replicate itself', 'It only shows adverts', 'It always asks for money'], why: 'Worms replicate, but they do not attach to files and do not need a user to run them.' },
    { type: 'mcq', q: 'What problem do most worms cause?', opts: ['They use up network bandwidth and slow the network down', 'They record every key you press', 'They lock the screen and ask for a ransom', 'They show pop-up adverts'], why: 'Every infected device sends more data, so there is less bandwidth for everyone.' },
  ],
});
