/* Te Ara Whetū: a pop-up history of Waikanae's library */
(() => {
'use strict';
/* =====================================================================
   DATA
   ===================================================================== */

/* ---------- history, 1977–2027 ----------
   Each event is a book on your history shelf. It arrives when you've read `at` pages in total.
   `set` changes the picture of Mahara Place. `focus` is where the camera looks.
   `big` events get a story card. `task` events ask the player to help out. */
const HISTORY = [
  { id: 'y1977', date: '1977', year: 1977, at: 0, focus: 77, title: "Waikanae's library opens",
    text: "Waikanae's library opens in a new building on Mahara Place, with a big tiled roof.",
    set: { b77: 'library', b15: 'empty', b9: 'shops', lib: '77', sky: 'day', vintage: true } },
  { id: 'post', date: 'Feb 1982', year: 1982, at: 400, focus: 15, title: 'The Post Office opens',
    text: 'Across the square, 15 Mahara Place is built as the Waikanae Post Office. People come here to post letters and parcels.',
    set: { b15: 'post' }, mult: 1.05 },
  { id: 'move96', date: '6 Apr 1996', year: 1996, at: 2500, focus: 15, big: true, title: 'The library moves in!',
    text: 'The post office building becomes Waikanae Library. The old library building across the square later becomes Mahara Gallery.',
    set: { b15: 'library', lib: '15', b77: 'gallery', lovestone: true, vintage: false }, mult: 1.25,
    task: 'unveil' },
  { id: 'apnk', date: 'Dec 2010', year: 2010, at: 9000, focus: 15, title: 'Computers for everyone',
    text: "The library's public computers are part of the Aotearoa People's Network Kaharoa, bringing free internet to the community.",
    set: { apnk: true }, mult: 1.05 },
  { id: 'matariki17', date: 'Jun 2017', year: 2017, at: 20000, focus: 15, title: 'The Love Stone glows',
    text: 'The Love Stone outside the library is lit up for Matariki.',
    set: { glow: true }, mult: 1.05 },
  { id: 'orange', date: 'May 2018', year: 2018, at: 40000, focus: 15, title: 'A bright new entrance',
    text: 'The library entrance gets bright orange walls and a wall of green plants. But the roof has been leaking for years.',
    set: { orange: true, glow: false, rain: true, sky: 'rain' }, mult: 1.05 },
  { id: 'closure', date: 'Nov 2018', year: 2018, at: 70000, focus: 15, big: true, era: 2, title: 'The library closes',
    text: 'Toxic mould is found inside the walls after years of leaks. The library has to close, and about 27,800 items are sent away to be cleaned.',
    set: { b15: 'closed', lib: 'none', sky: 'grey', orange: false, rain: false },
    effect: 'Reading is halved until a pop-up library opens.', task: 'mould' },
  { id: 'foyer', date: '21 Dec 2018', year: 2018, at: 110000, focus: 15, title: 'A pop-up in the foyer',
    text: 'Library staff open a tiny pop-up library just inside the front doors, so Waikanae still has books.',
    set: { lib: '15foyer', foyer: true }, mult: 1.05 },
  { id: 'newspace', date: '18 Feb 2019', year: 2019, at: 220000, focus: 77, title: 'Back to the 1977 building!',
    text: "The pop-up moves into the gallery's newSPACE. That's the same building where Waikanae's library was back in 1977!",
    set: { lib: '77pop', b77: 'popup', foyer: false }, mult: 1.05 },
  { id: 'temp', date: '1 Jul 2019', year: 2019, at: 500000, focus: 9, big: true, title: 'A temporary library',
    text: 'A proper temporary library opens down the mall at 9 Mahara Place, in a former gallery and shop.',
    set: { lib: '9', b9: 'temp', b77: 'gallery', sky: 'day' }, mult: 1.25, task: 'boxes' },
  { id: 'grey', date: 'Aug 2019', year: 2019, at: 900000, focus: 15, title: 'Painted grey',
    text: 'The empty old library is painted dark grey while people decide what to do with it.',
    set: { b15: 'grey' }, mult: 1.05 },
  { id: 'murals', date: 'Jul 2020', year: 2020, at: 1.6e6, focus: 15, title: 'Murals!',
    text: "Artists Kate Hartmann and Ruth Robertson Taylor paint Frances Hodgkins murals on the empty library's walls.",
    set: { mural: true }, mult: 1.05 },
  { id: 'buy9', date: 'Sep 2022', year: 2022, at: 3e6, focus: 9, title: 'A home for the library',
    text: 'The council buys the 9 Mahara Place building, so the temporary library has a secure home.',
    set: {}, mult: 1.05 },
  { id: 'consult', date: 'Jun 2023', year: 2023, at: 5.5e6, focus: 15, title: 'What should the new library be?',
    text: 'More than 500 people visit a pop-up at 2 Mahara Place and leave over 3,000 ideas for a new library.',
    set: {}, mult: 1.05 },
  { id: 'vote', date: '31 Aug 2023', year: 2023, at: 1e7, focus: 15, big: true, era: 3, title: 'Fix the old building!',
    text: 'The council votes to refurbish and extend the old library building at 15 Mahara Place, instead of starting somewhere new.',
    set: {}, mult: 1.25 },
  { id: 'toi', date: '28 Oct 2023', year: 2023, at: 1.4e7, focus: 77, title: 'The gallery becomes Toi MAHARA',
    text: "Across the square, the building that was Waikanae's library from 1977 to 1996 reopens after a two-year rebuild. Mahara Gallery is now Toi MAHARA, Kāpiti's district art gallery.",
    set: { b77: 'toi' }, mult: 1.05 },
  { id: 'name', date: '15 May 2024', year: 2024, at: 2e7, focus: 15, big: true, title: 'A name is gifted',
    text: 'Te Ātiawa ki Whakarongotai gift the name Te Ara Whetū, "the passage of stars", from the mountains to the sea.',
    set: { named: true }, mult: 1.25, task: 'stars' },
  { id: 'concept', date: 'Sep 2024', year: 2024, at: 4e7, focus: 15, title: 'Safe inside again',
    text: "The old building has been stripped out and cleaned. Air tests show it's safe inside, and the plans go on display.",
    set: { b15: 'stripped' }, mult: 1.05 },
  { id: 'works', date: 'Jun 2025', year: 2025, at: 8e7, focus: 15, title: 'Early works begin',
    text: 'A fence goes up around the old building and builders start early work on the site.',
    set: { b15: 'works', lovestone: false }, mult: 1.05 },
  { id: 'build', date: 'Nov 2025', year: 2025, at: 2e8, focus: 15, big: true, title: 'Construction starts',
    text: 'Naylor Love signs the contract for the $15.4 million build. Up go the scaffolding and a tower crane.',
    set: { b15: 'build' }, mult: 1.25 },
  { id: 'recycle', date: 'May 2026', year: 2026, at: 4.5e8, focus: 15, title: 'Recycling the old library',
    text: '94% of the demolition waste is kept out of landfill. Shelves from Paraparaumu Library will be reused inside.',
    set: {}, mult: 1.05 },
  { id: 'roof', date: 'May 2026', year: 2026, at: 9e8, focus: 15, big: true, title: 'Concrete trucks!',
    text: 'Concrete trucks line up in Mahara Place to pour the floor of a brand new top storey.',
    set: { b15: 'roof', trucks: true }, mult: 1.1, task: 'pour' },
  { id: 'hoard', date: 'Jun 2026', year: 2026, at: 1.8e9, focus: 15, title: 'Art on the fence',
    text: 'Waikanae School, Ōtaki College and The Shed Project Kāpiti paint the construction hoardings.',
    set: { hoardart: true, trucks: false }, mult: 1.05 },
  { id: 'stair', date: 'Jul 2026', year: 2026, at: 3.5e9, focus: 15, title: 'An eight-tonne staircase',
    text: 'A giant steel staircase is lifted in by crane, right into the middle of the building.',
    set: { stair: true }, mult: 1.05 },
  { id: 'glass', date: 'Aug 2026', year: 2026, at: 7e9, focus: 15, big: true, title: 'Glass walls',
    text: 'Big glass panels go onto the new building. From inside you can see right over the town.',
    set: { b15: 'glass', stair: false }, mult: 1.1, task: 'glass' },
  { id: 'final', date: 'Nov 2026', year: 2026, at: 1.4e10, focus: 15, title: 'Nearly there',
    text: 'The glass curtain wall is finished, and the inside is being fitted out with shelves and furniture.',
    set: { b15: 'final' }, mult: 1.05 },
  { id: 'open', date: 'Early 2027', year: 2027, at: 2.8e10, focus: 15, big: true, title: 'Te Ara Whetū opens!',
    text: 'Three storeys, a roof terrace, about 25,000 books and views from the mountains to the sea.',
    set: { b15: 'open', lib: '15new', b9: 'empty', sky: 'dusk', hoardart: false }, mult: 2, task: 'ribbon' },
];
const N_EVENTS = HISTORY.length;
const HIST_IDX = Object.fromEntries(HISTORY.map((h, i) => [h.id, i]));

/* ---------- hands-on tasks for the big moments (SVG coordinates on the panorama) ---------- */
const TASKS = {
  unveil: { verb: 'Unveil the Love Stone', how: 'Tap the cloth to unveil the Love Stone!', kind: 'cloth', pts: [[452, 171]], done: 'The Love Stone is unveiled at the front door. Welcome to the new library!' },
  mould: { verb: 'Scrub out the mould', how: 'Tap every mould spot to scrub it away!', kind: 'mould', pts: [[249, 76], [355, 99], [410, 162], [494, 190], [539, 108]], done: 'Scrubbed! The building still needs a big clean before anyone can go back in.' },
  boxes: { verb: 'Move the books', how: 'Tap each box of books to carry it to 9 Mahara Place!', kind: 'box', pts: [[379, 205], [388, 204], [397, 205], [393, 200], [403, 201]], to: [613, 200], done: 'All moved! The temporary library is open for business.' },
  stars: { verb: 'Light the stars', how: 'Tap the stars to light the passage of stars!', kind: 'star', pts: [[250, 40], [294, 26], [340, 18], [386, 16], [432, 18], [478, 26], [520, 40]], done: 'Te Ara Whetū: the passage of stars, from the mountains to the sea.' },
  pour: { verb: 'Pour the top floor', how: 'Tap the roof to pour the concrete!', kind: 'pour', pts: [[288, 81], [351, 90], [414, 99], [478, 108]], done: 'The new top floor is poured. Two storeys are about to become three!' },
  glass: { verb: 'Fit the glass', how: 'Tap each frame to fit a glass panel!', kind: 'glass', pts: [[316, 103], [376, 111], [427, 117], [316, 126], [376, 131], [428, 136], [316, 148], [376, 152], [428, 155]], done: 'The glass is in. You can see right over the town!' },
  ribbon: { verb: 'Cut the ribbon', how: 'Tap the ribbon to open Te Ara Whetū!', kind: 'ribbon', pts: [[285, 191]], done: 'Te Ara Whetū is open! Haere mai, welcome!' },
};

/* ---------- helpers: they read for you ---------- */
const HELPERS = [
  { id: 'worm', name: 'Bookworm', era: 1, cost: 15, pps: 0.5, desc: 'Munches through a page every two seconds.', color: '#ff9fc8' },
  { id: 'vol', name: 'Volunteer', era: 1, cost: 100, pps: 2.5, desc: 'Shelves returns and knows where everything lives.', color: '#ffb17d' },
  { id: 'trolley', name: 'Returns trolley', era: 1, cost: 600, pps: 12.5, desc: 'One squeaky wheel, endless books.', color: '#9fe2f5' },
  { id: 'story', name: 'Storytime', era: 1, cost: 3500, pps: 55, desc: 'Rhymes, songs and a very dramatic bear voice.', color: '#c7b5ff' },
  { id: 'lib', name: 'Librarian', era: 1, cost: 20000, pps: 250, desc: 'Finds the book you half remember from its cover.', color: '#5fd07c' },
  { id: 'apnk', name: 'Public computer', era: 1, cost: 120000, pps: 1125, desc: "Free internet through the People's Network.", color: '#8fb6ff' },
  { id: 'popup', name: 'Pop-up shelf', era: 2, cost: 700000, pps: 5000, desc: "A library wherever there's a spare corner.", color: '#ffd23f' },
  { id: 'courier', name: 'Book courier', era: 2, cost: 4e6, pps: 22500, desc: 'Brings books over from other libraries.', color: '#e8b48a' },
  { id: 'club', name: 'Book club', era: 2, cost: 2.5e7, pps: 1e5, desc: 'Twelve readers, one book, forty opinions.', color: '#ff8f8f' },
  { id: 'maker', name: 'Makerspace', era: 3, cost: 1.5e8, pps: 4.5e5, desc: '3D printers, sewing machines and a robot.', color: '#a6ecb0' },
  { id: 'seat', name: 'Window seat', era: 3, cost: 1e9, pps: 2e6, desc: 'A cushion behind the new glass, looking out to the hills.', color: '#bfeefa' },
  { id: 'gazer', name: 'Stargazer', era: 3, cost: 7e9, pps: 8.75e6, desc: 'Reads under the stars on the roof terrace.', color: '#ffe684' },
];
const ERA_NAMES = { 1: 'The old library', 2: 'Pop-up years', 3: 'Building Te Ara Whetū' };

/* ---------- upgrades ---------- */
const TIER_NAMES = {
  worm: [['Bigger appetite', 'Hungrier worms, faster pages.'], ['Tiny reading glasses', 'Now they can read the small print.'], ['Silverfish truce', 'No more fighting over the encyclopedias.']],
  vol: [['Friends of the Library', 'A whole crew of helpers.'], ['Name badges', 'Everyone knows who to ask.'], ['Morning tea roster', 'Scones power the shelving.']],
  trolley: [['Squeak-free wheels', 'Faster, quieter rounds.'], ['Returns slot by the door', 'Books come back day and night.'], ['Sorted by Dewey number', 'Straight back to the right shelf.']],
  story: [['Puppet drawer', 'The possum puppet steals the show.'], ['Ukulele for rhyme time', 'Three chords, forty toddlers.'], ['School holiday programme', 'The busiest weeks of the year.']],
  lib: [["Reader's advice", '"If you liked that, try this one."'], ['The cardigan of wisdom', 'Pockets full of bookmarks.'], ['The perfect shush', 'One look is enough.']],
  apnk: [['Free Wi-Fi', 'Bring your own device.'], ['A printer that works', 'A rare and wonderful thing.'], ['Tech help drop-ins', 'Learn to video call the grandkids.']],
  popup: [['Folding tables', 'Set up anywhere in ten minutes.'], ['Sign on the footpath', 'People can find you now.'], ['Regulars', 'The pop-up has its own fan club.']],
  courier: [['SMART Libraries network', 'Books from partner libraries, on request.'], ['Holds shelf', 'Your name on a slip, your book waiting.'], ['Express run', 'Same-week delivery.']],
  club: [['Biscuits', 'Attendance doubles.'], ['A spoiler policy', 'Peace returns to the group.'], ['Extra copies', 'No more waiting for the only copy.']],
  maker: [['3D printer', 'Prints bookmarks, mostly.'], ['Sewing machines', 'A costume for every storytime.'], ['Coding club', 'The robot can now say hello.']],
  seat: [['Mountains-to-sea view', 'The top floor looks from the hills to the sea.'], ['Cushions', 'Very hard to leave.'], ['Afternoon sun', 'Warm pages.']],
  gazer: [['Telescope', 'Every star a little closer.'], ['Blankets', 'Cosy under the night sky.'], ['Clear nights', 'Not a cloud in sight.']],
};
const TIERS = [[1, 10], [10, 50], [25, 500]];
const reached = (id) => HIST_IDX[id] < S.step;
const UPGRADES = [
  { id: 'card', name: 'Library card', cost: 50, kind: 'click', mult: 2, eff: 'Taps read twice as many pages.', unlock: () => true },
  { id: 'stamp', name: 'Due-date stamp', cost: 600, kind: 'click', mult: 2, eff: 'Ka-chunk! Taps read twice as many pages.', unlock: () => S.clicks >= 30 },
  { id: 'speed', name: 'Speed reading', cost: 15000, kind: 'clickPps', pct: 0.03, eff: 'Each tap also reads 3% of your pages per second.', unlock: () => S.clicks >= 150 },
  { id: 'torch', name: 'Reading by torchlight', cost: 5e6, kind: 'clickPps', pct: 0.03, eff: 'Each tap reads another 3% of your pages per second.', unlock: () => S.clicks >= 500 && era() >= 2 },
  { id: 'starlight', name: 'Reading by starlight', cost: 2e9, kind: 'clickPps', pct: 0.04, eff: 'Each tap reads another 4% of your pages per second.', unlock: () => S.clicks >= 1200 && era() >= 3 },
  { id: 'lovestone', name: 'The Love Stone', cost: 6000, kind: 'starFreq', mult: 2, date: '1996', fact: 'The Love Stone sculpture was unveiled at the entrance when the library opened on 6 April 1996.', eff: 'Runaway books come twice as often.', unlock: () => reached('move96') },
  { id: 'bucket', name: 'Bucket under the leak', cost: 25000, kind: 'mould', mult: 2, date: '1995–2018', fact: 'Leaks were reported in the building as early as 1995.', eff: 'Cleaning a mould spot gives twice as many pages.', unlock: () => S.mould >= 1 && era() === 1 },
  { id: 'items', name: '27,800 items cleaned', cost: 100000, kind: 'global', mult: 1.15, date: 'Dec 2018', fact: 'After the closure, about 27,800 library items were sent away to be decontaminated.', eff: 'All reading +15%.', unlock: () => reached('closure') },
  { id: 'murals', name: 'Frances Hodgkins murals', cost: 2e6, kind: 'global', mult: 1.1, date: 'Jul 2020', fact: 'Kate Hartmann and Ruth Robertson Taylor painted the murals on the closed library in 2020.', eff: 'All reading +10%.', unlock: () => reached('murals') },
  { id: 'studio', name: 'Studio Pacific on board', cost: 6e7, kind: 'global', mult: 1.15, date: 'Feb 2024', fact: 'Studio Pacific was picked as the architect from 15 tenders.', eff: 'All reading +15%.', unlock: () => reached('vote') },
  { id: 'strong', name: 'Strong enough for three', cost: 3e8, kind: 'global', mult: 1.1, date: '2024', fact: 'Engineers found the old structure could carry a third floor with only minor strengthening.', eff: 'All reading +10%.', unlock: () => reached('concept') },
  { id: 'hoarding', name: 'Hoarding art', cost: 2e9, kind: 'global', mult: 1.1, date: 'Jun 2026', fact: 'Waikanae School, Ōtaki College and The Shed Project Kāpiti painted the construction hoardings.', eff: 'All reading +10%.', unlock: () => reached('hoard') },
  { id: 'brick', name: 'Pūrapurawhetū brickwork', cost: 2.5e10, kind: 'starPower', mult: 2, date: '2026', fact: 'A tukutuku star pattern in brick sits above the new entrance. Studio Pacific co-designed it with iwi representative Tracey Morgan.', eff: 'Runaway books are twice as lucky.', unlock: () => reached('final') },
  { id: 'rooms', name: 'Waitī and Waitā rooms', cost: 4e10, kind: 'global', mult: 1.15, date: '2026', fact: 'Two upstairs meeting rooms are named Waitī and Waitā. One faces the mountains and fresh water, the other faces the sea.', eff: 'All reading +15%.', unlock: () => reached('final') },
  { id: 'shelves', name: '25,000 books', cost: 2e11, kind: 'global', mult: 1.2, date: '2027', fact: 'Te Ara Whetū holds about 25,000 books, with 40,000 more available through the SMART Libraries network.', eff: 'All reading +20%.', unlock: () => reached('open') },
];
HELPERS.forEach((h) => TIERS.forEach(([need, cm], i) => {
  const [name, flav] = TIER_NAMES[h.id][i];
  UPGRADES.push({ id: `${h.id}-${i}`, name, cost: h.cost * cm, kind: 'helper', helper: h.id, eff: `${h.name}s read twice as fast. ${flav}`, unlock: () => (S.helpers[h.id] || 0) >= need });
}));
const UP_BY_ID = Object.fromEntries(UPGRADES.map((u) => [u.id, u]));

/* ---------- badges ---------- */
const BADGES = [
  { id: 'p1', name: 'First page', desc: 'Read a page', test: () => S.total >= 1 },
  { id: 'p1k', name: 'Bookish', desc: 'Read 1,000 pages', test: () => S.total >= 1e3 },
  { id: 'p1m', name: 'Avid reader', desc: 'Read a million pages', test: () => S.total >= 1e6 },
  { id: 'p1b', name: 'Speed of light', desc: 'Read a billion pages', test: () => S.total >= 1e9 },
  { id: 'c100', name: 'Page turner', desc: 'Tap 100 times', test: () => S.clicks >= 100 },
  { id: 'c1000', name: "Can't put it down", desc: 'Tap 1,000 times', test: () => S.clicks >= 1000 },
  { id: 'streak', name: 'On a roll', desc: 'Reach a full reading streak', test: () => S.bestStreak >= 1 },
  { id: 'w10', name: 'Worm farm', desc: 'Own 10 bookworms', test: () => (S.helpers.worm || 0) >= 10 },
  { id: 'every', name: 'Full staff', desc: 'Own one of every helper', test: () => HELPERS.every((h) => (S.helpers[h.id] || 0) > 0) },
  { id: 'star1', name: 'Book catcher', desc: 'Catch a runaway book', test: () => S.stars >= 1 },
  { id: 'mould1', name: 'Spot clean', desc: 'Clean a mould spot', test: () => S.mould >= 1 },
  { id: 'q3', name: 'History buff', desc: 'Answer 3 history questions right', test: () => S.quizRight >= 3 },
  { id: 'q10', name: 'Historian', desc: 'Answer 10 history questions right', test: () => S.quizRight >= 10 },
  { id: 'e1996', name: 'Moving day', desc: 'Reach 1996', test: () => reached('move96') },
  { id: 'e2019', name: 'Down the mall', desc: 'Open the temporary library', test: () => reached('temp') },
  { id: 'e2024', name: 'The passage of stars', desc: 'Receive the name', test: () => reached('name') },
  { id: 'eopen', name: 'Opening day', desc: 'Open Te Ara Whetū', test: () => S.opened },
  { id: 'tt', name: 'Time traveller', desc: 'Open an old book from your shelf', test: () => S.timeTravel >= 1 },
  { id: 'tasks', name: 'Helping hands', desc: 'Finish every hands-on job', test: () => Object.keys(TASKS).every((k) => S.tasksDone && S.tasksDone[k]) },
];

/* ---------- news ticker: extra real events, unlocked by the star path ---------- */
const NEWS = [
  { at: 'y1977', d: '1977', t: "Waikanae's library opens on Mahara Place. Today the building is the Toi MAHARA gallery." },
  { at: 'y1977', d: '1979', t: 'Aerial photos show an empty site where the post office will be built.' },
  { at: 'post', d: 'Feb 1982', t: 'The Waikanae Post Office opens at 15 Mahara Place.' },
  { at: 'move96', d: '1995', t: 'Leaks are reported in the building as early as 1995, according to later reporting.' },
  { at: 'move96', d: '6 Apr 1996', t: 'The Love Stone sculpture is unveiled at the new library entrance.' },
  { at: 'apnk', d: 'Dec 2010', t: 'Photos show visitors using the public computers upstairs in the library.' },
  { at: 'matariki17', d: 'Aug 2017', t: 'A joint Waikanae library and gallery project is put on hold.' },
  { at: 'closure', d: 'Dec 2018', t: "Tests find toxic Stachybotrys mould in the children's area, the staffroom and the computer area." },
  { at: 'temp', d: 'Aug 2019', t: 'An independent review finds a "systemic failure" behind the closure.' },
  { at: 'murals', d: 'Jul 2020', t: 'A sign next to the murals tells people about the artwork.' },
  { at: 'buy9', d: 'Sep 2022', t: 'Council starts assessing sites for a new library, with $13.8 million in its long-term plan.' },
  { at: 'vote', d: 'Sep 2023', t: "The council buys 56–62 Main Road, later used as the builders' site office." },
  { at: 'vote', d: 'Feb 2024', t: 'Studio Pacific is chosen as architect from 15 tenders.' },
  { at: 'name', d: '27 Jun 2024', t: 'The plan is set: a new floor goes on top of the old building, with no extension out the back.' },
  { at: 'concept', d: '14 Mar 2025', t: 'Naylor Love is appointed to help finish the design and build it.' },
  { at: 'build', d: 'Dec 2025', t: 'New concrete walls start going in to strengthen the old frame.' },
  { at: 'roof', d: 'May 2026', t: 'The builders use the car park behind the library for craning, to cause less disruption in Mahara Place.' },
  { at: 'stair', d: 'Jul 2026', t: 'The new top floor is built from steel and pre-nailed timber framing.' },
  { at: 'glass', d: '26 Aug 2026', t: 'Women in construction tour the site. Some share memories of the old library.' },
  { at: 'final', d: 'Jul 2026', t: 'The council shares the story of Pūrapurawhetū, a tukutuku star pattern in brick above the new entrance.' },
  { at: 'open', d: '2027', t: 'Te Ara Whetū holds about 25,000 books, plus 40,000 more through the SMART Libraries network.' },
  { at: 'open', d: '2027', t: 'The top floor looks out to Kāpiti Island.' },
  { at: 'open', d: '2027', t: 'Upstairs meeting rooms Waitī and Waitā face the mountains and the sea.' },
  { at: 'open', d: '2027', t: 'More than 37,000 e-books and 7,000 e-audiobooks are available through Libby.' },
];

/* ---------- history questions ---------- */
const QUIZ = [
  { id: 'q1', after: 'post', q: 'What was 15 Mahara Place built as in 1982?', a: ['A post office', 'A fire station', 'A bakery'], why: 'It opened as the Waikanae Post Office in February 1982.' },
  { id: 'q2', after: 'move96', q: "Where was Waikanae's library before 1996?", a: ['In the 1977 building on Mahara Place', 'On the beach', 'In a train carriage'], why: 'From 1977 the library was in the building that is now Toi MAHARA.' },
  { id: 'q3', after: 'move96', q: 'Which sculpture was unveiled at the library door in 1996?', a: ['The Love Stone', 'A giant book', 'A kiwi statue'], why: 'The Love Stone was unveiled when the library opened on 6 April 1996.' },
  { id: 'q4', after: 'closure', q: 'Why did the old library close in 2018?', a: ['Toxic mould after years of leaks', 'It ran out of books', 'A storm blew the roof off'], why: 'Leaks let toxic mould grow inside the walls.' },
  { id: 'q5', after: 'closure', q: 'About how many items had to be cleaned after the closure?', a: ['About 27,800', 'About 50', 'About a million'], why: 'About 27,800 items needed decontaminating.' },
  { id: 'q6', after: 'newspace', q: 'In 2019 the pop-up library moved into which building?', a: ['The 1977 library building, by then a gallery', 'A bus', 'The beach hall'], why: "It moved into Mahara Gallery's newSPACE, Waikanae's library building from 1977." },
  { id: 'q7', after: 'temp', q: 'Where did the temporary library open in July 2019?', a: ['9 Mahara Place', 'Kāpiti Island', 'The train station'], why: 'It opened down the mall at 9 Mahara Place.' },
  { id: 'q8', after: 'murals', q: 'Whose art inspired the murals on the closed library?', a: ['Frances Hodgkins', 'Dr. Seuss', 'Banksy'], why: 'The 2020 murals celebrate the painter Frances Hodgkins.' },
  { id: 'q9', after: 'vote', q: 'In 2023 the council decided to…', a: ['Fix and extend the old library building', 'Build a library on the beach', 'Close the library for good'], why: 'On 31 August 2023 it voted to refurbish and extend 15 Mahara Place.' },
  { id: 'q10', after: 'name', q: 'What does Te Ara Whetū mean?', a: ['The passage of stars', 'The big library', 'The river mouth'], why: 'Te Ara Whetū means "the passage of stars", from the mountains to the sea.' },
  { id: 'q11', after: 'name', q: 'Who gifted the name Te Ara Whetū?', a: ['Te Ātiawa ki Whakarongotai', 'The builders', 'A radio station'], why: 'Te Ātiawa ki Whakarongotai gifted the name in May 2024.' },
  { id: 'q12', after: 'recycle', q: 'How much of the demolition waste was kept out of landfill?', a: ['94%', '9%', 'None of it'], why: '94% was diverted from landfill with Otaihanga Zero Waste.' },
  { id: 'q13', after: 'roof', q: 'How many storeys does Te Ara Whetū have?', a: ['Three', 'One', 'Ten'], why: 'A new top floor turned the two-storey building into three.' },
  { id: 'q14', after: 'stair', q: 'How heavy was the steel staircase craned in?', a: ['About 8 tonnes', 'About 8 kilograms', 'About 800 tonnes'], why: 'The custom steel stair weighs about eight tonnes.' },
  { id: 'q15', after: 'open', q: 'About how many books does Te Ara Whetū hold?', a: ['About 25,000', 'About 250', 'About 25 million'], why: 'About 25,000, with 40,000 more through the SMART Libraries network.' },
];


/* =====================================================================
   SETTINGS AND STATE
   ===================================================================== */
const $ = (s) => document.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const KIOSK = location.hash === '#kiosk' || /[?&]kiosk\b/.test(location.search);      // display tablets: quick play, no saving, auto-reset
const SAVE_KEY = 'tearawhetu-popup-v1';
const SPEED = KIOSK ? 1.5 : 1;
const EVENT_SCALE = KIOSK ? 1 : 4;
const COST_GROWTH = 1.15;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fresh = () => ({
  hasToi: 1,
  v: 1, pages: 0, total: 0, allTime: 0, clicks: 0, clickPages: 0,
  helpers: {}, upgrades: {}, step: 1, task: -1, tasksDone: {},
  badges: {}, quiz: {}, quizRight: 0, stars: 0, mould: 0, bestStreak: 0, timeTravel: 0, opened: false,
  chapter: 0, started: Date.now(), lastSave: Date.now(), introSeen: false,
});
let S = fresh();
let buffs = [];
let bulk = 1;
const cache = { pps: 0, basePps: 0, click: 1 };
let streak = 0, lastTap = 0;

/* =====================================================================
   ICONS
   ===================================================================== */
const I = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICONS = {
  worm: I('<path d="M3 16c2.5 0 2.5-4 5-4s2.5 4 5 4 2.5-4 5-4"/><circle cx="19.6" cy="9.6" r="1.3" fill="currentColor"/>'),
  vol: I('<circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/>'),
  trolley: I('<path d="M4 6h12v9H4z"/><path d="M4 10.5h12"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="13.5" cy="19" r="1.6"/><path d="M16 6l3-2"/>'),
  story: I('<path d="M3 6c3-1.5 6-1.5 9 1 3-2.5 6-2.5 9-1v12c-3-1.5-6-1.5-9 1-3-2.5-6-2.5-9-1z"/><path d="M12 7v12"/>'),
  lib: I('<circle cx="7" cy="14" r="3.5"/><circle cx="17" cy="14" r="3.5"/><path d="M10.5 14h3M3.5 13L2 9.5M20.5 13L22 9.5"/>'),
  apnk: I('<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M9 20h6M12 16v4"/>'),
  popup: I('<path d="M4 20V5h16v15M4 12.5h16"/><path d="M7 5v7.5M9.5 7v5.5M14 13v7M16.5 14.5V20"/>'),
  courier: I('<path d="M2 7h12v10H2zM14 10h4l3 3v4h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
  club: I('<path d="M4 5h11v8H9l-3 3v-3H4z"/><path d="M15 9h5v8h-2v3l-3-3h-4v-2"/>'),
  maker: I('<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>'),
  seat: I('<rect x="4" y="3" width="16" height="13"/><path d="M12 3v13M4 9.5h16"/><path d="M3 20h18"/>'),
  gazer: I('<path d="M12 2.5l1.9 7.6 7.6 1.9-7.6 1.9L12 21.5l-1.9-7.6L2.5 12l7.6-1.9z"/>'),
  lock: I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  tap: I('<path d="M9 13V5a2 2 0 0 1 4 0v6"/><path d="M13 10a2 2 0 0 1 4 0v2"/><path d="M17 11.5a2 2 0 0 1 3 1.7V16a6 6 0 0 1-6 6h-1.5a6 6 0 0 1-4.8-2.4L4.6 15.2a1.8 1.8 0 0 1 2.9-2.1L9 15"/>'),
  scroll: I('<path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a3 3 0 0 1-3-3V5"/><path d="M8 8h7M8 12h7M8 16h4"/>'),
  bucket: I('<path d="M5 9h14l-1.6 11H6.6z"/><path d="M7 9a5 5 0 0 1 10 0"/><path d="M12 2.5v2.5"/>'),
  book: I('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/>'),
};
const SOUND_ON = I('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>');
const SOUND_OFF = I('<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/>');

/* =====================================================================
   ECONOMY
   ===================================================================== */
const curIdx = () => S.step - 1;
function era() { let e = 1; for (let i = 0; i < S.step; i++) if (HISTORY[i].era) e = HISTORY[i].era; return e; }
const isClosed = () => reached('closure') && !reached('foyer');
const countOf = (id) => S.helpers[id] || 0;
const priceOf = (h, n = 1) => h.cost * Math.pow(COST_GROWTH, countOf(h.id)) * (Math.pow(COST_GROWTH, n) - 1) / (COST_GROWTH - 1);
function helperMult(id) { let m = 1; for (let i = 0; i < 3; i++) if (S.upgrades[`${id}-${i}`]) m *= 2; return m; }
function globalMult() {
  let m = 1;
  for (const u of UPGRADES) if (u.kind === 'global' && S.upgrades[u.id]) m *= u.mult;
  for (let i = 0; i < S.step; i++) m *= HISTORY[i].mult || 1;
  m *= 1 + 0.01 * Object.keys(S.badges).length;
  m *= 1 + 0.5 * S.chapter;
  if (isClosed()) m *= 0.5;
  return m;
}
function buffMult(kind) { let m = 1; for (const b of buffs) if (b.kind === kind) m *= b.mult; return m; }
function recompute() {
  let base = 0;
  for (const h of HELPERS) base += h.pps * countOf(h.id) * helperMult(h.id);
  cache.basePps = base * globalMult() * SPEED;
  cache.pps = cache.basePps * buffMult('prod');
  let clickMult = 1, pct = 0;
  for (const u of UPGRADES) {
    if (!S.upgrades[u.id]) continue;
    if (u.kind === 'click') clickMult *= u.mult;
    if (u.kind === 'clickPps') pct += u.pct;
  }
  cache.click = (2 * SPEED * clickMult * (1 + 0.5 * S.chapter) + cache.basePps * pct) * buffMult('click');
}
const bookFreq = () => (S.upgrades.lovestone ? 2 : 1) * (KIOSK ? 2 : 1);
const bookLuck = () => (S.upgrades.brick ? 2 : 1);
function earn(n) { S.pages += n; S.total += n; S.allTime += n; }
function spend(n) { if (S.pages + 1e-9 < n) return false; S.pages = Math.max(0, S.pages - n); return true; }

/* numbers kids can read: 1,234 then "1.23 million" */
const WORDS = ['million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion'];
function fmt(n, dec = 0) {
  if (!isFinite(n)) return '∞';
  if (n < 1000) return dec && n < 99.95 && n % 1 ? n.toFixed(1) : Math.floor(n).toLocaleString('en-NZ');
  if (n < 1e6) return Math.floor(n).toLocaleString('en-NZ');
  let i = Math.min(Math.floor(Math.log10(n) / 3) - 2, WORDS.length - 1);
  let v = n / Math.pow(1000, i + 2);
  if (v >= 999.95 && i < WORDS.length - 1) { i++; v /= 1000; }
  return `${v.toFixed(v < 100 ? 2 : 1)} ${WORDS[i]}`;
}

/* =====================================================================
   SOUND (off unless switched on: it's a library)
   ===================================================================== */
let soundOn = false, actx = null;
const TUNES = { tap: [[660, 0, 0.05]], buy: [[523, 0, 0.08], [784, 0.07, 0.1]], page: [[392, 0, 0.06], [523, 0.08, 0.08]], story: [[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.12], [1047, 0.3, 0.3]], star: [[988, 0, 0.08], [1319, 0.06, 0.14]], pop: [[880, 0, 0.06]], no: [[196, 0, 0.12]] };
function sfx(kind) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime;
    TUNES[kind].forEach(([f, at, len]) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = kind === 'no' ? 'square' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + at);
      g.gain.exponentialRampToValueAtTime(kind === 'tap' ? 0.045 : 0.09, t0 + at + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + len);
      o.connect(g).connect(actx.destination); o.start(t0 + at); o.stop(t0 + at + len + 0.02);
    });
  } catch (e) {}
}
function renderSound() {
  const b = $('#soundBtn');
  b.innerHTML = soundOn ? SOUND_ON : SOUND_OFF;
  b.setAttribute('aria-pressed', String(soundOn));
  b.setAttribute('aria-label', soundOn ? 'Sound is on. Turn sound off' : 'Sound is off. Turn sound on');
}

