FD.add({
  id: 'hook',
  title: 'Your files have been encrypted!',
  tab: 'Ransom note',
  icon: 'hook',
  color: '--c9',
  section: true,
  interactive: true,
  vocab: [
    ['encrypted', 'scrambled with a key so that nobody can read the data without the key'],
    ['ransom', 'money demanded before something that was taken is given back'],
  ],
  mount(el) {
    const FILES = [['📄', 'Essay.docx'], ['🖼️', 'Holiday.jpg'], ['🎵', 'Playlist.mp3'], ['📊', 'Budget.xlsx'], ['📁', 'Photos'], ['🎮', 'Saves']];
    el.innerHTML = `
      <div class="sim hk">
        <div class="win hk-pc">
          <div class="win-bar">My computer · Documents</div>
          <div class="win-body hk-body">
            <div class="hk-files">${FILES.map(([e, n]) => `<span class="hk-file"><b>${e}</b><small>${n}</small></span>`).join('')}</div>

            <div class="hk-note" id="note" hidden>
              <div class="hk-note-top"><span class="hk-lock">🔒</span><p><b>Oops, something has gone wrong.</b><br>Your files have been encrypted.</p></div>
              <div class="hk-qa">
                <p><b>What happened to my computer?</b> Your computer is locked and all your files are encrypted.</p>
                <p><b>Can I get my files back?</b> Only we have the key. Send <b>$300 of bitcoin</b> to the address below.</p>
                <p><b>What if I don’t pay?</b> When the clock reaches zero, <b>every file will be deleted</b>.</p>
              </div>
              <p class="hk-addr mono">Send to: 1Fake9xQ…not-a-real-address</p>
              <div class="hk-row">
                <p class="hk-clock mono" id="clock">00:30</p>
                <div class="hk-btns">
                  <button class="btn small-btn hk-pay" id="pay">Pay now</button>
                  <button class="btn small-btn ghost hk-no" id="nopay">Don’t pay</button>
                </div>
              </div>
            </div>

            <div class="hk-out" id="outPay" hidden>
              <p class="hk-big">🎉 Congratulations!</p>
              <p>We have decrypted <b>50%</b> of your data.</p>
              <div class="bar hk-half"><i style="--v:50%"></i></div>
              <p>Now pay an <b>additional $300 of bitcoin</b> to decrypt the remaining 50%.</p>
            </div>
            <div class="hk-out hk-del" id="outNo" hidden>
              <p class="hk-big">🗑️ Your files have been deleted</p>
              <p>The time ran out. Everything in Documents has gone.</p>
            </div>
          </div>
        </div>
        <div class="ctrls">
          <button class="btn small-btn" id="go">💥 Start the attack</button>
          <button class="btn ghost small-btn" id="reset">↺ Reset</button>
          <p class="note">A harmless simulation. Nothing here touches your real files.</p>
        </div>
      </div>`;
    const root = el.querySelector('.hk'), $ = (s) => root.querySelector(s);
    let dead = false, timer = null, secs = 30;

    const draw = () => { $('#clock').textContent = `00:${String(secs).padStart(2, '0')}`; };
    function reset() {
      clearInterval(timer);
      root.querySelectorAll('.hk-file').forEach((f) => f.classList.remove('locked', 'gone'));
      ['#note', '#outPay', '#outNo'].forEach((s) => { $(s).hidden = true; });
      secs = 30; draw();
    }
    async function attack() {
      reset();
      for (const f of root.querySelectorAll('.hk-file')) {
        f.classList.add('locked');
        await FD.wait(260);
        if (dead) return;
      }
      await FD.wait(400);
      if (dead) return;
      $('#note').hidden = false;
      FD.shake($('#note'));
      clearInterval(timer);
      timer = setInterval(() => { secs = Math.max(0, secs - 1); draw(); if (!secs) noPay(); }, FD.dur(1000));
    }
    function pay() {
      clearInterval(timer);
      $('#note').hidden = true;
      $('#outPay').hidden = false;
      root.querySelectorAll('.hk-file').forEach((f, i) => { if (i % 2 === 0) f.classList.remove('locked'); });
    }
    async function noPay() {
      clearInterval(timer);
      $('#note').hidden = true;
      for (const f of root.querySelectorAll('.hk-file')) { f.classList.add('gone'); await FD.wait(150); if (dead) return; }
      $('#outNo').hidden = false;
    }
    $('#go').addEventListener('click', attack);
    $('#reset').addEventListener('click', reset);
    $('#pay').addEventListener('click', pay);
    $('#nopay').addEventListener('click', () => { secs = 0; draw(); noPay(); });
    return { reset, attack, pay, noPay, note: () => { $('#outPay').hidden = true; $('#outNo').hidden = true; }, destroy() { dead = true; clearInterval(timer); } };
  },
  steps: [
    {
      title: 'An ordinary day',
      text: `<p>This is your computer. Your homework, photos, music and game saves are all here.</p>
             <p>Then something goes wrong…</p>`,
      tip: 'Press “Start the attack” to see what happens.',
      on: (a) => a.reset(),
    },
    {
      title: 'Oops…',
      text: `<p>One by one, your files are <strong>encrypted</strong> and a message takes over the screen.</p>
             <p>Read it carefully. What does the attacker want? How do they put pressure on you?</p>`,
      async on(a) { await a.attack(); },
    },
    {
      title: 'What would you do?',
      text: `<p>You have <strong>30 seconds</strong>. Pay now or don’t pay?</p>
             <p>Decide with the person next to you, then press one of the buttons.</p>`,
      tip: 'If the clock has already run out, press “Start the attack” again.',
    },
    {
      title: 'If you pay…',
      text: `<p>Paying does <strong>not</strong> guarantee that you get your files back.</p>
             <p>Here the criminals return only <strong>half</strong> of the data and ask for <strong>more money</strong>.</p>`,
      async on(a) { await a.attack(); await FD.wait(1200); a.pay(); },
    },
    {
      title: 'If you don’t pay…',
      text: `<p>The criminals carry out their threat and <strong>delete the files</strong>.</p>
             <p>So how can you protect yourself <em>before</em> an attack? Think about it: we will come back to this.</p>`,
      async on(a) { await a.attack(); await FD.wait(1200); a.noPay(); },
    },
    {
      title: 'What just happened?',
      text: `<p>This was an attack by <strong>malware</strong>: software written to cause harm.</p>
             <p>This type is called <strong>ransomware</strong>. In this lesson you will meet it again, together with viruses, worms, trojans, spyware and adware.</p>`,
      tip: 'Discuss: who could be affected by an attack like this? A student? A hospital? A business?',
    },
  ],
});
