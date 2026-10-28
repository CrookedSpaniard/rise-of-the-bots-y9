FD.add({
  id: 'election',
  title: 'Plenary: bots and the 2016 US election',
  tab: 'Plenary',
  icon: 'election',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['automated account', 'a social media account run by a bot, not by a person'],
    ['misinformation', 'false or misleading information'],
  ],
  mount(el) {
    const PH = [['Think', 60, '🤔', 'On your own, in silence.'], ['Write', 60, '✍️', 'Write your ideas down.'], ['Pair', 60, '👥', 'Compare with your partner.'], ['Share', 120, '🙋', 'Share with the class.']];
    const POSTS = ['Candidate X is the ONLY choice! #Vote', 'Don’t trust what the news says about X #Vote', 'Everyone I know is voting X! #Vote', 'Polling stations are CLOSED tomorrow (not true!) #Vote', 'Candidate Y lied again!! #Vote'];
    el.innerHTML = `
      <div class="sim el">
        <div class="el-top">
          <div class="el-fact" data-zone="fact">
            <p class="el-n" id="num">0</p>
            <p>automated accounts, linked to Russia, that Twitter said were tweeting <b>election-related content</b> during the 2016 US presidential election.</p>
            <p class="bt-src">Source: Twitter, official blog, 2018.</p>
          </div>
          <div class="win el-feed" data-zone="feed">
            <div class="win-bar">Trending · #Vote</div>
            <div class="win-body" id="feed"></div>
          </div>
        </div>
        <div class="el-tw" data-zone="tw">
          <p class="el-qq">What are the potential consequences of <b>50,258 automated accounts</b> (non-human users) posting election-based content?</p>
          <div class="el-phases">${PH.map(([n, s, e, d], i) => `<div class="el-ph" data-i="${i}"><span>${e}</span><b>${n}</b><small>${d}</small><em>${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}</em></div>`).join('')}</div>
          <div class="ctrls">
            <button class="btn small-btn primary" id="tw">▶ Start think / write / pair / share</button>
            <button class="btn small-btn ghost" id="skip">⏭ Next phase</button>
            <p class="el-clock mono" id="clock">–:––</p>
          </div>
        </div>
        <div class="cards3 el-ideas" data-zone="ideas" hidden>
          <div class="mini" style="--c:var(--c3)"><h5>📰 Misinformation</h5><p>False stories spread faster and further.</p></div>
          <div class="mini" style="--c:var(--c3)"><h5>📈 Fake popularity</h5><p>Some views look far more popular than they really are.</p></div>
          <div class="mini" style="--c:var(--c3)"><h5>🗳️ Influencing votes</h5><p>People may change how they vote, or not vote at all.</p></div>
          <div class="mini" style="--c:var(--c3)"><h5>⚔️ Division</h5><p>Groups become angrier with each other.</p></div>
          <div class="mini" style="--c:var(--c3)"><h5>🤷 Less trust</h5><p>People stop trusting elections, news and each other.</p></div>
        </div>
      </div>`;
    const root = el.querySelector('.el'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0, tick = null, ph = -1, left = 0;
    async function count() {
      run++;
      const id = run;
      $('#feed').innerHTML = '';
      const feed = (async () => {
        for (let i = 0; i < 8; i++) {
          const p = FD.h(`<p class="el-post"><span class="av" style="--av:var(--c${1 + (i % 9)})">🤖</span><span><b>@user${48213 + i * 977}</b> ${POSTS[i % POSTS.length]}<small>🔁 ${FD.fmt(1200 + i * 3731)}</small></span></p>`);
          $('#feed').prepend(p);
          if ($('#feed').childElementCount > 4) $('#feed').lastElementChild.remove();
          await FD.wait(600);
          if (dead || id !== run) return;
        }
      })();
      await FD.tween(2200, (t) => { if (id === run) $('#num').textContent = FD.fmt(t * 50258); });
      await feed;
    }
    const mmss = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    function phase(i) {
      clearInterval(tick);
      ph = i;
      root.querySelectorAll('.el-ph').forEach((p, k) => { p.classList.toggle('cur', k === i); p.classList.toggle('done', k < i); });
      if (i >= PH.length) { $('#clock').textContent = 'Done!'; $('#tw').textContent = '↺ Start again'; return; }
      left = PH[i][1];
      $('#clock').textContent = mmss(left);
      tick = setInterval(() => {
        left--;
        $('#clock').textContent = mmss(Math.max(0, left));
        if (left <= 0) { FD.beep && FD.beep(); phase(ph + 1); }
      }, 1000);
    }
    $('#tw').addEventListener('click', () => { $('#tw').textContent = '▶ Start think / write / pair / share'; phase(0); });
    $('#skip').addEventListener('click', () => { if (ph >= 0 && ph < PH.length) phase(ph + 1); });
    return {
      count,
      ideas: (on) => { $('.el-ideas').hidden = !on; },
      focus: (z) => FD.focus(root, z),
      destroy() { dead = true; run++; clearInterval(tick); },
    };
  },
  steps: [
    {
      title: 'Bots and an election',
      text: `<p>In 2018, Twitter (now called X) reported that it had found <strong>50,258 automated accounts</strong>, linked to Russia, tweeting <strong>election-related content</strong> during the 2016 US election.</p>`,
      async on(a) { a.ideas(false); a.focus(['fact', 'feed']); await a.count(); },
    },
    {
      title: 'Think / write / pair / share',
      text: `<p>What are the <strong>potential consequences</strong> of 50,258 automated accounts (non-human users) posting election-based content?</p>
             <p>Use the timer: think, write your answer in the next tab, compare with your partner, then share.</p>`,
      tip: 'Teacher: press Start. The timer moves on by itself; “Next phase” skips ahead.',
      on: (a) => { a.ideas(false); a.focus('tw'); },
    },
    {
      title: 'Some possible consequences',
      text: `<p>Did you think of these?</p>
             <p>Bots can make an opinion look popular, spread false information quickly and change what people believe, which is why <strong>bots can affect society</strong>, not only computers.</p>`,
      on: (a) => { a.ideas(true); a.focus('ideas'); },
    },
    {
      title: 'In this lesson, you…',
      text: `<ul><li>looked at how different types of <strong>malware</strong> cause problems for computer systems</li><li>discussed how malicious <strong>bots</strong> can have an impact on societal issues</li></ul>
             <p><strong>Next lesson:</strong> how we can <strong>protect</strong> computer networks from the threats in this unit.</p>`,
      tip: 'Now write your answer, then do the exit quiz.',
      on: (a) => { a.ideas(true); a.focus(); },
    },
  ],
});