/* =====================================================================
   PARTICLES (paper scraps, confetti, sparkles) on one canvas
   ===================================================================== */
const fx = $('#fx'), fxc = fx.getContext('2d');
let parts = [];
function sizeFx() { const d = Math.min(2, window.devicePixelRatio || 1); fx.width = innerWidth * d; fx.height = innerHeight * d; fxc.setTransform(d, 0, 0, d, 0, 0); }
const PAPER = ['#fffaf0', '#fbf2df', '#ffe895'];
const CONFETTI = ['#ffd23f', '#ff9fc8', '#9fe2f5', '#5fd07c', '#c7b5ff', '#e8613c'];
function burst(x, y, n, kind = 'paper', spread = 1) {
  if (reduceMotion) n = Math.min(n, 4);
  for (let i = 0; i < n && parts.length < 260; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4 * spread, v = (kind === 'confetti' ? 5 : 3.2) + Math.random() * 4;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, life: 0, max: 50 + Math.random() * 30, kind,
      c: kind === 'confetti' ? CONFETTI[i % CONFETTI.length] : kind === 'star' ? '#ffd23f' : PAPER[i % 3], w: kind === 'paper' ? 11 : 8, h: kind === 'paper' ? 14 : 6 });
  }
  if (typeof wake === 'function') wake();
}
function celebrate() { const w = innerWidth; for (let k = 0; k < 5; k++) setTimeout(() => burst(w * (0.2 + Math.random() * 0.6), innerHeight * 0.45, 40, 'confetti', 1.4), k * 220); }
let fxDirty = false;
function drawFx() {
  if (!parts.length) { if (fxDirty) { fxc.clearRect(0, 0, innerWidth, innerHeight); fxDirty = false; } return; }
  fxDirty = true;
  fxc.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life < p.max);
  for (const p of parts) {
    p.life++; p.vy += 0.18; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
    const a = 1 - Math.max(0, (p.life - p.max * 0.6) / (p.max * 0.4));
    fxc.save(); fxc.globalAlpha = a; fxc.translate(p.x, p.y); fxc.rotate(p.r);
    fxc.fillStyle = p.c; fxc.strokeStyle = '#1b1830'; fxc.lineWidth = 2;
    if (p.kind === 'star') {
      fxc.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 2.6 : 7; const an = (i * Math.PI) / 4; fxc.lineTo(Math.cos(an) * r, Math.sin(an) * r); } fxc.closePath(); fxc.fill(); fxc.stroke();
    } else { fxc.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); fxc.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h); }
    if (p.kind === 'paper') { fxc.beginPath(); fxc.moveTo(-3, -3); fxc.lineTo(3, -3); fxc.moveTo(-3, 1); fxc.lineTo(3, 1); fxc.lineWidth = 1; fxc.stroke(); }
    fxc.restore();
  }
}

