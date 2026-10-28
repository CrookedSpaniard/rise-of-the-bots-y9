FD.add({
  id: 'bots',
  title: 'Internet bots',
  tab: 'Bots',
  icon: 'bots',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['bot', 'an automated program that performs tasks repeatedly'],
    ['index', 'the list of web pages that a search engine keeps, so it can find results quickly'],
    ['internet traffic', 'the data that is transferred over the internet'],
  ],
  mount(el) {
    const PAGES = ['football-club.example', 'recipes.example', 'school-news.example', 'museum.example', 'weather.example', 'games.example'];
    const SHOPS = [['ShopOne', 64.99], ['MegaStore', 59.5], ['BudgetBuy', 61.2], ['TechTown', 66]];
    el.innerHTML = `
      <div class="sim bt">
        <div class="ptabs" role="group" aria-label="Good bots">
          <button data-p="crawl">🕷️ Search engine bot</button><button data-p="chat">💬 Chatbot</button><button data-p="shop">🛒 Shopbot</button><button data-p="traffic">📊 Bot traffic</button>
        </div>

        <div data-panel="crawl" class="sim">
          <div class="bt-crawl">
            <div class="bt-web">${PAGES.map((p) => `<span class="bt-page">🌐 ${p}</span>`).join('')}</div>
            <div class="sim-box bt-idx"><p class="mal-h">Search engine index</p><ol id="idx"></ol></div>
          </div>
          <p class="note">The bot follows links from page to page and adds every new website it finds to the index.</p>
        </div>

        <div data-panel="chat" class="sim" hidden>
          <div class="win bt-chat">
            <div class="win-bar">Help · Train tickets</div>
            <div class="win-body" id="chatBody"></div>
          </div>
        </div>

        <div data-panel="shop" class="sim" hidden>
          <p class="mal-h">Looking for: 🎧 Wireless headphones X200</p>
          <div class="bt-shops">${SHOPS.map(([n, p]) => `<div class="bt-shop"><b>${n}</b><span>£${p.toFixed(2)}</span></div>`).join('')}</div>
          <p class="verdict" id="best"></p>
        </div>

        <div data-panel="traffic" class="sim" hidden>
          <blockquote class="bt-q">“It is believed that over 50% of all internet traffic is bot traffic.”</blockquote>
          <div class="bt-split" aria-label="Internet traffic: about half humans, half bots">
            <span class="bt-h" id="bh" style="--w:50%">🧑 Humans</span><span class="bt-g" id="bg" style="--w:25%">🤖 Good bots</span><span class="bt-b" id="bb" style="--w:25%">😈 Bad bots</span>
          </div>
          <p class="bt-src">“A significant portion of that is malicious bots.” Cloudflare (2019). The split above is illustrative.</p>
          <p class="note"><b>Internet traffic</b> means the data that is transferred over the internet.</p>
        </div>

        <div class="ctrls"><button class="btn small-btn" id="go">▶ Run the bot</button></div>
      </div>`;
    const root = el.querySelector('.bt'), $ = (s) => root.querySelector(s);
    let dead = false, run = 0;
    async function crawl(id) {
      $('#idx').innerHTML = '';
      const pages = [...root.querySelectorAll('.bt-page')];
      pages.forEach((p) => p.classList.remove('vis', 'cur'));
      for (const p of pages) {
        p.classList.add('cur');
        await FD.wait(450);
        if (dead || id !== run) return;
        p.classList.remove('cur'); p.classList.add('vis');
        $('#idx').appendChild(FD.h(`<li>${p.textContent.replace('🌐 ', '')}</li>`));
      }
    }
    async function chat(id) {
      const b = $('#chatBody');
      b.innerHTML = '';
      const M = [['bot', 'Hi! I’m TrainBot 🤖. How can I help?'], ['me', 'When is the next train to Valencia?'], ['bot', 'The next train leaves at 10:42 from platform 2.'], ['me', 'Can I take my bike?'], ['bot', 'Yes, bikes are allowed outside rush hour. Anything else?']];
      for (const [who, t] of M) {
        b.appendChild(FD.h(`<p class="bt-msg ${who}">${t}</p>`));
        await FD.wait(who === 'bot' ? 700 : 900);
        if (dead || id !== run) return;
      }
    }
    async function shop(id) {
      const s = [...root.querySelectorAll('.bt-shop')];
      s.forEach((x) => x.classList.remove('cur', 'best'));
      $('#best').textContent = ''; $('#best').className = 'verdict';
      for (const x of s) { x.classList.add('cur'); await FD.wait(450); if (dead || id !== run) return; x.classList.remove('cur'); }
      s[1].classList.add('best');
      $('#best').textContent = '🤖 Best deal found: MegaStore, £59.50';
      $('#best').classList.add('good');
    }
    async function traffic(id) {
      const set = (h, g, b) => { $('#bh').style.setProperty('--w', h + '%'); $('#bg').style.setProperty('--w', g + '%'); $('#bb').style.setProperty('--w', b + '%'); };
      set(100, 0, 0);
      await FD.wait(500);
      if (dead || id !== run) return;
      set(50, 25, 25);
    }
    const RUN = { crawl, chat, shop, traffic };
    const go = () => { run++; RUN[root.dataset.panel](run); };
    const show = FD.panels(root, () => { $('#go').hidden = false; go(); });
    $('#go').addEventListener('click', go);
    show('crawl');
    return { show, destroy() { dead = true; run++; } };
  },
  steps: [
    {
      title: 'What is a bot?',
      text: `<p><strong>Bots</strong> are <strong>automated programs</strong> that perform tasks <strong>repeatedly</strong>.</p>
             <p>They are a crucial part of the internet’s infrastructure. For example, they <strong>find new websites</strong> for search engines to index.</p>`,
      on: (a) => a.show('crawl'),
    },
    {
      title: 'Chatbots',
      text: `<p>Bots also provide <strong>customer service online</strong>: these are <strong>chatbots</strong>.</p>
             <p>The same questions get answered quickly, day and night.</p>`,
      on: (a) => a.show('chat'),
    },
    {
      title: 'Shopbots',
      text: `<p><strong>Shopbots</strong> monitor the prices of items to find the <strong>best deal</strong>.</p>
             <p>A person would take ages to check every shop. A bot does it in seconds.</p>`,
      on: (a) => a.show('shop'),
    },
    {
      title: 'How much traffic is bots?',
      text: `<p>It is believed that <strong>over 50%</strong> of all internet traffic is bot traffic…</p>
             <p>…and a <strong>significant portion</strong> of that is <strong>malicious bots</strong>.</p>`,
      tip: 'Internet traffic = the data that is transferred over the internet.',
      on: (a) => a.show('traffic'),
    },
  ],
});

FD.check({
  section: 'bots',
  items: [
    { type: 'mcq', q: 'What is a bot?', opts: ['An automated program that performs tasks repeatedly', 'A physical robot that builds computers', 'A type of password', 'A person who writes malware'], why: 'Bots are a crucial part of the internet’s infrastructure.' },
    { type: 'sort', q: 'Match each good bot to its job.', bins: ['Search engine bot', 'Chatbot', 'Shopbot'], rows: [['Answers customers’ questions online', 1], ['Finds new websites to index', 0], ['Compares prices to find the best deal', 2]], why: 'Search engine bots (crawlers), chatbots and shopbots are all useful bots.' },
  ],
});