FD.activities({
  section: 'election',
  kick: 'Plenary and homework',
  intro: 'Write your answers in the boxes. They are <b>saved automatically</b> on this device and included when you copy <b>My progress</b>.',
  items: [
    {
      id: 'tw-share',
      title: 'Think / write / pair / share',
      task: '<p>What are the potential consequences of <b>50,258 automated accounts</b> (non-human users) posting election-based content? Give at least <b>two</b> consequences and explain each one.</p>',
      sim: ['election', 'See the election bots again'],
      lines: 5,
    },
    {
      id: 'quick-read',
      title: 'Homework / extension: malware quick read',
      task: `<p>Your local cybersecurity police force want you to make a <b>quick read fact sheet</b> to help educate the public on malware. Your teacher will give you one of these: <b>viruses</b>, <b>worms</b>, <b>ransomware</b> or <b>trojans</b>.</p>
             <ul><li>Research the malware: what is it?</li><li>Describe how it would break the <b>Computer Misuse Act</b> (see your notes from the previous lesson).</li><li><b>Explorer task:</b> find a case study where the malware was used and the impact it had.</li></ul>`,
      fields: ['My malware', 'What it is', 'How it breaks the Computer Misuse Act', 'Case study and its impact'],
      lines: 3,
      hint: 'Anything else for your fact sheet (tips to stay safe, sources you used)…',
    },
  ],
});
