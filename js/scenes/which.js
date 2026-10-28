FD.add({
  id: 'which',
  title: 'Which malware is it?',
  tab: 'Which malware?',
  icon: 'which',
  color: '--c4',
  section: true,
  interactive: true,
  mount(el) {
    const TYPES = ['virus', 'worm', 'ransomware', 'trojan', 'spyware', 'adware'];
    const CASES = [
      ['🎮', 'Leo downloads a free “fps booster” for his favourite game. It works, but a stranger can now see his screen and open his files.', 'trojan', 'It looked useful but opened a back door: a trojan.'],
      ['🏥', 'A hospital’s computers show a red screen: “Your files are encrypted. Pay $600 in bitcoin within 3 days.”', 'ransomware', 'Locked files + a demand for money = ransomware.'],
      ['🐢', 'Nobody clicked anything, but one infected laptop copies itself to every computer on the school network and the internet becomes painfully slow.', 'worm', 'It spread through the network on its own and used up bandwidth: a worm.'],
      ['🔑', 'Mia’s social media account is taken over. Later, she finds software on her laptop that had been recording everything she typed.', 'spyware', 'A keylogger is spyware.'],
      ['📢', 'Every time Ana opens her browser, ten pop-ups appear, even when the Wi-Fi is switched off.', 'adware', 'Unwanted adverts and pop-ups offline: adware.'],
      ['📎', 'Ben opens an email attachment called “homework.exe”. Soon, copies of the same code are found inside his other programs.', 'virus', 'The user ran it, and it inserted its code into other programs: a virus.'],
      ['🔎', 'A “free wallpaper” app quietly sends a list of every website you visit to an advertising company.', 'spyware', 'It monitors how you use your computer: spyware (arriving inside a trojan-like app).'],
      ['🏴‍☠️', 'Zoe downloads a film from a peer-to-peer site. When she plays it, it starts modifying the programs on her computer.', 'virus', 'An illegal download that she ran, inserting code into programs: a virus.'],
    ];
    let i = 0, score = 0, answered = false;
    el.innerHTML = `
      <div class="sim wh">
        <div class="wh-top"><span class="pill" id="pos"></span><span class="wh-score">Score <b id="sc">0</b> / ${CASES.length}</span></div>
        <div class="wh-dots" id="dots">${CASES.map(() => '<i></i>').join('')}</div>
        <div class="card wh-case" id="case"></div>
        <div class="wh-opts">${TYPES.map((t) => `<button class="wh-o" data-t="${t}" style="--c:var(${FD.section(t).color})">${FD.icon[t]}<span>${t[0].toUpperCase() + t.slice(1)}</span></button>`).join('')}</div>
        <p class="sc-fb" id="fb" hidden></p>
        <div class="ctrls"><button class="btn primary small-btn" id="nx" hidden>Next case ▶</button><button class="btn ghost small-btn" id="again">↺ Start again</button></div>
      </div>`;
    const root = el.querySelector('.wh'), $ = (s) => root.querySelector(s);
    const btns = [...root.querySelectorAll('.wh-o')], dots = [...root.querySelectorAll('#dots i')];
    function show() {
      answered = false;
      const [e, t] = CASES[i];
      $('#pos').textContent = `Case ${i + 1} of ${CASES.length}`;
      $('#case').innerHTML = `<span class="wh-e">${e}</span><p>${t}</p>`;
      btns.forEach((b) => { b.disabled = false; b.classList.remove('right', 'wrong'); });
      $('#fb').hidden = true; $('#nx').hidden = true;
      dots.forEach((d, k) => d.classList.toggle('cur', k === i));
    }
    function answer(t) {
      if (answered) return;
      answered = true;
      const [, , want, why] = CASES[i], ok = t === want;
      if (ok) score++;
      $('#sc').textContent = score;
      dots[i].classList.add(ok ? 'ok' : 'no');
      btns.forEach((b) => { b.disabled = true; if (b.dataset.t === want) b.classList.add('right'); else if (b.dataset.t === t) b.classList.add('wrong'); });
      const fb = $('#fb');
      fb.hidden = false;
      fb.className = 'sc-fb ' + (ok ? 'good' : 'bad');
      fb.innerHTML = `<b>${ok ? '✓ Correct!' : '✗ Not quite.'}</b> ${why}`;
      if (i < CASES.length - 1) { $('#nx').hidden = false; $('#nx').textContent = 'Next case ▶'; }
      else {
        $('#nx').hidden = true;
        fb.innerHTML += `<br><b>Finished: ${score} / ${CASES.length}.</b> ${score === CASES.length ? '🎉 Malware expert!' : score >= 6 ? '👍 Well done.' : '📖 Look back at the sections you mixed up.'}`;
        FD.markSeen('which');
      }
    }
    btns.forEach((b) => b.addEventListener('click', () => answer(b.dataset.t)));
    $('#nx').addEventListener('click', () => { i++; show(); });
    $('#again').addEventListener('click', () => { i = 0; score = 0; $('#sc').textContent = 0; dots.forEach((d) => d.classList.remove('ok', 'no')); show(); });
    show();
    return {};
  },
  steps: [
    {
      title: 'Which malware is it?',
      text: `<p>Eight short cases. For each one, decide which type of malware is to blame.</p>
             <p>Look for clues: <strong>how did it get in?</strong> and <strong>what problem does it cause?</strong></p>`,
      tip: 'Teacher: do this as a whole class. Students show their answer with fingers 1–6 before you click.',
    },
  ],
});