/* =====================================================================
   RAIN (May 2018: "the roof has been leaking for years")
   Drops fall from under the storm clouds on the sky piece and splash on
   the ground page. Everything is measured from the pop-up pieces each
   frame, so it lines up at any zoom and on any screen.
   ===================================================================== */
const rainCv = $('#rain'), rainCx = rainCv.getContext('2d');
const WIND = -0.17;                 // sideways drift per pixel of fall
let rainOn = false, rainLevel = 0, rainSpawn = 0, rainW = 0, rainH = 0, rainDirty = false;
let drops = [], splashes = [];
function rainGeom() {
  const s = stage.getBoundingClientRect();
  const sky = bookEl.querySelector('.p-back').getBoundingClientRect();
  const town = bookEl.querySelector('.p-town').getBoundingClientRect();
  const bk = bookEl.getBoundingClientRect();
  const k = sky.width / 668;        // 1 = the book at its design size
  return {
    k, L: sky.left - s.left + sky.width * 0.012, R: sky.right - s.left - sky.width * 0.012,
    top: sky.top - s.top + sky.height * (127.5 / 218),   // just under the cloud bank
    skyB: sky.bottom - s.top, ground: town.bottom - s.top,
    front: bk.bottom - s.top - 6 * k, bl: bk.left - s.left + 8 * k, br: bk.right - s.left - 8 * k,
  };
}
function spawnDrop(g, anywhere) {
  const d = Math.random();                                         // 0 = far away, 1 = close up
  const yl = g.ground + (g.front - g.ground) * (0.04 + 0.96 * d);  // where it lands on the page
  const t = Math.max(0, (yl - g.skyB) / Math.max(1, g.front - g.skyB));
  const l = g.L + (g.bl - g.L) * t, r = g.R + (g.br - g.R) * t;
  const sc = g.k * (0.6 + 0.7 * d);
  const len = (12 + 12 * d) * Math.max(g.k, 0.9);
  const y0 = anywhere ? g.top + Math.random() * (yl - g.top) : g.top - len - Math.random() * 24 * g.k;
  const xl = l + Math.random() * (r - l);
  drops.push({ x: xl - WIND * (yl - y0), y: y0, yl, vy: (560 + 460 * d) * g.k, sc, len, d });
}
function drawRain(dt) {
  const want = rainOn && !bookEl.classList.contains('folded') && intro.hidden && !document.hidden;
  rainLevel = Math.max(0, Math.min(1, rainLevel + (want ? 0.8 : -2) * dt));
  if (!rainLevel && !drops.length && !splashes.length) {
    if (rainDirty) { rainCx.clearRect(0, 0, rainW, rainH); rainDirty = false; }
    return;
  }
  const w = stage.clientWidth, h = stage.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
  if (w !== rainW || h !== rainH) { rainW = w; rainH = h; rainCv.width = Math.round(w * dpr); rainCv.height = Math.round(h * dpr); rainCx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  const g = rainGeom();
  if (g.R - g.L < 40) return;
  // spawn: a steady shower, heavier on bigger screens
  const target = (g.R - g.L) * 0.85 * rainLevel;
  if (reduceMotion) {                                // still rain: a fixed set of streaks, no movement
    const n = Math.round(target * 0.35);
    if (drops.length > n) drops.length = n;
    while (drops.length < n) spawnDrop(g, true);
  } else {
    rainSpawn += dt * target;
    while (rainSpawn >= 1 && drops.length < 600) { rainSpawn -= 1; spawnDrop(g, false); }
    for (const p of drops) {
      p.y += p.vy * dt; p.x += WIND * p.vy * dt;
      if (p.y >= p.yl) {
        p.dead = true;
        if (Math.random() < 0.85) splashes.push({ x: p.x, y: p.yl, t: 0, sc: p.sc, life: 0.26 + 0.14 * p.d, flip: Math.random() < 0.5 ? -1 : 1 });
      }
    }
    drops = drops.filter((p) => !p.dead);
    for (const s of splashes) s.t += dt;
    splashes = splashes.filter((s) => s.t < s.life);
  }

  const c = rainCx;
  c.clearRect(0, 0, rainW, rainH);
  rainDirty = true;
  c.save();
  // only inside the scene: under the clouds, over the sky piece and the ground page
  c.beginPath();
  c.moveTo(g.L, g.top - 1); c.lineTo(g.R, g.top - 1); c.lineTo(g.R, g.skyB);
  c.lineTo(g.br + 6 * g.k, g.front + 12 * g.k); c.lineTo(g.bl - 6 * g.k, g.front + 12 * g.k); c.lineTo(g.L, g.skyB);
  c.closePath(); c.clip();
  c.lineCap = 'round';
  // drops in three depth bands: thin and pale far away, fat and bright up close
  for (let band = 0; band < 3; band++) {
    c.beginPath();
    for (const p of drops) {
      if (Math.min(2, Math.floor(p.d * 3)) !== band) continue;
      c.moveTo(p.x - WIND * p.len, p.y - p.len); c.lineTo(p.x, p.y);
    }
    const lk = Math.max(g.k, 0.95);                 // never thinner than about a pixel on small phones
    c.strokeStyle = `rgba(28, 46, 84, ${0.2 + band * 0.07})`; c.lineWidth = (1.9 + band * 0.9) * lk; c.stroke();
    c.strokeStyle = `rgba(238, 249, 255, ${0.62 + band * 0.14})`; c.lineWidth = (0.9 + band * 0.55) * lk; c.stroke();
  }
  // splashes: a little ring on the ground and two droplets that hop out (drawn in four batches by fade)
  for (let q = 0; q < 4; q++) {
    const a = 1 - (q + 0.5) / 4;
    const rings = new Path2D(), dots = new Path2D();
    let any = false, sc = 1;
    for (const s of splashes) {
      const u = s.t / s.life;
      if (Math.min(3, Math.floor(u * 4)) !== q) continue;
      any = true; sc = s.sc;
      const rx = (1.5 + 7 * u) * s.sc, ry = rx * 0.34;
      rings.moveTo(s.x + rx, s.y); rings.ellipse(s.x, s.y, rx, ry, 0, 0, Math.PI * 2);
      const hop = 4 * u * (1 - u) * 9 * s.sc, spread = (2 + 6 * u) * s.sc;
      dots.moveTo(s.x - spread * s.flip + 1.25 * s.sc, s.y - hop);
      dots.arc(s.x - spread * s.flip, s.y - hop, 1.25 * s.sc, 0, Math.PI * 2);
      dots.moveTo(s.x + spread * 0.8 * s.flip + 1.05 * s.sc, s.y - hop * 0.75);
      dots.arc(s.x + spread * 0.8 * s.flip, s.y - hop * 0.75, 1.05 * s.sc, 0, Math.PI * 2);
    }
    if (!any) continue;
    c.strokeStyle = `rgba(40, 78, 120, ${0.5 * a})`; c.lineWidth = 1.3 * sc; c.stroke(rings);
    c.fillStyle = `rgba(240, 250, 255, ${a})`; c.fill(dots);
    c.strokeStyle = `rgba(28, 46, 84, ${0.45 * a})`; c.lineWidth = 0.8 * sc; c.stroke(dots);
  }
  c.restore();
}

/* =====================================================================
   READING: tapping the book
   ===================================================================== */
const stage = $('#stage'), bookEl = $('#book');
let floats = 0, lastTapSound = 0;
function read(ev) {
  const now = performance.now();
  streak = Math.min(1, now - lastTap < 650 ? streak + 0.06 : Math.max(0, streak - 0.2));
  lastTap = now;
  if (streak >= 1 && !S.bestStreak) { S.bestStreak = 1; }
  const gain = cache.click * (1 + streak);
  earn(gain);
  S.clicks++; S.clickPages += gain;
  bookEl.classList.remove('boing'); void bookEl.offsetWidth; bookEl.classList.add('boing');
  const r = stage.getBoundingClientRect();
  const cx = ev && ev.clientX ? ev.clientX : r.left + r.width / 2;
  const cy = ev && ev.clientY ? ev.clientY : r.top + r.height * 0.55;
  burst(cx, cy, 3, 'paper');
  if (floats < 24) {
    floats++;
    const f = document.createElement('div');
    f.className = 'float';
    f.textContent = `+${fmt(gain, 1)}`;
    f.style.left = `${cx - r.left}px`; f.style.top = `${cy - r.top - 24}px`;
    stage.appendChild(f);
    setTimeout(() => { f.remove(); floats--; }, 900);
  }
  if (now - lastTapSound > 70) { lastTapSound = now; sfx('tap'); }
  if (S.clicks === 1) $('#taphint').hidden = true;
  renderTop();
}
stage.addEventListener('pointerdown', (e) => {
  if (e.button > 0 || e.target.closest('.taskbtn, .quizbtn, .banner, button')) return;
  read(e);
});
stage.addEventListener('keydown', (e) => { if (e.target.closest('button')) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); read(null); } });

