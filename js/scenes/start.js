FD.add({
  id: 'start',
  title: 'Start here',
  tab: 'Start',
  icon: 'start',
  color: '--accent',
  page: true,
  mount(el) {
    const S = FD.state;
    const nodes = [[60, 45, '🦠'], [160, 25, '🐛'], [265, 30, '🔒'], [360, 55, '🐴'], [55, 180, '👁️'], [150, 205, '📢'], [265, 205, '🤖'], [360, 175, '🧟']];
    const done = (s) => FD.hasCheck(s.id) ? !!S.checks['check-' + s.id] : !!S.seen[s.id];
    const part = (p) => `
      <section class="card st-part">
        <h3>Part ${p} · ${FD.PARTS[p].name} <small>${FD.PARTS[p].pages}</small></h3>
        <ul class="st-list">${FD.SECTIONS.filter((s) => s.part === p).map((s) => `
          <li><button data-go="${s.id}" style="--c:var(${s.color})">${FD.icon[s.id]}<span><b>${FD.SECTIONS.indexOf(s) + 1}. ${s.name}</b><small>${s.line}</small></span>${done(s) ? '<span class="st-done" title="Done">✓</span>' : ''}</button></li>`).join('')}
          ${p === 'B' ? `<li><button data-go="quiz" style="--c:var(--red-ui)">${FD.icon.final}<span><b>Exit quiz</b><small>10 quick questions + 1 written answer</small></span>${S.tests.quiz && S.tests.quiz.done ? '<span class="st-done">✓</span>' : ''}</button></li>` : ''}
        </ul>
      </section>`;
    el.innerHTML = `
      <section class="card st-hero">
        <div>
          <p class="kick">Year 9 · Cybersecurity · Lesson 4</p>
          <h2>Rise of the bots</h2>
          <p>Some software is written to <b>harm</b> you: to lock your files, steal your passwords or flood you with adverts. In this lesson you will <b>list the common malware threats</b>, see <b>how each type of malware causes problems</b> for computer systems, and question <b>how malicious bots can affect society</b>.</p>
          <div class="who">
            <label>Your name<input id="sName" autocomplete="name" placeholder="First name and surname" value="${FD.esc(S.name)}"></label>
            <label>Class<input id="sClass" placeholder="e.g. 9B" value="${FD.esc(S.cls)}"></label>
          </div>
          <p class="small" id="sMsg">Your name goes on the results you send to your teacher.</p>
          <div class="chk-btns">
            <button class="btn primary" id="sGo">${S.last && S.last !== 'start' ? '▶ Continue where I left off' : '▶ Start the lesson'}</button>
            <button class="btn ghost" id="sProg" style="color:#fff;border-color:rgb(255 255 255 / .4)">${FD.icon.progress} My progress</button>
          </div>
        </div>
        <svg class="st-net" viewBox="0 0 420 230" role="img" aria-label="Types of malware and bots around one computer">
          ${nodes.map(([x, y]) => `<line x1="${x}" y1="${y}" x2="210" y2="115"/>`).join('')}
          <rect class="nd" x="182" y="88" width="56" height="54" rx="8"/><text x="210" y="124" style="font-size:26px">💻</text>
          ${nodes.map(([x, y, e]) => `<circle class="nd" cx="${x}" cy="${y}" r="25"/><text x="${x}" y="${y + 8}" style="font-size:23px">${e}</text>`).join('')}
        </svg>
      </section>

      <section class="card">
        <h3>In this lesson, you will</h3>
        <ol class="st-goals">
          <li><span class="qn">1</span>List the common malware threats</li>
          <li><span class="qn">2</span>Examine how different types of malware cause problems for computer systems</li>
          <li><span class="qn">3</span>Question how malicious bots can have an impact on societal issues</li>
        </ol>
      </section>

      <div class="st-cols">${part('A')}${part('B')}</div>

      <section class="card">
        <h3>How to use this website on your own</h3>
        ${FD.HOWTO}
      </section>
      <p class="small muted">Want to repeat the lesson from zero? <button class="link-btn danger" id="sReset">↺ Reset my progress</button></p>
      <p class="small muted">Your progress is saved in this browser only. Nothing is sent to the internet. Every ransom note, website, message and person here is a made-up, harmless simulation: nothing on this page can damage your computer. Never type real passwords into this website.</p>
      <p class="small muted">Based on Teach Computing Curriculum, Year 9 Cybersecurity, Lesson 4 “Rise of the bots” (National Centre for Computing Education, ncce.io/tcc), licensed under the Open Government Licence v3.0. Adapted and animated for the British School Alzira · Xàtiva · Gandia Group.</p>`;
    const $ = (s) => el.querySelector(s);
    $('#sName').addEventListener('input', (e) => { FD.state.name = e.target.value; FD.save(); });
    $('#sClass').addEventListener('input', (e) => { FD.state.cls = e.target.value; FD.save(); });
    $('#sGo').addEventListener('click', () => {
      if (FD.state.last && FD.state.last !== 'start') FD.goto(FD.state.last, FD.state.step || 0);
      else FD.goto('hook');
    });
    $('#sProg').addEventListener('click', FD.openProgress);
    $('#sReset').addEventListener('click', () => FD.openProgress('reset'));
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
