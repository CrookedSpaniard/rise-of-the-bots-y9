FD.add({
  id: 'ransomware',
  title: 'Ransomware and WannaCry',
  tab: 'Ransomware',
  icon: 'ransomware',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['ransomware', 'malware that locks a computer and encrypts files, then demands a ransom to unlock them'],
    ['security flaw', 'a weakness in software that attackers can use to get in'],
    ['update (patch)', 'a fix from the software company that closes a security flaw'],
  ],
  mount(el) {
    const PLAIN = 'Dear diary, today we won the football match 3-1 and I scored the second goal!';
    el.innerHTML = `
      <div class="sim rw">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="how">🔒 How it works</button><button data-p="wc">🌍 WannaCry, May 2017</button>
        </div>

        <div data-panel="how" class="sim">
          <div class="rw-how">
            <div class="win" data-zone="file">
              <div class="win-bar">Diary.docx</div>
              <div class="win-body"><p class="rw-text mono" id="txt">${PLAIN}</p></div>
            </div>
            <div class="rw-key" data-zone="key"><span>🔑</span><small>Only the attacker has the key</small></div>
          </div>
          <div class="rw-lock" id="lock" hidden data-zone="lock">
            <span>🔒</span>
            <div><b>Your computer has been locked.</b><p>Pay the ransom to get the key and unlock your files.</p></div>
          </div>
          <div class="ctrls">
            <button class="btn small-btn" id="enc">🔒 Encrypt the file</button>
            <button class="btn ghost small-btn" id="r1">↺ Reset</button>
          </div>
        </div>

        <div data-panel="wc" class="sim" hidden>
          <div class="rw-stats" data-zone="stats">
            <div class="rw-stat"><b id="sPc">0</b><small>computers affected (estimated)</small></div>
            <div class="rw-stat"><b id="sCo">0</b><small>countries</small></div>
            <div class="rw-stat"><b>May 2017</b><small>when it happened</small></div>
          </div>
          <div class="rw-tl" data-zone="tl">
            <div class="rw-ev"><b>March 2017</b><span>Microsoft releases a <b>security update</b> that fixes a known flaw in Windows.</span></div>
            <div class="rw-ev bad"><b>May 2017</b><span><b>WannaCry</b> spreads to computers that have <b>not</b> installed the update.</span></div>
          </div>
          <div class="rw-pcs" data-zone="pcs">
            <div class="rw-pc" id="pcA"><svg viewBox="0 0 60 46">${FD.dv.laptop(0, 0)}</svg><b>Updated PC</b><small id="stA">waiting…</small></div>
            <div class="rw-pc" id="pcB"><svg viewBox="0 0 60 46">${FD.dv.laptop(0, 0)}</svg><b>Not updated (or too old to get updates)</b><small id="stB">waiting…</small></div>
          </div>
          <div class="ctrls">
            <button class="btn small-btn" id="atk">🌍 Run the attack</button>
            <button class="btn ghost small-btn" id="r2">↺ Reset</button>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.rw'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0;
    const CH = '#%&@*$£¥§¤?!+=<>~^';
    function reset1() { run++; $('#txt').textContent = PLAIN; $('#txt').classList.remove('enc'); $('#lock').hidden = true; }
    async function encrypt() {
      reset1();
      const id = run;
      const chars = PLAIN.split('');
      for (let i = 0; i < chars.length; i += 3) {
        for (let k = i; k < Math.min(i + 3, chars.length); k++) if (chars[k] !== ' ') chars[k] = CH[Math.floor(Math.random() * CH.length)];
        $('#txt').textContent = chars.join('');
        await FD.wait(35);
        if (dead || id !== run) return;
      }
      $('#txt').classList.add('enc');
      await FD.wait(500);
      if (dead || id !== run) return;
      $('#lock').hidden = false;
      FD.shake($('#lock'));
    }
    function reset2() {
      run++;
      $('#sPc').textContent = '0'; $('#sCo').textContent = '0';
      ['#pcA', '#pcB'].forEach((s) => $(s).classList.remove('safe', 'hit'));
      $('#stA').textContent = 'waiting…'; $('#stB').textContent = 'waiting…';
    }
    async function attack() {
      reset2();
      const id = run;
      await FD.tween(1800, (t) => {
        if (id !== run) return;
        $('#sPc').textContent = FD.fmt(t * 200000) + (t === 1 ? '+' : '');
        $('#sCo').textContent = Math.round(t * 150);
      });
      if (dead || id !== run) return;
      $('#pcA').classList.add('safe'); $('#stA').textContent = '🛡️ Flaw fixed: attack blocked';
      await FD.wait(400);
      if (dead || id !== run) return;
      $('#pcB').classList.add('hit'); $('#stB').textContent = '🔒 Files encrypted: ransom demanded';
    }
    $('#enc').addEventListener('click', encrypt);
    $('#r1').addEventListener('click', reset1);
    $('#atk').addEventListener('click', attack);
    $('#r2').addEventListener('click', reset2);
    const show = FD.panels(root);
    show('how');
    return {
      show, reset1, encrypt, reset2, attack,
      focus: (z) => FD.focus(root.querySelector(`[data-panel="${root.dataset.panel}"]`), z),
      destroy() { dead = true; run++; },
    };
  },
  steps: [
    {
      title: 'A form of virus',
      text: `<p><strong>Ransomware</strong> is a form of virus, as it is <strong>self-replicating</strong>.</p>
             <p>Specifically, ransomware <strong>locks a computer</strong> and <strong>encrypts files</strong>, so the user cannot access their data.</p>`,
      tip: 'Try it: encrypt the diary.',
      async on(a) { a.show('how'); a.focus(); await a.encrypt(); },
    },
    {
      title: 'The ransom',
      text: `<p>The attacker demands that a <strong>ransom</strong> is paid before they decrypt the files and unlock the computer.</p>
             <p>Without the attacker’s <strong>key</strong>, the scrambled data is useless. That is exactly what happened in the ransom note at the start of the lesson.</p>`,
      on: (a) => { a.show('how'); a.focus(['key', 'lock']); },
    },
    {
      title: 'WannaCry, May 2017',
      text: `<p>The <strong>WannaCry</strong> ransomware attack is estimated to have affected <strong>over 200,000 computers</strong> across <strong>150 countries</strong>.</p>
             <p>In the UK it hit many <strong>NHS</strong> hospitals and GP surgeries: appointments and operations had to be cancelled.</p>`,
      async on(a) { a.show('wc'); a.focus('stats'); await a.attack(); },
    },
    {
      title: 'A known security flaw',
      text: `<p>WannaCry exploited a <strong>known security flaw</strong> in Microsoft Windows.</p>
             <p>Microsoft had already released an <strong>update</strong> to fix it. Every computer that had not applied the update was at risk, including <strong>older versions</strong> of Windows that no longer got updates.</p>`,
      tip: 'Lesson learnt: install updates as soon as they are available.',
      async on(a) { a.show('wc'); a.focus(['tl', 'pcs']); await a.attack(); },
    },
  ],
});

FD.check({
  section: 'ransomware',
  items: [
    { type: 'mcq', q: 'What does ransomware do?', opts: ['Locks the computer, encrypts files and demands a ransom', 'Spreads adverts through pop-ups', 'Records every key you press', 'Finds new websites for search engines'], why: 'The attacker will only decrypt the files after a ransom is paid (and maybe not even then).' },
    { type: 'mcq', q: 'Which computers were at risk from WannaCry?', opts: ['Windows computers that had not installed the security update', 'Every computer in the world', 'Only computers without a password', 'Only mobile phones'], why: 'The update fixed the flaw; older versions that no longer got updates were also at risk.' },
    { type: 'tf', q: 'WannaCry is estimated to have affected over 200,000 computers in about 150 countries.', a: true, why: 'It spread around the world in May 2017.' },
  ],
});