/* =====================================================================
   THE POP-UP BOOK: what the paper scenes show for any year
   ===================================================================== */
const view = $('#view');
const WHEN = $$('[data-when]', bookEl).map((node) => ({
  node,
  tests: node.getAttribute('data-when').split('&').map((part) => {
    const neg = part.startsWith('!');
    const p = neg ? part.slice(1) : part;
    if (p.includes('=')) { const [k, v] = p.split('='); const vals = v.split('|'); return (st) => vals.includes(String(st[k])) !== neg; }
    return (st) => (neg ? !st[p] : !!st[p]);
  }),
}));
function stateAt(idx) {
  const st = { lovestone: false, apnk: false, glow: false, orange: false, foyer: false, mural: false, hoardart: false, trucks: false, stair: false, vintage: false, named: false, rain: false };
  for (let i = 0; i <= idx; i++) Object.assign(st, HISTORY[i].set);
  return st;
}
const PIN = {
  '77': { x: 84, y: 121, t: 'LIBRARY' }, '15': { x: 279, y: 49, t: 'LIBRARY' }, '15foyer': { x: 359, y: 184, t: 'POP-UP' },
  '77pop': { x: 66, y: 184, t: 'POP-UP' }, '9': { x: 653, y: 115, t: 'LIBRARY' }, '15new': { x: 393, y: 67, t: 'TE ARA WHETŪ' },
};
const FOCUS_X = { 77: 100, 15: 370, 9: 656 };
let shownIdx = -1, viewIdx = null;
function paintScene(idx) {
  const st = stateAt(idx), h = HISTORY[idx];
  view.dataset.b15 = st.b15; view.dataset.b77 = st.b77; view.dataset.b9 = st.b9; view.dataset.sky = st.sky;
  view.classList.toggle('vintage', !!st.vintage);
  WHEN.forEach((w) => w.node.classList.toggle('off', !w.tests.every((t) => t(st))));
  const pin = PIN[st.lib], pinEl = $('#pin');
  pinEl.classList.toggle('gone', !pin);
  if (pin) {
    pinEl.style.transform = `translate(${pin.x}px, ${pin.y}px)`;
    const w = pin.t.length * 5.6 + 32, shift = -w / 2 + 30;
    $('#pinBox').setAttribute('x', -w / 2); $('#pinBox').setAttribute('width', w);
    $('#pinIcon').setAttribute('transform', `translate(${shift} 0)`);
    $('#pinText').textContent = pin.t; $('#pinText').setAttribute('x', ((-8 + shift) + w / 2) / 2 + 1);
  }
  rainOn = !!st.rain;
  $('#printYear').textContent = h.year;
  $('#printTitle').textContent = h.title;
  baseFocus = FOCUS_X[h.focus] || 365;
  shownIdx = idx;
  walkSig = null; renderWalkers(st);
  layoutView();
}
/* turn the page: pop-ups fold flat, a page sweeps over, the new year folds up */
let turning = false, turnQueue = null, turnGen = 0;
function turnTo(idx) {
  if (idx === shownIdx && !turning) return;
  if (turning) { turnQueue = idx; return; }
  if (reduceMotion || shownIdx < 0) { paintScene(idx); return; }
  turning = true;
  const fwd = idx > shownIdx;
  const sheet = $('#sheet');
  const gen = ++turnGen;
  bookEl.classList.add('folded');
  setTimeout(() => { if (gen !== turnGen) return; sheet.className = `sheet ${fwd ? 'fwd' : 'bwd'}`; sfx('page'); }, 260);
  setTimeout(() => { if (gen === turnGen) paintScene(idx); }, 560);
  setTimeout(() => { if (gen === turnGen) bookEl.classList.remove('folded'); }, 880);
  setTimeout(() => {
    if (gen !== turnGen) return;
    sheet.className = 'sheet';
    turning = false;
    if (turnQueue !== null) { const q = turnQueue; turnQueue = null; turnTo(q); }
  }, 1300);
}

