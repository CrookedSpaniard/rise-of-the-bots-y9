FD.test({
  id: 'quiz',
  part: 'B',
  all: true,
  title: 'Exit quiz: Rise of the bots',
  tab: 'Exit quiz',
  kick: 'Year 9 · Cybersecurity · Lesson 4',
  heading: 'Exit quiz',
  Q: [
    ['malware', 'Malware is software that is designed to…', ['gain access to a computer with malicious intent', 'speed up a computer', 'back up a computer’s files', 'find new websites for search engines'], 'Malicious software.', 'malware'],
    ['virus', 'What must happen for a virus to infect a computer?', ['A user must run (execute) it', 'The computer must be switched off', 'The network must be slow', 'Nothing: it spreads by itself through the network'], 'For example, by opening an infected attachment.', 'virus'],
    ['worm', 'Which malware spreads through a network without attaching itself to files?', ['A worm', 'A virus', 'A trojan', 'Adware'], 'Worms usually use up bandwidth and slow the network down.', 'worm'],
    ['ransomware', 'A school’s files are encrypted and a message demands payment in bitcoin. This is…', ['ransomware', 'spyware', 'a chatbot', 'a shopbot'], 'Ransomware locks the computer and encrypts files.', 'ransomware'],
    ['WannaCry', 'Why did WannaCry spread to so many computers in 2017?', ['They had not installed an update that fixed a known flaw in Windows', 'They had antivirus software', 'They were switched off', 'They used strong passwords'], 'Updates fix security flaws: install them.', 'ransomware'],
    ['trojan', 'A free game works normally but secretly gives an attacker remote access. This is a…', ['trojan', 'worm', 'shopbot', 'DDoS attack'], 'It appears useful but opens a back door.', 'trojan'],
    ['keylogger', 'Which type of spyware records every key you press?', ['A keylogger', 'A crawler', 'A botnet', 'A worm'], 'It can capture passwords even when they are masked.', 'spyware'],
    ['adware', 'Pop-up adverts appear even when your laptop is offline. What is the most likely cause?', ['Adware', 'A search engine bot', 'A slow network', 'A strong password'], 'Lots of adverts online, or pop-ups offline, are warning signs.', 'adware'],
    ['bots', 'Which of these is a useful bot?', ['A chatbot that answers customers’ questions', 'A zombie in a botnet', 'A keylogger', 'A bot that creates fake followers'], 'Search engine bots and shopbots are also useful.', 'bots'],
    ['DDoS', 'In a DDoS attack, a botnet…', ['floods one server with requests so real users cannot use it', 'encrypts the files on one computer', 'records keystrokes', 'shows adverts on a website'], 'Distributed Denial of Service.', 'botnet'],
  ],
  LONG: [
    { q: 'Explain <b>one</b> way in which a <b>virus</b> is different from a <b>worm</b>.', m: 2, s: ['A virus attaches itself to / inserts its code into other programs or files (1)…', '…but a worm does not attach to files; it spreads through the network on its own (1).', 'OR: a virus needs a user to run it (1), a worm does not (1).'], link: ['worm', 'See virus or worm? again'] },
  ],
});
