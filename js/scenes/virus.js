FD.add({
  id: 'virus',
  title: 'Viruses',
  tab: 'Viruses',
  icon: 'virus',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['virus', 'a malicious form of self-replicating software that inserts its code into other programs'],
    ['self-replicating', 'able to make copies of itself'],
    ['executed', 'run (opened) as a program'],
  ],
  mount(el) {
    const PROGS = [['🎮', 'Game.exe'], ['📝', 'Notes.exe'], ['🎨', 'Paint.exe'], ['🎵', 'Music.exe'], ['🧮', 'Calc.exe']];
    el.innerHTML = `
      <div class="sim vr">
        <div class="vr-top">
          <div class="win vr-mail" data-zone="mail">
            <div class="win-bar">Inbox</div>
            <div class="win-body">
              <p class="vr-from"><b>From:</b> prizes@win-big-now.example</p>
              <p><b>Your FREE game is attached!</b> Open it now to play.</p>
              <button class="vr-att" id="att">📎 SuperGame.exe <small>open attachment</small></button>
            </div>
          </div>
          <div class="sim-box vr-progs" data-zone="progs">
            <p class="mal-h">Programs on this computer</p>
            <ul class="vr-list">${PROGS.map(([e, n]) => `<li class="vr-p"><span class="vr-name">${e} ${n}</span><span class="vr-code"><i></i><i></i><i></i><i></i></span><span class="vr-bug" aria-hidden="true">🦠</span></li>`).join('')}</ul>
            <div class="readout"><div class="ro" id="roSt"><small>Infected programs</small><b id="nInf">0 / ${PROGS.length}</b></div></div>
          </div>
        </div>
        <div class="cards3 vr-ways" data-zone="ways">
          <div class="mini off" data-w="0" style="--c:var(--c6)"><h5>📎 Email attachments</h5><p>Downloading and opening an attachment.</p></div>
          <div class="mini off" data-w="1" style="--c:var(--c6)"><h5>🪟 Pop-ups</h5><p>Clicking a confirmation button on a pop-up without reading it.</p></div>
          <div class="mini off" data-w="2" style="--c:var(--c6)"><h5>🏴‍☠️ Illegal downloads</h5><p>Films or games from illegal websites or peer-to-peer file-sharing platforms.</p></div>
        </div>
        <div class="ctrls">
          <button class="btn ghost small-btn" id="reset">↺ Reset</button>
          <p class="note" id="msg">The virus is only a file in the inbox. It cannot do anything until someone runs it.</p>
        </div>
      </div>`;
    const root = el.querySelector('.vr'), $ = (s) => root.querySelector(s);
    let dead = false, busy = false;
    const progs = [...root.querySelectorAll('.vr-p')];
    function reset() {
      busy = false;
      progs.forEach((p) => p.classList.remove('inf', 'hit'));
      $('#att').classList.remove('run');
      $('#nInf').textContent = `0 / ${progs.length}`;
      $('#roSt').classList.remove('bad');
      $('#msg').textContent = 'The virus is only a file in the inbox. It cannot do anything until someone runs it.';
    }
    async function run() {
      if (busy) return;
      reset();
      busy = true;
      $('#att').classList.add('run');
      $('#msg').textContent = 'The user opened the attachment: the virus is running and copying its code into other programs…';
      let n = 0;
      for (const p of progs) {
        await FD.wait(550);
        if (dead) return;
        p.classList.add('hit');
        await FD.wait(250);
        if (dead) return;
        p.classList.remove('hit');
        p.classList.add('inf');
        $('#nInf').textContent = `${++n} / ${progs.length}`;
      }
      $('#roSt').classList.add('bad');
      $('#msg').textContent = 'Every program now carries a copy of the virus. Each time one of them runs, the virus can spread again.';
      busy = false;
    }
    $('#att').addEventListener('click', run);
    $('#reset').addEventListener('click', reset);
    return {
      reset, run,
      focus: (z) => FD.focus(root, z),
      async ways(n) { root.querySelectorAll('.vr-ways .mini').forEach((m) => m.classList.toggle('off', +m.dataset.w >= n)); },
      destroy() { dead = true; },
    };
  },
  steps: [
    {
      title: 'What is a virus?',
      text: `<p>Viruses are a malicious form of <strong>self-replicating</strong> software: they make copies of themselves.</p>
             <p>This email has a virus hidden in its attachment.</p>`,
      on: (a) => { a.reset(); a.focus('mail'); a.ways(0); },
    },
    {
      title: 'It needs a user to run it',
      text: `<p>For a virus to infect a system, it needs to be <strong>initiated (executed) by a user</strong>.</p>
             <p>While the attachment stays closed, nothing happens.</p>`,
      tip: 'Try it: click the attachment to open it.',
      on: (a) => { a.reset(); a.focus('mail'); a.ways(0); },
    },
    {
      title: 'Replicating',
      text: `<p>Once on a computer or network, a virus <strong>replicates</strong> itself by <strong>maliciously modifying other programs</strong> and <strong>inserting its code</strong> into them.</p>
             <p>Watch the red code being added to each program.</p>`,
      async on(a) { a.focus('progs'); a.ways(0); await a.run(); },
    },
    {
      title: 'How do people catch a virus?',
      text: `<p>What is the most common way for a computer to be infected by a virus?</p>
             <ul><li>downloading an <strong>email attachment</strong></li><li>clicking a confirmation button on a <strong>pop-up</strong> without reading it</li><li>downloading films or games from <strong>illegal websites</strong> or <strong>peer-to-peer</strong> file-sharing platforms</li></ul>`,
      async on(a) { a.focus('ways'); for (let i = 1; i <= 3; i++) { a.ways(i); await FD.wait(600); } },
    },
  ],
});

FD.check({
  section: 'virus',
  items: [
    { type: 'tf', q: 'A virus can infect a computer without anyone running it.', a: false, why: 'A virus needs to be initiated (executed) by a user, for example by opening an attachment.' },
    { type: 'mcq', q: 'How does a virus replicate?', opts: ['By modifying other programs and inserting its code into them', 'By sending adverts to the user', 'By encrypting the user’s files', 'By pretending to be a useful game'], why: 'Viruses are self-replicating: they copy their code into other programs.' },
    { type: 'multi', q: 'Choose <b>two</b> common ways to catch a virus.', need: 2, opts: [['Opening an email attachment', true], ['Downloading games from an illegal website', true], ['Installing operating system updates', false], ['Using a strong password', false]], why: 'Also: clicking a pop-up button without reading it, and peer-to-peer downloads.' },
  ],
});