/* fit the book to the stage; on small screens zoom in and pan to the building that matters */
let baseFocus = 95, spot = null, spotT = 0;
function spotlight(x, ms) { spot = { x }; layoutView(); clearTimeout(spotT); spotT = setTimeout(() => { spot = null; layoutView(); }, ms); }
/* the box the book and its pop-ups fill, in the view's own 700×470 units (measured once) */
let content = { x: 30, y: 20, w: 640, h: 440 };
function measureContent() {
  const old = view.style.transform, oldT = view.style.transition;
  view.style.transition = 'none'; view.style.transform = 'none';
  const v = view.getBoundingClientRect();
  // fit the buildings and the book; the top of the sky backdrop may crop off
  const rs = ['.cover', '.p-town', '.p-front'].map((q) => bookEl.querySelector(q).getBoundingClientRect());
  const x0 = Math.min(...rs.map((r) => r.left)) - v.left, y0 = Math.min(...rs.map((r) => r.top)) - v.top - 46;
  const x1 = Math.max(...rs.map((r) => r.right)) - v.left, y1 = Math.max(...rs.map((r) => r.bottom)) - v.top;
  if (x1 - x0 > 100 && y1 - y0 > 100) content = { x: x0, y: y0, w: x1 - x0, h: y1 - y0, fy0: rs[1].top - v.top - 50, fy1: rs[0].bottom - v.top - 18, sy0: rs[1].top - v.top - 6, sy1: rs[2].bottom - v.top + 10 };
  view.style.transform = old; void view.offsetWidth; view.style.transition = oldT;
}
function layoutView() {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  let focusX = baseFocus;
  if (taskActive() && S.task === shownIdx) {
    const t = TASKS[HISTORY[S.task].task], xs = t.pts.map((p) => p[0]).concat(t.to ? [t.to[0]] : []);
    focusX = (Math.min(...xs) + Math.max(...xs)) / 2;
  }
  const pad = 14;
  let s = Math.min((w - pad * 2) / content.w, (h - pad * 2) / content.h);
  let cx = content.x + content.w / 2;
  let cy = content.y + content.h / 2;
  if (w < 620) {
    // small screens: zoom in and pan to the building the story is about
    const zoom = taskActive() ? 1.75 : 1.5;
    s = Math.min(s * zoom, (h - pad) / (content.h * 0.82));
    const fx = 10 + 18 + (focusX / 760) * 644;
    const half = (w / 2) / s;
    cx = Math.max(content.x + half, Math.min(content.x + content.w - half, fx));
    if (content.w * s <= w) cx = content.x + content.w / 2;
  } else if (content.fy1) {
    // bigger screens: frame the buildings and the page, and pan gently to the building the story is about
    const z = Math.min((h - 10) / (content.fy1 - content.fy0), s * 1.42);
    if (z > s) {
      s = z;
      const fx = 10 + 18 + (focusX / 760) * 644, half = (w / 2) / s;
      cx = Math.max(content.x + half, Math.min(content.x + content.w - half, fx));
      if (content.w * s <= w) cx = content.x + content.w / 2;
      cy = (content.fy0 + content.fy1) / 2;
    }
  }
  if (spot && content.sy1 && $('#taskBanner').hidden) {
    // a page has just opened: move in on whatever changed so it is not missed
    s = Math.max(s, Math.min(s * 1.34, (h - 6) / (content.sy1 - content.sy0)));
    const fx = 10 + 18 + (spot.x / 760) * 644, half = (w / 2) / s;
    cx = Math.max(content.x + half, Math.min(content.x + content.w - half, fx));
    if (content.w * s <= w) cx = content.x + content.w / 2;
    cy = (content.sy0 + content.sy1) / 2;
  }
  const tx = (350 - cx) * s, ty = (235 - cy) * s + (w < 620 ? (h - content.h * s) / 2 * 0 : 0);
  view.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s.toFixed(3)})`;
}

/* people and helpers walking along the front pop-up */
const SKIN = ['#f2c9a5', '#d9a074', '#a8714a', '#7a4e2d', '#f5d6b8', '#c68a5e'];
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rnd = rng(7);
function person(shirt, extra = '', scale = 1) {
  const skin = SKIN[Math.floor(rnd() * SKIN.length)];
  return `<g transform="scale(${scale})"><g class="bob"><rect class="o" x="-5" y="-7" width="4" height="8" rx="1.5" fill="#4b4a66"/><rect class="o" x="1" y="-7" width="4" height="8" rx="1.5" fill="#4b4a66"/><rect class="o" x="-6.5" y="-21" width="13" height="16" rx="5" fill="${shirt}"/><circle class="o" cx="0" cy="-26" r="5.2" fill="${skin}"/>${extra}${walkWet ? umbrella() : ''}</g></g>`;
}
/* everyone out walking in the 2018 rain gets an umbrella */
let walkWet = false;
const UMB = ['#e8613c', '#2f6fd6', '#ffd23f', '#ff9fc8', '#5fd07c', '#c7b5ff'];
function umbrella() {
  const c = UMB[Math.floor(rnd() * UMB.length)];
  return `<path d="M-6 -15 V-44" stroke="#1b1830" stroke-width="1.7" stroke-linecap="round"/><path d="M-22 -41 C-21 -56 9 -56 10 -41 C6 -44 2 -44 -2 -41 C-6 -44 -10 -44 -14 -41 C-18 -44 -20 -43 -22 -41 Z" fill="${c}" stroke="#1b1830" stroke-width="1.9" stroke-linejoin="round"/><path d="M-6 -41 C-7 -48 -7 -51 -6 -52.5" fill="none" stroke="#1b1830" stroke-width="1.2"/><path d="M-6 -52.5 V-56" stroke="#1b1830" stroke-width="1.9" stroke-linecap="round"/>`;
}
const SPRITES = {
  worm: () => `<g class="bob"><path d="M-12 -3 q3 -7 6 0 q3 -7 6 0 q3 -7 6 0" fill="none" stroke="#1b1830" stroke-width="6.5" stroke-linecap="round"/><path d="M-12 -3 q3 -7 6 0 q3 -7 6 0 q3 -7 6 0" fill="none" stroke="#ff9fc8" stroke-width="3.6" stroke-linecap="round"/><circle cx="6" cy="-4" r="1.3" fill="#1b1830"/></g>`,
  vol: () => person('#ffb17d', '<rect class="o" x="4" y="-17" width="7" height="9" fill="#2f6fd6"/>'),
  trolley: () => `<g class="bob"><rect class="o" x="-18" y="-17" width="24" height="11" rx="2" fill="#9fe2f5"/><g stroke="#1b1830" stroke-width="0.9"><rect x="-15" y="-24" width="4" height="7" fill="#e8613c"/><rect x="-10" y="-23" width="4" height="6" fill="#ffd23f"/><rect x="-5" y="-25" width="4" height="8" fill="#5fd07c"/><rect x="0" y="-23" width="4" height="6" fill="#c48bff"/></g><circle class="o" cx="-13" cy="-3" r="3" fill="#4b4a66"/><circle class="o" cx="1" cy="-3" r="3" fill="#4b4a66"/></g><g transform="translate(14 0)">${person('#c7b5ff')}</g>`,
  story: () => person(['#ff9fc8', '#5fd07c', '#ffd23f', '#9fe2f5'][Math.floor(rnd() * 4)], '', 0.68),
  lib: () => person('#c7b5ff', '<path d="M-3 -27 h6" stroke="#1b1830" stroke-width="1.4"/><rect class="o" x="4" y="-16" width="6" height="8" fill="#e8613c"/>'),
  apnk: () => person('#8fb6ff', '<rect class="o" x="3" y="-16" width="11" height="7" rx="1" fill="#b9bfc9"/>'),
  courier: () => `<g class="bob"><rect class="o" x="-30" y="-28" width="40" height="22" rx="3" fill="#fffdf7"/><path class="o" d="M10 -22 h9 l7 9 v7 h-16 z" fill="#9fe2f5"/><text x="-10" y="-13" text-anchor="middle" font-size="7" font-weight="700" font-family="sans-serif" fill="#2f6fd6">BOOKS</text><circle class="o" cx="-20" cy="-5" r="4.5" fill="#4b4a66"/><circle class="o" cx="16" cy="-5" r="4.5" fill="#4b4a66"/></g>`,
  club: () => `${person('#ff8f8f', '<rect class="o" x="4" y="-17" width="7" height="9" fill="#ffd23f"/>')}<g transform="translate(15 0)">${person('#5fd07c')}</g>`,
  maker: () => `<g class="bob"><rect class="o" x="-8" y="-20" width="16" height="14" rx="3" fill="#b9bfc9"/><rect class="o" x="-7" y="-33" width="14" height="12" rx="3" fill="#dfe3ea"/><circle cx="-3" cy="-27" r="1.6" fill="#1b1830"/><circle cx="3" cy="-27" r="1.6" fill="#1b1830"/><path d="M0 -33 v-5" stroke="#1b1830" stroke-width="1.5"/><circle class="o" cx="0" cy="-39" r="2" fill="#e8613c"/><rect class="o" x="-6" y="-6" width="4" height="6" fill="#4b4a66"/><rect class="o" x="2" y="-6" width="4" height="6" fill="#4b4a66"/></g>`,
  gazer: () => person('#2a338f', '<path class="o" d="M4 -22 l10 -6 2 3 -10 6z" fill="#b9bfc9"/>'),
};
const CAPS = { worm: 2, vol: 3, trolley: 2, story: 3, lib: 2, apnk: 1, courier: 1, club: 2, maker: 1, gazer: 1 };
const PACE = { worm: 60, trolley: 34, courier: 14, maker: 40 };
let walkSig = null;
function renderWalkers(st) {
  st = st || stateAt(viewIdx === null ? curIdx() : viewIdx);
  const counts = HELPERS.map((h) => (SPRITES[h.id] && countOf(h.id) ? Math.min(CAPS[h.id], Math.ceil(Math.log2(countOf(h.id) + 1) / 1.3)) : 0));
  const sig = counts.join(',') + st.lib + st.vintage + st.rain;
  if (sig === walkSig) return;
  walkSig = sig;
  walkWet = !!st.rain;
  const items = [];
  const walker = (y, dur, rev, inner) => items.push({ y, html: `<g transform="translate(0 ${y})"><g class="walker${rev ? ' rev' : ''}" style="--d:${dur.toFixed(1)}s;--dl:-${(rnd() * dur).toFixed(1)}s"><g transform="scale(${rev ? -1 : 1} 1)">${inner}</g></g></g>` });
  HELPERS.forEach((h, k) => { for (let i = 0; i < counts[k]; i++) walker(50 + Math.floor(rnd() * 9), (PACE[h.id] || 26 + rnd() * 12) * (0.85 + rnd() * 0.3), rnd() < 0.5, SPRITES[h.id]()); });
  const visitors = st.lib === 'none' ? 1 : 3;
  for (let i = 0; i < visitors; i++) walker(50 + Math.floor(rnd() * 9), 28 + rnd() * 14, rnd() < 0.5, person(['#2f6fd6', '#e8613c', '#5fd07c', '#fffdf7'][i % 4], i % 2 === 0 ? '<rect class="o" x="4" y="-17" width="6" height="9" fill="#ffd23f"/>' : ''));
  items.sort((a, b) => a.y - b.y);
  $('#walkers').innerHTML = items.map((i) => i.html).join('');
}

/* =====================================================================
   HISTORY: reaching new books on the shelf
   ===================================================================== */
const taskActive = () => S.task >= 0;
/* a new book never opens by itself: when it is earned, a "Turn the page" button appears and waits for a tap */
const nextReady = () => !taskActive() && S.step < N_EVENTS && S.total >= HISTORY[S.step].at * EVENT_SCALE;
let turnSig = '', lastTurnAt = 0;
function syncTurn() {
  // give each new page a few seconds on screen before the next one can be opened
  const show = nextReady() && viewIdx === null && !turning && !spot && modalBack.hidden && intro.hidden && Date.now() - lastTurnAt > 5000;
  const sig = show ? `y${S.step}` : '';
  if (sig === turnSig) return;
  turnSig = sig;
  $('#turnBtn').hidden = !show;
  if (show) { $('#turnLabel').textContent = `Turn the page to ${HISTORY[S.step].year}`; sfx('star'); }
}
function checkHistory() { syncTurn(); }
function turnPage() {
  if (!nextReady() || turning) return;
  const i = S.step;
  S.step++;
  lastTurnAt = Date.now();
  recompute();
  if (HISTORY[i].task) { S.task = i; S.taskLeft = null; }
  arrive(i, false);
  syncTurn();
}
$('#turnBtn').addEventListener('click', (e) => { e.stopPropagation(); turnPage(); });
/* which building looks different on this page? that is where the camera goes when the page opens */
function changedSpot(i) {
  const a = i > 0 ? stateAt(i - 1) : {}, b = stateAt(i), h = HISTORY[i];
  const ch = {
    15: a.b15 !== b.b15 || ['lovestone', 'apnk', 'glow', 'orange', 'foyer', 'mural', 'hoardart', 'trucks', 'stair'].some((k) => !!a[k] !== !!b[k]),
    77: a.b77 !== b.b77, 9: a.b9 !== b.b9,
  };
  if (a.lib !== b.lib) { const to = { 77: 77, '77pop': 77, 15: 15, '15foyer': 15, '15new': 15, 9: 9 }[b.lib]; if (to) ch[to] = true; }
  return ch[h.focus] ? h.focus : [15, 77, 9].find((k) => ch[k]) || h.focus;
}
const bonusText = (m) => (m >= 2 ? 'All reading doubles!' : m > 1 ? `All reading +${Math.round((m - 1) * 100)}%` : '');
let storyPending = -1, storyT = 0;
function arrive(i, quiet) {
  const h = HISTORY[i];
  if (h.id === 'closure') clearMould();
  viewIdx = null;
  shelfSig = null; renderShelf(i);
  turnTo(i);
  renderCaption(true);
  if (!reduceMotion) setTimeout(() => spotlight(FOCUS_X[changedSpot(i)] || 365, 2600), 1350);
  if (quiet) return;
  const extra = [h.effect, bonusText(h.mult || 1)].filter(Boolean).join(' ');
  if (h.big) {
    const task = h.task && TASKS[h.task];
    storyPending = i; clearTimeout(storyT);
    storyT = setTimeout(() => {
      storyPending = -1;
      if (S.step <= i) return;                       // the game was started over meanwhile
      openModal({
        date: h.date, title: h.title,
        body: `<p>${h.text}</p>${extra ? `<p class="eff">${extra}</p>` : ''}${task ? `<p><b>Can you help?</b> ${task.how}</p>` : ''}`,
        acts: [{ label: task ? task.verb : 'Keep reading', cls: 'primary big', fn: () => { closeModal(); if (task) startTask(); } }],
      });
      sfx('story');
      celebrate();
    }, reduceMotion ? 0 : 3700);
  } else {
    toast(`${h.date}: ${h.title}`, extra || 'A new book for your shelf!');
    sfx('star');
  }
}

/* =====================================================================
   HANDS-ON JOBS for the big moments
   ===================================================================== */
const taskLayer = $('#taskLayer');
const anchorsG = $('#anchors');
let taskBtns = [];
const TASK_ART = {
  cloth: '<svg viewBox="0 0 60 60"><path d="M12 54 C10 34 16 14 30 8 C44 14 50 34 48 54 Z" fill="#c7b5ff" stroke="#1b1830" stroke-width="3" stroke-linejoin="round"/><path d="M22 20 C24 30 22 42 20 54 M38 20 C36 30 38 42 40 54" stroke="#1b1830" stroke-width="2" fill="none" opacity="0.5"/><path d="M28 6 q2 -5 4 0" stroke="#1b1830" stroke-width="2.5" fill="none"/></svg>',
  mould: '<svg viewBox="0 0 60 60"><path d="M30 6 C40 8 52 14 52 28 C54 42 44 54 30 52 C16 54 6 44 8 30 C6 16 18 6 30 6 Z" fill="#9fc35e" stroke="#1b1830" stroke-width="3"/><circle cx="22" cy="24" r="6" fill="#c9df8f"/><circle cx="36" cy="36" r="5" fill="#6f8f3b"/><circle cx="38" cy="20" r="3" fill="#6f8f3b"/></svg>',
  box: '<svg viewBox="0 0 60 60"><path d="M8 20 L30 10 L52 20 V46 L30 56 L8 46 Z" fill="#e8b48a" stroke="#1b1830" stroke-width="3" stroke-linejoin="round"/><path d="M8 20 L30 30 L52 20 M30 30 V56" stroke="#1b1830" stroke-width="2.5" fill="none"/><rect x="14" y="30" width="10" height="7" fill="#fffaf0" stroke="#1b1830" stroke-width="1.5" transform="skewY(20)"/></svg>',
  star: '<svg viewBox="0 0 60 60"><path d="M30 4 L36 24 L56 30 L36 36 L30 56 L24 36 L4 30 L24 24 Z" fill="#fffaf0" stroke="#1b1830" stroke-width="3" stroke-linejoin="round"/></svg>',
  pour: '<svg viewBox="0 0 60 60"><path d="M8 44 C6 30 18 22 30 24 C42 20 56 30 52 44 Z" fill="#b9bfc9" stroke="#1b1830" stroke-width="3"/><path d="M30 24 V6" stroke="#1b1830" stroke-width="5"/><path d="M30 24 V6" stroke="#ffd23f" stroke-width="3"/><circle cx="22" cy="36" r="3" fill="#8a909c"/><circle cx="38" cy="38" r="2.5" fill="#8a909c"/></svg>',
  glass: '<svg viewBox="0 0 60 60"><rect x="10" y="8" width="40" height="44" rx="2" fill="#bfeefa" stroke="#1b1830" stroke-width="3"/><path d="M16 44 L30 16 M26 46 L40 18" stroke="#fffaf0" stroke-width="4" stroke-linecap="round"/></svg>',
  ribbon: '<svg viewBox="0 0 60 60"><path d="M4 26 H56 V36 H4 Z" fill="#e8613c" stroke="#1b1830" stroke-width="3"/><path d="M30 31 L18 18 L18 44 Z M30 31 L42 18 L42 44 Z" fill="#c8323c" stroke="#1b1830" stroke-width="3" stroke-linejoin="round"/><circle cx="30" cy="31" r="5" fill="#ffd23f" stroke="#1b1830" stroke-width="2.5"/></svg>',
  litstar: '<svg viewBox="0 0 60 60"><path d="M30 4 L36 24 L56 30 L36 36 L30 56 L24 36 L4 30 L24 24 Z" fill="#ffd23f" stroke="#1b1830" stroke-width="3" stroke-linejoin="round"/></svg>',
};
function anchorAt(x, y, id) {
  const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 1); c.setAttribute('fill', 'none'); c.dataset.anchor = id;
  anchorsG.appendChild(c);
  return c;
}
function startTask() {
  if (!taskActive() || storyPending >= 0) return;
  const h = HISTORY[S.task], t = TASKS[h.task];
  viewIdx = null; turnTo(S.task); renderCaption(true);
  clearTaskButtons();
  S.taskLeft = S.taskLeft && S.taskLeft.length === t.pts.length ? S.taskLeft : t.pts.map(() => 1);
  if (S.taskLeft.every((v) => !v)) { finishTask(); return; }
  t.pts.forEach(([x, y], k) => {
    if (!S.taskLeft[k]) return;
    const a = anchorAt(x, y, `t${k}`);
    const b = document.createElement('button');
    b.className = 'taskbtn';
    b.innerHTML = TASK_ART[t.kind];
    b.setAttribute('aria-label', t.how);
    b.addEventListener('click', (e) => { e.stopPropagation(); hitTask(k, b); });
    taskLayer.appendChild(b);
    taskBtns.push({ b, a, k });
  });
  if (t.to) taskBtns.dest = anchorAt(t.to[0], t.to[1], 'dest');
  $('#taskHow').textContent = t.how;
  $('#taskBanner').hidden = false;
  updateTaskCount();
  layoutView();
}
function updateTaskCount() {
  const t = TASKS[HISTORY[S.task].task];
  const done = t.pts.length - S.taskLeft.filter(Boolean).length;
  $('#taskCount').textContent = `${done}/${t.pts.length}`;
}
function hitTask(k, b) {
  if (!S.taskLeft || !S.taskLeft[k]) return;
  S.taskLeft[k] = 0;
  const t = TASKS[HISTORY[S.task].task];
  const r = b.getBoundingClientRect();
  sfx('pop');
  if (t.kind === 'box' && taskBtns.dest) {
    const d = taskBtns.dest.getBoundingClientRect(), s = stage.getBoundingClientRect();
    b.classList.add('fly');
    b.style.left = `${d.left + d.width / 2 - s.left}px`; b.style.top = `${d.top + d.height / 2 - s.top}px`; b.style.opacity = 0;
  } else if (t.kind === 'star') {
    b.innerHTML = TASK_ART.litstar; b.classList.add('fly'); b.style.pointerEvents = 'none';
    burst(r.left + r.width / 2, r.top + r.height / 2, 10, 'star');
  } else {
    b.classList.add('gone');
    burst(r.left + r.width / 2, r.top + r.height / 2, 12, t.kind === 'mould' ? 'paper' : 'confetti');
  }
  const entry = taskBtns.find((x) => x.k === k);
  if (entry) entry.done = true;
  updateTaskCount();
  if (S.taskLeft.every((v) => !v)) setTimeout(finishTask, t.kind === 'box' ? 850 : 450);
}
function finishTask() {
  if (!taskActive()) return;
  const i = S.task, h = HISTORY[i], t = TASKS[h.task];
  S.tasksDone[h.task] = 1;
  S.task = -1; S.taskLeft = null;
  clearTaskButtons();
  $('#taskBanner').hidden = true;
  const reward = Math.max(100, cache.basePps * 60);
  earn(reward);
  celebrate(); sfx('story');
  layoutView();
  if (h.id === 'open') { S.opened = true; finale(reward); }
  else toast(`${t.verb}: done!`, `${t.done} +${fmt(reward)} pages.`);
  save();
}
function clearTaskButtons() {
  taskBtns.forEach(({ b }) => b.remove());
  taskBtns = [];
  anchorsG.innerHTML = '';
}
function placeTaskButtons() {
  if (!taskBtns.length) return;
  const s = stage.getBoundingClientRect();
  const boxes = TASKS[HISTORY[S.task].task].kind === 'box';
  taskBtns.forEach(({ b, a, done }) => {
    if (done && boxes) return;
    const r = a.getBoundingClientRect();
    b.style.left = `${r.left + r.width / 2 - s.left}px`;
    b.style.top = `${r.top + r.height / 2 - s.top}px`;
  });
}
function finale(reward) {
  const right = S.quizRight || 0;
  openModal({
    date: 'Opening day', title: 'You built Te Ara Whetū!',
    body: `<div class="certificate"><span class="small">This certifies that a very good reader</span><b>filled the history shelf</b><span class="small">from 1977 to 2027 at Mahara Place, Waikanae</span></div>
      <p>You read <b>${fmt(S.total)} pages</b>, hired <b>${fmt(HELPERS.reduce((a, h) => a + countOf(h.id), 0))} helpers</b> and answered <b>${right}</b> history question${right === 1 ? '' : 's'} right. +${fmt(reward)} pages for cutting the ribbon!</p>
      <p>Haere mai, welcome to Te Ara Whetū. Keep reading, open any book on your shelf to time travel, or start a new chapter for a bonus.</p>`,
    acts: [{ label: 'Keep reading', cls: 'primary big', fn: closeModal }, { label: 'New chapter', cls: '', fn: () => { closeModal(); openSheet('options'); } }],
  });
}

/* =====================================================================
   SHELF, CAPTION, STORE
   ===================================================================== */
const ERA_COLOURS = ['#e8613c', '#ffd23f', '#5fd07c', '#ff9fc8', '#9fe2f5', '#c7b5ff', '#ffb17d', '#8fb6ff'];
let shelfSig = null, newestShown = -1;
function renderShelf(arrived = -1) {
  const sig = `${S.step}|${viewIdx}|${S.task}`;
  const books = $('#books');
  if (sig !== shelfSig) {
    shelfSig = sig;
    books.innerHTML = HISTORY.map((h, i) => {
      if (i < S.step) {
        const cls = ['spine', h.big ? 'big' : '', i === curIdx() ? 'now' : '', i === viewIdx ? 'viewing' : '', i === arrived ? 'arrive' : ''].join(' ');
        const hgt = h.big ? 70 : 52 + ((i * 7) % 12);
        return `<button class="${cls}" style="--c:${ERA_COLOURS[i % ERA_COLOURS.length]};height:${hgt}px" data-book="${i}" aria-label="${h.date}: ${h.title}. Open this book" title="${h.date}: ${h.title}"><span>${h.year}</span></button>`;
      }
      if (i === S.step) return `<div class="slot next${h.big ? ' big' : ''}" aria-label="Next book: ${h.year}"><i id="slotFill"></i><b>?</b></div>`;
      return `<div class="slot${h.big ? ' big' : ''}" aria-hidden="true">?</div>`;
    }).join('');
    $('#shelfCount').textContent = `${S.step} of ${N_EVENTS} books`;
    const now = books.querySelector('.viewing') || books.querySelector('.now');
    if (now && (now.offsetLeft < books.scrollLeft || now.offsetLeft + now.offsetWidth > books.scrollLeft + books.clientWidth)) books.scrollLeft = Math.max(0, now.offsetLeft - books.clientWidth / 2);
  }
  const fill = $('#slotFill');
  if (fill) fill.style.height = `${(nextProgress() * 100).toFixed(1)}%`;
}
function nextProgress() {
  if (S.step >= N_EVENTS) return 1;
  const from = HISTORY[S.step - 1].at * EVENT_SCALE, to = HISTORY[S.step].at * EVENT_SCALE;
  return Math.max(0, Math.min(1, (S.total - from) / Math.max(1, to - from)));
}
function renderCaption(fresh) {
  const idx = viewIdx === null ? curIdx() : viewIdx, h = HISTORY[idx];
  const cap = $('#caption');
  $('#capDate').textContent = h.date;
  $('#capTitle').textContent = h.title;
  $('#capText').textContent = h.text;
  cap.classList.toggle('past', viewIdx !== null);
  if (fresh) { cap.classList.remove('fresh'); void cap.offsetWidth; cap.classList.add('fresh'); }
  renderNext();
}
let nextSig = '';
const setText = (el, t) => { if (el.textContent !== t) el.textContent = t; };
const setAttr = (el, k, v) => { if (el.getAttribute(k) !== v) el.setAttribute(k, v); };
const setW = (el, v) => { if (el.style.width !== v) el.style.width = v; };
function renderNext() {
  const el = $('#capNext');
  if (taskActive()) {
    const t = TASKS[HISTORY[S.task].task], waiting = $('#taskBanner').hidden && storyPending < 0;
    const sig = `task${S.task}${waiting}${storyPending}`;
    if (sig === nextSig) return;
    nextSig = sig;
    setText($('#nextLabel'), `Job to do: ${t.verb}`);
    setW($('#nextBar'), '100%');
    $('#nextLeft').innerHTML = storyPending >= 0 ? '' : waiting ? '<button class="btn primary" id="resumeTask" style="min-height:34px;padding:2px 12px">Let\'s go!</button>' : 'Tap the picture!';
    return;
  }
  nextSig = '';
  if (S.step >= N_EVENTS) {
    setText($('#nextLabel'), 'Your shelf is full. Te Ara Whetū is open!');
    setW($('#nextBar'), '100%');
    setText($('#nextLeft'), '');
    return;
  }
  const nx = HISTORY[S.step];
  if (nextReady()) {
    setText($('#nextLabel'), `The ${nx.year} book is ready!`);
    setW($('#nextBar'), '100%');
    const msg = viewIdx !== null ? 'Tap “Back to now” to turn the page' : $('#turnBtn').hidden ? 'Have a look first…' : 'Turn the page!';
    if ($('#nextLeft').textContent !== msg) $('#nextLeft').textContent = msg;
    setAttr(el, 'aria-label', `The ${nx.year} book is ready. Turn the page.`);
    return;
  }
  setText($('#nextLabel'), `Next book: ${nx.year}`);
  setW($('#nextBar'), `${(nextProgress() * 100).toFixed(1)}%`);
  const left = Math.max(0, nx.at * EVENT_SCALE - S.total);
  const t = `${fmt(left)} pages to go`;
  if ($('#nextLeft').textContent !== t) $('#nextLeft').textContent = t;
  setAttr(el, 'aria-label', `Next book: ${nx.year}. ${t}.`);
}

/* the counter */
let lastTop = '', lastStreak = -1;
const streakBar = $('#streakBar'), streakEl = $('#streak');
function renderTop() {
  const p = fmt(S.pages), r = fmt(cache.pps, 1);
  const key = p + '|' + r;
  if (key !== lastTop) {
    lastTop = key;
    $('#pages').textContent = p;
    $('#rate').innerHTML = `${r}<span class="long"> pages a second</span><span class="short">/s</span>`;
    if (!KIOSK) document.title = `${p} pages · Te Ara Whetū`;
  }
  const sk = Math.round(streak * 100);
  if (sk !== lastStreak) { lastStreak = sk; streakBar.style.width = `${sk}%`; streakEl.classList.toggle('full', streak >= 1); }
}
function renderBuffs() {
  const now = Date.now();
  const html = buffs.map((b) => `<span class="buff${b.bad ? ' bad' : ''}">${b.label} · ${Math.ceil((b.until - now) / 1000)}s</span>`).join('');
  if ($('#buffs').innerHTML !== html) $('#buffs').innerHTML = html;
}
function addBuff(b) { buffs = buffs.filter((x) => x.id !== b.id); buffs.push({ ...b, until: Date.now() + b.secs * 1000 }); recompute(); renderBuffs(); }

/* helpers */
function helperVisible(h, i) {
  if (countOf(h.id) > 0) return true;
  if (era() < h.era) return false;
  const prev = HELPERS[i - 1];
  return i === 0 || S.total >= h.cost * 0.4 || (prev && countOf(prev.id) > 0);
}
let helperSig = null;
function renderHelpers() {
  const visible = HELPERS.filter(helperVisible);
  const teaser = HELPERS.find((h, i) => !helperVisible(h, i));
  const sig = visible.map((h) => h.id).join(',') + '|' + (teaser ? teaser.id + era() : '');
  const box = $('#helpers');
  if (sig !== helperSig) {
    helperSig = sig;
    box.innerHTML = visible.map((h) => `
      <button class="card" data-helper="${h.id}">
        <span class="ic" style="background:${h.color}">${ICONS[h.id]}</span>
        <span class="nm">${h.name}</span>
        <span class="own" data-own>0</span>
        <span class="meta"><span class="price" data-price></span><span class="each" data-each></span></span>
      </button>`).join('') + (teaser ? `
      <div class="card locked" aria-disabled="true">
        <span class="ic">${ICONS.lock}</span>
        <span class="nm">${era() < teaser.era ? '???' : teaser.name}</span>
        <span></span>
        <span class="meta"><span class="each">${era() < teaser.era ? 'Unlocks later in the story' : 'Keep reading to unlock'}</span></span>
      </div>` : '');
  }
  box.querySelectorAll('[data-helper]').forEach((row) => {
    const h = HELPERS.find((x) => x.id === row.dataset.helper);
    const cost = priceOf(h, bulk), can = S.pages >= cost;
    if (row.disabled !== !can) row.disabled = !can;
    const pr = row.querySelector('[data-price]'), pt = `${bulk > 1 ? `×${bulk} · ` : ''}${fmt(Math.ceil(cost))}`;
    if (pr.textContent !== pt) pr.textContent = pt;
    pr.classList.toggle('cant', !can);
    const ea = row.querySelector('[data-each]'), et = `+${fmt(h.pps * helperMult(h.id) * globalMult() * SPEED, 1)}/s each`;
    if (ea.textContent !== et) ea.textContent = et;
    const ow = row.querySelector('[data-own]'), on = String(countOf(h.id));
    if (ow.textContent !== on) ow.textContent = on;
    setAttr(row, 'aria-label', `${h.name}. ${h.desc} Costs ${pt} pages. You have ${on}.`);
    if (row.title !== h.desc) row.title = h.desc;
  });
}
function buyHelper(id) {
  const h = HELPERS.find((x) => x.id === id);
  const cost = priceOf(h, bulk);
  if (!spend(cost)) { sfx('no'); return; }
  S.helpers[id] = countOf(id) + bulk;
  recompute(); sfx('buy');
  const r = document.querySelector(`[data-helper="${id}"]`);
  if (r) { const b = r.getBoundingClientRect(); burst(b.left + 26, b.top + b.height / 2, 6, 'confetti', 0.6); }
  renderHelpers(); renderWalkers(); renderTop();
}

/* upgrades */
let upSig = null, selectedUp = null;
const availableUpgrades = () => UPGRADES.filter((u) => !S.upgrades[u.id] && u.unlock()).sort((a, b) => a.cost - b.cost);
function upLook(u) {
  if (u.kind === 'helper') { const h = HELPERS.find((x) => x.id === u.helper); return { icon: ICONS[u.helper], bg: h.color, label: h.name }; }
  if (u.kind === 'click' || u.kind === 'clickPps') return { icon: ICONS.tap, bg: '#ff9fc8', label: 'Tapping' };
  if (u.kind === 'mould') return { icon: ICONS.bucket, bg: '#b9d98a', label: `From history · ${u.date}` };
  if (u.kind === 'starFreq' || u.kind === 'starPower') return { icon: ICONS.book, bg: '#ffd23f', label: `From history · ${u.date}` };
  return { icon: ICONS.scroll, bg: '#ffb17d', label: `From history · ${u.date}` };
}
function renderUpgrades() {
  const avail = availableUpgrades();
  if (selectedUp && !avail.some((u) => u.id === selectedUp)) selectedUp = null;
  const sig = avail.map((u) => u.id).join(',') + '|' + selectedUp;
  if (sig !== upSig) {
    upSig = sig;
    $('#upgrid').innerHTML = avail.length ? avail.map((u) => {
      const l = upLook(u);
      return `<button class="tile" data-tile="${u.id}" style="background:${l.bg}" aria-label="${u.name}: ${u.eff} ${fmt(Math.ceil(u.cost))} pages" aria-pressed="${u.id === selectedUp}" title="${u.name}">${l.icon}</button>`;
    }).join('') : '<p class="empty" style="grid-column:1/-1">No upgrades yet. Hire helpers and keep reading.</p>';
    const u = selectedUp && UP_BY_ID[selectedUp], d = $('#updetail');
    d.hidden = !u;
    if (u) {
      const l = upLook(u);
      d.innerHTML = `<span class="k chip" style="background:${l.bg}">${l.label}</span><span><span class="n">${u.name}</span><br><span class="e">${u.eff}</span></span><button class="btn primary" data-up="${u.id}">${fmt(Math.ceil(u.cost))}</button>${u.fact ? `<span class="f">${u.fact}</span>` : ''}`;
    }
  }
  let afford = 0;
  $$('[data-tile]').forEach((t) => { const can = S.pages >= UP_BY_ID[t.dataset.tile].cost; t.classList.toggle('cant', !can); if (can) afford++; });
  const b = $('#updetail [data-up]');
  if (b) b.disabled = S.pages < UP_BY_ID[b.dataset.up].cost;
  const txt = avail.length ? `${afford} of ${avail.length} ready` : '';
  if ($('#upCount').textContent !== txt) $('#upCount').textContent = txt;
}
function selectUp(id) { if (selectedUp !== id) { selectedUp = id; renderUpgrades(); } }
$('#upgrid').addEventListener('pointerover', (e) => { const t = e.target.closest('[data-tile]'); if (t && e.pointerType === 'mouse') selectUp(t.dataset.tile); });
$('#upgrid').addEventListener('focusin', (e) => {
  const t = e.target.closest('[data-tile]');
  if (t) { const id = t.dataset.tile; selectUp(id); requestAnimationFrame(() => { const n = $(`[data-tile="${id}"]`); if (n && document.activeElement !== n) n.focus(); }); }
});
function buyUpgrade(id) {
  const u = UP_BY_ID[id];
  if (!u || S.upgrades[id] || !spend(u.cost)) { sfx('no'); return; }
  S.upgrades[id] = 1;
  recompute(); sfx('buy');
  toast(u.name, u.fact ? `${u.eff} ${u.fact}` : u.eff);
  renderUpgrades(); renderHelpers(); renderTop();
}
function renderBonus() {
  const n = Object.keys(S.badges).length, t = `${n} badges · +${n}%`;
  if ($('#bonusChip').textContent !== t) $('#bonusChip').textContent = t;
}

/* =====================================================================
   SURPRISES: runaway books, mould spots, history questions, news
   ===================================================================== */
const layer = $('#layer');
let nextBookAt = Date.now() + 30000, nextMouldAt = Date.now() + 40000, nextQuizAt = Date.now() + 50000;
const RUNAWAY = '<svg viewBox="0 0 74 56"><g class="wl"><path d="M37 34 C28 22 14 18 4 22 L8 46 C18 42 30 44 37 50 Z" fill="#ffd23f" stroke="#1b1830" stroke-width="3" stroke-linejoin="round"/></g><g class="wr"><path d="M37 34 C46 22 60 18 70 22 L66 46 C56 42 44 44 37 50 Z" fill="#ffe895" stroke="#1b1830" stroke-width="3" stroke-linejoin="round"/></g><path d="M37 34 V50" stroke="#1b1830" stroke-width="3"/><path d="M14 30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#e8613c" stroke="#1b1830" stroke-width="1.4"/></svg>';
function spawnRunaway() {
  const b = document.createElement('button');
  b.className = 'runaway';
  b.innerHTML = RUNAWAY;
  b.setAttribute('aria-label', 'A runaway book! Tap to catch it');
  const W = innerWidth, H = innerHeight, left = Math.random() < 0.5;
  let x = left ? -80 : W + 10, y = H * (0.15 + Math.random() * 0.5);
  const vx = (left ? 1 : -1) * (W + 160) / 12, base = y;
  b.style.transform = `translate(${x}px, ${y}px)`;
  layer.appendChild(b);
  let last = performance.now(), alive = true, t = 0;
  const step = (now) => {
    if (!alive) return;
    const dt = Math.min(0.1, (now - last) / 1000); last = now; t += dt;
    x += vx * dt; y = base + Math.sin(t * 3) * 26;
    b.style.transform = `translate(${x}px, ${y}px) scaleX(${vx < 0 ? -1 : 1})`;
    if (x < -100 || x > W + 100) { alive = false; b.remove(); return; }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!alive) return;
    alive = false;
    const r = b.getBoundingClientRect();
    burst(r.left + 37, r.top + 28, 18, 'star');
    b.remove();
    catchBook();
  });
}
function catchBook() {
  S.stars++; sfx('star');
  const luck = bookLuck(), roll = Math.random();
  if (roll < 0.5) {
    const gain = Math.max(40, Math.min(S.pages * 0.15, cache.basePps * 900)) * luck + 13;
    earn(gain);
    toast('A box of donated books!', `+${fmt(gain)} pages.`);
  } else if (roll < 0.85) {
    addBuff({ id: 'late', label: 'Late-night reading ×7', kind: 'prod', mult: 7, secs: 45 * luck });
    toast('Late-night reading!', `Everyone reads seven times faster for ${45 * luck} seconds.`);
  } else {
    addBuff({ id: 'storm', label: 'Page storm ×30 taps', kind: 'click', mult: 30, secs: 10 * luck });
    toast('Page storm!', `Taps read thirty times as much for ${10 * luck} seconds. Tap tap tap!`);
  }
}
/* mould spots on the old building in the leaky years (2010–2018) */
let mould = null;
const MOULD_PTS = [[249, 76], [355, 99], [410, 162], [494, 190], [539, 108], [309, 88], [445, 99]];
function spawnMould() {
  if (mould || taskActive() || viewIdx !== null) return;
  const [x, y] = MOULD_PTS[Math.floor(Math.random() * MOULD_PTS.length)];
  const a = anchorAt(x, y, 'mould');
  const b = document.createElement('button');
  b.className = 'taskbtn mini';
  b.innerHTML = TASK_ART.mould;
  b.setAttribute('aria-label', 'A mould spot! Tap to clean it');
  taskLayer.appendChild(b);
  mould = { a, b };
  const timer = setTimeout(() => {
    if (!mould || mould.b !== b) return;
    clearMould();
    addBuff({ id: 'musty', label: 'Musty smell −10%', kind: 'prod', mult: 0.9, secs: 30, bad: true });
    toast('Musty smell', 'A mould spot spread. Reading is 10% slower for 30 seconds.');
  }, 10000);
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    clearTimeout(timer);
    const r = b.getBoundingClientRect();
    burst(r.left + 25, r.top + 25, 10, 'paper');
    clearMould();
    S.mould++;
    const gain = (cache.basePps * 30 + 25) * (S.upgrades.bucket ? 2 : 1);
    earn(gain); sfx('pop');
    toast('Scrubbed!', `+${fmt(gain)} pages. The leaky old building needs lots of this.`);
  });
}
function clearMould() { if (mould) { mould.b.remove(); mould.a.remove(); mould = null; } const n = buffs.length; buffs = buffs.filter((b) => b.id !== 'musty'); if (buffs.length !== n) recompute(); }
function placeMould() {
  if (!mould) return;
  const s = stage.getBoundingClientRect(), r = mould.a.getBoundingClientRect();
  mould.b.style.left = `${r.left - s.left}px`; mould.b.style.top = `${r.top - s.top}px`;
}
/* history questions */
let quizEl = null;
function spawnQuiz() {
  if (quizEl || taskActive()) return;
  S.quiz = S.quiz || {};
  const list = QUIZ.filter((q) => reached(q.after) && !S.quiz[q.id]);
  if (!list.length) return;
  const q = list[Math.floor(Math.random() * list.length)];
  const b = document.createElement('button');
  b.className = 'quizbtn';
  b.textContent = '?';
  b.setAttribute('aria-label', 'A history question! Tap to answer it');
  b.style.left = `${12 + Math.random() * Math.max(10, stage.clientWidth - 90)}px`;
  b.style.top = `${stage.clientHeight * (0.15 + Math.random() * 0.4)}px`;
  stage.appendChild(b);
  quizEl = b;
  const timer = setTimeout(() => { if (quizEl === b) { b.remove(); quizEl = null; } }, 15000);
  b.addEventListener('click', (e) => { e.stopPropagation(); clearTimeout(timer); b.remove(); quizEl = null; askQuiz(q); });
}
function askQuiz(q) {
  const order = q.a.map((t, i) => ({ t, right: i === 0 })).sort(() => Math.random() - 0.5);
  openModal({
    date: 'History question', title: q.q,
    body: `<div class="answers">${order.map((o) => `<button class="btn" data-right="${o.right ? 1 : 0}">${o.t}</button>`).join('')}</div><p class="eff" id="quizWhy" hidden></p>`,
    acts: [],
  });
  $$('#modalBody [data-right]').forEach((btn) => btn.addEventListener('click', () => {
    if (S.quiz[q.id]) return;
    S.quiz[q.id] = 1;
    const right = btn.dataset.right === '1';
    $$('#modalBody [data-right]').forEach((x) => { if (x.dataset.right === '1') x.classList.add('right'); x.disabled = true; });
    if (!right) btn.classList.add('wrong');
    const why = $('#quizWhy');
    why.hidden = false;
    if (right) {
      S.quizRight++;
      why.textContent = `Correct! ${q.why} Reading ×3 for 45 seconds.`;
      addBuff({ id: 'quiz', label: 'History whiz ×3', kind: 'prod', mult: 3, secs: 45 });
      sfx('star');
      const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top, 24, 'confetti');
    } else {
      why.textContent = `Not quite. ${q.why}`;
      sfx('no');
    }
    setActs([{ label: 'Keep reading', cls: 'primary big', fn: closeModal }]);
  }));
}
/* real news, up to the year you've reached */
let newsAt = 0, newsN = 0;
function rotateNews() {
  const now = viewIdx === null ? curIdx() : viewIdx;
  const pool = NEWS.filter((n) => HIST_IDX[n.at] <= now);
  if (!pool.length) return;
  const recent = pool.filter((n) => HIST_IDX[n.at] >= now - 3);
  const pick = recent.length && Math.random() < 0.65 ? recent[newsN++ % recent.length] : pool[Math.floor(Math.random() * pool.length)];
  const p = $('#news');
  p.style.opacity = 0;
  setTimeout(() => { p.textContent = `${pick.d} · ${pick.t}`; p.style.opacity = 1; }, 350);
}

/* =====================================================================
   TIME TRAVEL: open an old book from the shelf
   ===================================================================== */
function openBook(i) {
  if (taskActive()) { toast('Finish the job first!', TASKS[HISTORY[S.task].task].how); return; }
  if (i >= curIdx()) { backToNow(); return; }
  viewIdx = i;
  S.timeTravel = (S.timeTravel || 0) + 1;
  clearMould();
  $('#travelYear').textContent = HISTORY[i].year;
  $('#travelBanner').hidden = false;
  shelfSig = null; renderShelf();
  turnTo(i); renderCaption(true); newsAt = Date.now(); rotateNews();
}
function backToNow() {
  viewIdx = null;
  $('#travelBanner').hidden = true;
  shelfSig = null; renderShelf();
  turnTo(curIdx()); renderCaption(true);
}

/* =====================================================================
   MODALS, SHEETS AND TOASTS
   ===================================================================== */
const modalBack = $('#modalBack');
let modalReturn = null, sheet = null, sheetSig = '';
function setActs(acts) {
  const box = $('#modalActs');
  box.innerHTML = '';
  acts.forEach((a) => { const b = document.createElement('button'); b.className = `btn ${a.cls || ''}`; b.textContent = a.label; b.addEventListener('click', a.fn); box.appendChild(b); });
  box.hidden = !acts.length;
  if (acts.length) setTimeout(() => box.firstChild && box.firstChild.focus(), 40);
}
function openModal({ date, title, body, acts }) {
  sheet = null;
  if (modalBack.hidden) modalReturn = document.activeElement;
  const d = $('#modalDate'); d.hidden = !date; d.textContent = date || '';
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = body;
  modalBack.hidden = false;
  modalBack.prepend(fx);
  setActs(acts || []);
  if (!acts || !acts.length) setTimeout(() => { const f = $('#modalBody button') || $('#modalX'); f.focus(); }, 40);
}
function closeModal() {
  modalBack.hidden = true; sheet = null;
  document.body.appendChild(fx);
  if (modalReturn && modalReturn.focus && document.contains(modalReturn)) modalReturn.focus();
  if (taskActive() && $('#taskBanner').hidden) startTask();
}
$('#modalX').addEventListener('click', closeModal);
modalBack.addEventListener('click', (e) => { if (e.target === modalBack) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modalBack.hidden) closeModal(); });
function toast(title, body) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<b>${title}</b>${body || ''}`;
  const box = $('#toasts');
  box.appendChild(t);
  while (box.children.length > 2) box.firstChild.remove();
  setTimeout(() => t.remove(), 5200);
}
function openSheet(kind) {
  if (modalBack.hidden) modalReturn = document.activeElement;
  sheet = kind; sheetSig = '';
  $('#modalDate').hidden = true;
  $('#modalActs').hidden = true;
  modalBack.hidden = false;
  renderSheet();
  setTimeout(() => $('#modalX').focus(), 40);
}
function renderSheet() {
  if (!sheet || modalBack.hidden) return;
  let title = '', html = '';
  if (sheet === 'badges') {
    title = 'Badges and stats';
    const n = Object.keys(S.badges).length, mins = Math.floor((Date.now() - S.started) / 60000);
    const rows = [
      ['Books on your shelf', `${S.step} of ${N_EVENTS}`], ['Year reached', String(HISTORY[curIdx()].year)], ['Pages read', fmt(S.total)], ['Pages a second', fmt(cache.pps, 1)],
      ['Pages per tap', fmt(cache.click, 1)], ['Taps', fmt(S.clicks)], ['Helpers', fmt(HELPERS.reduce((a, h) => a + countOf(h.id), 0))],
      ['History questions right', `${S.quizRight} of ${QUIZ.length}`], ['Runaway books caught', fmt(S.stars)], ['Mould spots scrubbed', fmt(S.mould)],
      ['Chapter', String(S.chapter + 1)], ['Time playing', mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h ${mins % 60} min`],
    ];
    html = `<p class="small">${n} of ${BADGES.length} badges. Each one adds 1% to all reading.</p><div class="badges">${BADGES.map((b) => `<div class="badge${S.badges[b.id] ? '' : ' off'}"><b>${S.badges[b.id] ? b.name : '???'}</b>${b.desc}</div>`).join('')}</div><dl class="stats">${rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`;
  } else {
    title = 'Options';
    html = `
      <div class="opts"><button class="btn" id="soundToggle">${soundOn ? 'Sound: on' : 'Sound: off'}</button><button class="btn" data-sheet="badges">Badges and stats</button>${document.fullscreenEnabled ? '<button class="btn" id="fullBtn">Full screen</button>' : ''}</div>
      ${S.opened ? `<p><b>New chapter.</b> Close the book and read the whole story again from 1977. You keep your badges, and every chapter adds +50% to all reading for good.</p>
      <div class="opts"><button class="btn primary" id="chapterBtn">Start chapter ${S.chapter + 2}</button><span id="chapterConfirm" hidden><button class="btn warn" id="chapterYes">Yes, start again</button> <button class="btn" id="chapterNo">Not yet</button></span></div>` : ''}
      <div class="opts"><button class="btn warn" id="resetBtn">Start over</button><span id="resetConfirm" hidden><button class="btn warn" id="resetYes">Yes, start over</button> <button class="btn" id="resetNo">Keep playing</button></span></div>
      <p class="small">${KIOSK ? 'Display mode: quicker play, no saving, and the book closes two minutes after the last tap.' : 'Your progress saves in this browser.'} For library display tablets, add <b>#kiosk</b> to the end of the link.</p>
      <p class="small">Made for the opening of Te Ara Whetū, Waikanae's library at 15 Mahara Place. The history comes from Kāpiti Coast District Council and local news coverage up to November 2026. The pop-ups are drawn from photos and plans of the real buildings.</p>`;
  }
  const sig = sheet === 'options' ? 'options' + soundOn + S.opened : html;
  if (sig === sheetSig) return;
  sheetSig = sig;
  $('#modalTitle').textContent = title;
  $('#modalBody').innerHTML = html;
}

/* =====================================================================
   CLICKS
   ===================================================================== */
document.addEventListener('click', (e) => {
  const t = e.target.closest('button');
  if (!t) return;
  if (t.dataset.helper) return buyHelper(t.dataset.helper);
  if (t.dataset.tile) { const id = t.dataset.tile; if (selectedUp === id && S.pages >= UP_BY_ID[id].cost) buyUpgrade(id); else selectUp(id); return; }
  if (t.dataset.up) return buyUpgrade(t.dataset.up);
  if (t.dataset.book) return openBook(Number(t.dataset.book));
  if (t.dataset.sheet) return openSheet(t.dataset.sheet);
  switch (t.id) {
    case 'bulk-1': case 'bulk-10': case 'bulk-100':
      bulk = Number(t.id.split('-')[1]);
      $$('.seg button').forEach((b) => b.setAttribute('aria-pressed', String(b === t)));
      helperSig = null; renderHelpers(); break;
    case 'soundBtn': case 'soundToggle':
      soundOn = !soundOn; try { localStorage.setItem(SAVE_KEY + '-sound', soundOn ? '1' : '0'); } catch (err) {}
      renderSound(); sfx('buy'); renderSheet(); break;
    case 'fullBtn': try { document.documentElement.requestFullscreen().catch(() => {}); } catch (err) {} break;
    case 'travelBack': backToNow(); break;
    case 'resumeTask': startTask(); break;
    case 'resetBtn': $('#resetConfirm').hidden = false; t.hidden = true; break;
    case 'resetNo': $('#resetConfirm').hidden = true; $('#resetBtn').hidden = false; break;
    case 'resetYes': closeModal(); resetGame(false); break;
    case 'chapterBtn': $('#chapterConfirm').hidden = false; t.hidden = true; break;
    case 'chapterNo': $('#chapterConfirm').hidden = true; $('#chapterBtn').hidden = false; break;
    case 'chapterYes': closeModal(); resetGame(true); break;
  }
});

/* =====================================================================
   SAVING, RESETS, THE BOOK COVER
   ===================================================================== */
function save() {
  if (KIOSK) return;
  S.lastSave = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {}
}
function load(raw) {
  if (KIOSK) return;
  try {
    const d = raw || JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (d && d.v === 1 && typeof d.step === 'number') {
      S = Object.assign(fresh(), d);
      if (!d.hasToi) {            // saves from before the Toi MAHARA page was added: keep everyone on the same page of the story
        const k = HISTORY.findIndex((h) => h.id === 'toi');
        if (S.step > k) S.step++;
        if (S.task >= k) S.task++;
      }
    }
  } catch (e) {}
  S.step = Math.max(1, Math.min(N_EVENTS, S.step | 0));
  if (S.task >= S.step || (S.task >= 0 && !HISTORY[S.task].task)) S.task = -1;
}
window.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
window.addEventListener('pagehide', save);
function resetGame(chapter) {
  const keep = chapter ? { chapter: S.chapter + 1, badges: S.badges, allTime: S.allTime, stars: S.stars, mould: S.mould, quiz: S.quiz, quizRight: S.quizRight, bestStreak: S.bestStreak, timeTravel: S.timeTravel, tasksDone: S.tasksDone, introSeen: true } : {};
  S = Object.assign(fresh(), keep);
  buffs = []; streak = 0; viewIdx = null; selectedUp = null;
  bulk = 1; ['1', '10', '100'].forEach((n) => $(`#bulk-${n}`).setAttribute('aria-pressed', String(n === '1')));
  if (KIOSK) { soundOn = false; renderSound(); }
  clearTimeout(storyT); storyPending = -1; clearTimeout(spotT); spot = null;
  turnGen++; turning = false; turnQueue = null; bookEl.classList.remove('folded'); $('#sheet').className = 'sheet';
  if (!modalBack.hidden) closeModal();
  clearMould(); clearTaskButtons(); $('#taskBanner').hidden = true; $('#travelBanner').hidden = true;
  if (quizEl) { quizEl.remove(); quizEl = null; }
  recompute();
  shelfSig = helperSig = upSig = walkSig = null;
  $('#taphint').hidden = false;
  shownIdx = -1; paintScene(0);
  renderAll(); renderCaption(true); newsAt = Date.now(); rotateNews();
  save();
  showIntro(chapter ? `Chapter ${S.chapter + 1}` : null);
}
const intro = $('#intro');
function showIntro(label) {
  intro.classList.remove('opening');
  intro.querySelector('.chip').textContent = label || '1977 – 2027';
  intro.hidden = false;
  setTimeout(() => $('#introBtn').focus(), 50);
}
function openIntro() {
  if (intro.classList.contains('opening')) return;
  intro.classList.add('opening');
  S.introSeen = true;
  sfx('page'); keepAwake();
  setTimeout(() => { intro.hidden = true; intro.classList.remove('opening'); celebrate(); stage.focus({ preventScroll: true }); }, reduceMotion ? 0 : 1100);
}
intro.addEventListener('click', openIntro);

/* display tablets (#kiosk): close the book when nobody's playing, reset for the next person */
let lastInput = Date.now(), wakeLock = null;
['pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, () => { lastInput = Date.now(); }, { capture: true, passive: true }));
function keepAwake() {
  if (!KIOSK || wakeLock || !navigator.wakeLock) return;
  navigator.wakeLock.request('screen').then((l) => { wakeLock = l; l.addEventListener('release', () => { wakeLock = null; }); }).catch(() => {});
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) keepAwake(); });
function kioskCheck() {
  if (!KIOSK) return;
  const idle = Date.now() - lastInput;
  if (idle > 120000 && window.__twUpdateReady) { location.reload(); return; }
  if (idle > 120000 && S.total > 0) { closeModal(); resetGame(false); lastInput = Date.now(); return; }
  if (idle > 45000 && intro.hidden) { closeModal(); showIntro('Tap to play'); }
}

/* =====================================================================
   MAIN LOOP
   ===================================================================== */
function renderAll() { renderTop(); renderShelf(); renderNext(); renderHelpers(); renderUpgrades(); renderBonus(); renderBuffs(); }
let last = performance.now(), uiAt = 0, slowAt = 0, rafOn = false;
// full speed only while paper, confetti, rain, a job, mould or the tap streak needs it; otherwise ten calm ticks a second
const busy = () => parts.length > 0 || fxDirty || rainOn || rainLevel > 0 || drops.length > 0 || splashes.length > 0 || rainDirty || taskBtns.length > 0 || !!mould || streak > 0;
function frame(now) { update(now); if (busy()) requestAnimationFrame(frame); else rafOn = false; }
function wake() { if (!rafOn) { rafOn = true; requestAnimationFrame(frame); } }
function idleTick() { if (!rafOn) { update(performance.now()); if (busy()) wake(); } }
function update(now) {
  const raw = Math.max(0, (now - last) / 1000), dt = Math.min(0.5, raw);
  last = now;
  const wall = Date.now();
  if (buffs.some((b) => b.until <= wall)) { buffs = buffs.filter((b) => b.until > wall); recompute(); }
  if (now - lastTap > 700) streak = Math.max(0, streak - dt * 0.6);
  earn(cache.pps * Math.min(raw, 120));
  renderTop();
  placeTaskButtons(); placeMould();
  drawFx();
  drawRain(dt);
  if (now - uiAt > 250) {
    uiAt = now;
    checkHistory(false);
    renderShelf(); renderNext(); renderHelpers(); renderUpgrades(); renderBuffs(); renderBonus();
    if (sheet === 'badges') renderSheet();
  }
  if (now - slowAt > 1000) {
    slowAt = now;
    for (const b of BADGES) if (!S.badges[b.id] && b.test()) { S.badges[b.id] = 1; recompute(); toast(`Badge: ${b.name}`, `${b.desc} · +1% reading`); }
    const calm = modalBack.hidden && intro.hidden && !document.hidden && !turning && storyPending < 0;
    if (wall >= nextBookAt) { if (calm) spawnRunaway(); nextBookAt = wall + (60000 + Math.random() * 90000) / bookFreq(); }
    if (wall >= nextMouldAt) {
      if (calm && reached('apnk') && !reached('closure')) spawnMould();
      nextMouldAt = wall + (35000 + Math.random() * 45000) / (KIOSK ? 2 : 1);
    }
    if (wall >= nextQuizAt) { if (calm) spawnQuiz(); nextQuizAt = wall + (KIOSK ? 30000 : 55000) + Math.random() * 30000; }
    if (wall - newsAt > 9000) { newsAt = wall; rotateNews(); }
    kioskCheck();
  }
}

/* =====================================================================
   START
   ===================================================================== */
function start(hot) {
  load(hot && hot.state);
  recompute();
  if (!KIOSK) {
    try { soundOn = localStorage.getItem(SAVE_KEY + '-sound') === '1'; } catch (e) {}
    const away = (Date.now() - (S.lastSave || Date.now())) / 1000;
    if (away > 60 && cache.basePps > 0 && S.introSeen) {
      const gain = cache.basePps * Math.min(away, 3 * 3600) * 0.5;
      earn(gain);
      setTimeout(() => toast('Welcome back!', `Your helpers kept reading while you were away: +${fmt(gain)} pages.`), 800);
    }
  }
  renderSound();
  sizeFx(); addEventListener('resize', () => { sizeFx(); layoutView(); });
  if ('ResizeObserver' in window) new ResizeObserver(layoutView).observe(stage);
  measureContent();
  paintScene(viewIdx === null ? curIdx() : viewIdx);
  if (S.clicks > 0) $('#taphint').hidden = true;
  renderAll(); renderCaption(false); rotateNews();
  if (KIOSK || !S.introSeen) showIntro(KIOSK ? 'Tap to play' : null);
  if (taskActive()) setTimeout(startTask, 300);
  wake(); setInterval(idleTick, 100);
  setInterval(save, 10000);
}
addEventListener('hashchange', () => location.reload());
window.__tw = { get S() { return S; }, set S(v) { S = v; }, HISTORY, HELPERS, UPGRADES, priceOf, recompute, cache, buyHelper, buyUpgrade, availableUpgrades, checkHistory, curIdx, earn, startTask, finishTask, hitTask, openBook, spawnQuiz, spawnMould, spawnRunaway, setBulk: (n) => (bulk = n), paintScene, turnTo, update, turnPage, nextReady, changedSpot, get busy() { return { parts: parts.length, fxDirty, rainOn, rainLevel, drops: drops.length, splashes: splashes.length, rainDirty, tasks: taskBtns.length, mould: !!mould, streak }; }, get rain() { return { on: rainOn, level: rainLevel, drops: drops.length, splashes: splashes.length }; } };
start({});


/* =====================================================================
   OFFLINE: keep a copy of the game on the device so it runs without a connection
   ===================================================================== */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener('load', () => {
    let had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (had) window.__twUpdateReady = true; had = true; });
    navigator.serviceWorker.register('sw.js').then((reg) => {
      const check = () => { reg.update().catch(() => {}); };
      setInterval(check, (KIOSK ? 15 : 60) * 60000);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    }).catch(() => {});
  });
}
})();
