FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['hook', 'Encrypted', 'Scrambled with a key so that nobody can read the data without the key.'],
      ['malware', 'Malware', 'Malicious software: software designed to gain access to your computer with malicious intent.'],
      ['malware', 'Malicious intent', 'Meaning to cause harm: disabling hardware, data theft, forced advertising, sending spam or extorting money.'],
      ['virus', 'Virus', 'A malicious form of self-replicating software that modifies other programs and inserts its code. A user has to run it.'],
      ['virus', 'Peer-to-peer (P2P)', 'Sharing files directly between users’ computers; illegal downloads from P2P platforms often carry viruses.'],
      ['worm', 'Worm', 'Malware that replicates itself and spreads through the network without attaching to files.'],
      ['worm', 'Bandwidth', 'How much data a network connection can carry each second. Worms use it up and slow the network down.'],
      ['ransomware', 'Ransomware', 'A self-replicating form of virus that locks a computer and encrypts files, then demands a ransom.'],
      ['ransomware', 'WannaCry', 'A ransomware attack in May 2017 that affected over 200,000 computers in 150 countries through a known Windows flaw.'],
      ['ransomware', 'Update (patch)', 'A fix from the software company that closes a security flaw.'],
      ['trojan', 'Trojan', 'Software that appears to perform a useful function but also performs malicious actions without the user knowing.'],
      ['trojan', 'Back door', 'A hidden way into a computer that gives an attacker remote access.'],
      ['spyware', 'Spyware', 'Unwanted software that monitors and gathers information on a person and how they use their computer.'],
      ['spyware', 'Keylogger', 'Spyware that records every keystroke a user makes.'],
      ['adware', 'Adware', 'Malware (a worm, virus or trojan) that downloads or displays unwanted adverts or pop-ups.'],
      ['bots', 'Bot', 'An automated program that performs tasks repeatedly, such as a search engine bot, chatbot or shopbot.'],
      ['bots', 'Internet traffic', 'The data that is transferred over the internet. Over half of it is believed to be bots.'],
      ['botnet', 'Botnet', 'A large collection of malware-infected devices (zombies) controlled by an attacker, the bot herder.'],
      ['botnet', 'DDoS attack', 'Distributed Denial of Service: many devices flood one server with requests so real users cannot use it.'],
      ['botnet', 'Vulnerability', 'A weakness that an attacker can use, such as a device that still uses its default password.'],
      ['election', 'Automated account', 'A social media account run by a bot, not by a person.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Malware</button><button data-v="B">Bots</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
