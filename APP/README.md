# Fetch 1600

A game-style daily SAT practice app, like Duolingo for the SAT, built for a group of friends. The theme is dogs and music: the mascots are **Gao** (a white Maltese, a girl) and **Soy** (a black-and-white Shih Tzu, a boy), and every player is a dog in the pack. It uses the ~44,800 original questions from the SAT Prep site one folder up (`../bank`), so there's no second question bank to maintain.

It's a static web app: no build step and no app store. It works on **iPhone, Android, and computers**, and it installs on a phone's home screen like a regular app.

## Install on a phone

The app has to be opened from its https link (for example `https://danhieuvo.github.io/SATPREP/APP/`). Home-screen install doesn't work from `localhost` or a Wi-Fi IP address.

- **iPhone / iPad (Safari):** open the link in **Safari**, tap **Share** (the square with an arrow), then **Add to Home Screen** → **Add**. Open it from the new Fetch 1600 icon so it runs full screen. On iOS, the home-screen app keeps its own progress, separate from Safari, so kids should always open it from the icon.
- **Android (Chrome):** open the link in **Chrome**, tap **⋮** → **Add to Home screen** or **Install app**, then open it from the icon.

Phone details handled:
- PNG icons for iOS and Android, including a maskable icon
- Notch and home-bar safe areas
- No accidental zoom on inputs
- No "stuck" hover highlight after tapping an answer
- Offline support for lessons already loaded

## What makes it a game

| Feature | How it works |
|---|---|
| **Breed path (never ends)** | Separate Math and Reading & Writing paths. Each **level is a dog breed**, from toy dogs to big dogs: Chihuahua, Yorkshire Terrier, Pomeranian, Maltese, Shih Tzu → Pug, Dachshund, Cavalier, French Bulldog, Poodle → Shiba Inu, Corgi, Beagle, Border Collie, Dalmatian → Boxer, Husky, Labrador, Golden Retriever, German Shepherd. After Level 20 come **Top Dog ★1, ★2, ★3…** ranks that never end and focus on each kid's weakest question types. A level has 3–6 lessons, a treat bag, and a level challenge (70% to pass, which earns the breed badge). Kids can **jump ahead** with a test (80%), and earned badges can be replayed. |
| **Three difficulty dials** | Every level turns up (1) **question types**: 2 at Level 1, adding new ones until all 11 R&W or 18 Math types by Level 16; (2) **questions per lesson**: 5 at Level 1, up to 9, and 10 for Top Dog; and (3) **difficulty**: all easy at Level 1, mostly hard by Level 20. |
| **Scent Tracker** | Opens two **radar maps** (Reading & Writing and Math) showing a rating for every question type, plus the weakest "trails" with a **Train** button for 5 targeted questions. |
| **Ratings (Elo on the SAT scale)** | Each question type has a hidden chess-style Elo rating. Every answer is a match against the question (easy 700, medium 1000, hard 1300): beating hard questions raises it most, and missing easy ones lowers it most. More answers make a rating more accurate, not automatically higher. Ratings are shown on the SAT scale: each question type and section is **200–800**, and the **overall rating is Math + R&W, up to 1600**. 800 means nearly always beating hard questions. Titles: Puppy, Fetcher (300+), Tracker (450+), Retriever (550+), Champion (650+), Alpha (750+). Ratings under 8 answers are marked as still settling. This is a practice rating, not a predicted SAT score. |
| **XP** | Easy 10, medium 15, hard 20, plus bonuses for finishing a lesson and for a perfect lesson. |
| **Streaks** | Finish one lesson a day to keep your streak. Streak freezes cover missed days, and a lost streak can be repaired the same day. Milestones pay dog treats. |
| **Hearts** | 5 hearts, and you lose one per wrong answer in a lesson, so you read carefully instead of guessing. At 0 the lesson stops: refill with treats, or end it and keep the XP. Hearts come back 1 per hour, or 1 per correct answer in Mistakes review. |
| **Rating bar** | The top of the Learn screen shows the Math and R&W ratings (200–800). Tapping it shows the overall rating out of 1600 and explains that it is not an SAT score. |
| **Daily goal and quests** | Pick a daily XP goal (Casual to Intense). Three daily quests pay out in treasure chests. |
| **Daily Challenge** | The same 5 questions for everyone that day, for 2× XP. Pack scoreboard by score, then time. |
| **Leagues** | Weekly pack leaderboard. The top ~30% move up and the bottom ~30% move down (with 5+ players), through Bronze → Silver → Gold → Sapphire → Ruby → Emerald → Amethyst → Pearl → Obsidian → Diamond. Top 3 win treats. |
| **Pack** | Invite code/link, who has practiced today, an activity feed with 👏 high fives, **nudges** for friends who haven't practiced, and a weekly **Friends quest** (a shared XP goal). |
| **Your dog** | Each player picks one of **20 breeds** (Shih Tzu, Maltese, Golden Retriever, Husky, Corgi, Pug, Poodle, Dalmatian…), then an optional color mix (coat, markings, mask…). Breed and colors are free to change anytime. |
| **Dog treats and the Doghouse** | Treats 🦴 are the currency: +5 per lesson (+5 more for a perfect one), plus quests, treat bags on the path, breed badges, and league prizes. In the Doghouse you **feed your dog** (biscuit, kibble, meaty bone, pupcake). Fullness drops about a third per day, and the dog's face shows it: Full & happy → Happy → Peckish → Hungry → Starving. Packmates can see each other's dogs, and a hungry dog shows up as an alert in the top bar. Treats also buy outfits for the full sitting dog (jerseys, hoodie, band tee, tuxedo, super cape…), hats, glasses, collars, fun coat colors, and power-ups. |
| **Achievements** | 16 badges with levels, like Wildfire, Sharpshooter, Heavy Lifter, Math Whiz, Wordsmith, Champion, and Night Owl. |
| **Profile** | Stats, a weekly XP chart, a streak calendar, and skill mastery. There's also a **calendar reminder** (.ics) so phones buzz every day. |

In the code and database, packs are still called "squads" (`sq_*` tables), and saved data still uses `satquest.*` keys from the app's first name.

## Two modes

1. **Device-only (default, zero setup).** Everything works, but a pack only includes profiles on the same device. That's good for trying it out.
2. **Online packs (free, ~10 minutes, one time).** Friends on different phones share leagues, feeds, nudges, and the Daily Challenge board. Progress is also backed up, and a **transfer code** moves a player to a new phone.

### Connect the pack server (Supabase free tier)

1. Create a free account at [supabase.com](https://supabase.com) and click **New project**. Any name and region works; save the database password somewhere.
2. Open **SQL Editor → New query**, paste all of [`supabase.sql`](supabase.sql), and click **Run**. You should see "Success. No rows returned."
3. Click **Connect** (or **Project Settings → API Keys**) and copy:
   - the **Project URL** (`https://xxxx.supabase.co`)
   - the **publishable** key (`sb_publishable_…`). On older projects, use the **anon public** key instead.
4. Paste both into [`config.js`](config.js):
   ```js
   window.SQ_CONFIG = { supabaseUrl: 'https://xxxx.supabase.co', supabaseKey: 'sb_publishable_...' };
   ```
5. Commit and push. The live app is at `https://danhieuvo.github.io/SATPREP/APP/`.

### Privacy: kids see only their own pack

- **The public key reads nothing directly.** Every table is locked, and the app's public (publishable) key can't read any table.
- **Kids see only their own pack.** The app gets pack members and the activity feed through database functions that check the player's private device secret, and those functions return only that player's pack.
- **Nobody can change someone else's data.** Every write also checks the device secret, so no one can edit another player's XP, streak, or feed.
- **What's shared inside a pack:** display name, dog, ratings, level, streak, and league. Have kids use a first name or nickname. No emails, passwords, or ages are collected from kids.

## Admin page (see every account)

`APP/admin.html` shows every player:
- their pack, overall/Math/R&W ratings, and breed levels
- streak, last lesson, lessons, accuracy, weekly XP, and dog hunger
- search, pack filter, sorting, and CSV download
- click a player for both radar maps and every question-type rating

It only works with the pack server connected. It isn't linked from the app and is hidden from search engines, but its security comes from the login.

One-time setup in Supabase:
1. Run the latest `supabase.sql` (safe to re-run).
2. **Authentication → Users → Add user → Create new user**: enter the admin email and a strong password, and tick **Auto Confirm User**.
3. **SQL Editor**, run once, using the email from step 2. Keep this line out of the repo:
   ```sql
   insert into sq_admins(email) values ('admin-email@example.com');
   ```
4. Optional but recommended: **Authentication → Sign In / Providers**, turn off **Allow new users to sign up**. Only you need an account; kids never sign in.
5. Open `https://danhieuvo.github.io/SATPREP/APP/admin.html` and sign in.

The password is sent only to Supabase; it isn't stored in any file in this repo. The sign-in lasts until the browser tab is closed.

## Run locally

From the `SAT` folder (not `APP`, because the app loads `../bank`):

```bash
python -m http.server 8765
```

Then open http://localhost:8765/APP/.

## Files

```
admin.html, js/admin.js   admin dashboard (Supabase Auth sign-in; admins listed in sq_admins)
index.html            shell; loads ../bank, ../js/core.js (question loading + answer checking), then the app
config.js             pack server URL/key (blank = device-only)
supabase.sql          locked tables, pack-only read functions, secret-checked writes, admin functions
js/dogs.js            20 dog breeds (head and full sitting body) from shared SVG parts, moods, outfits, coat colors, accessories, mascot pair (names at the top)
js/game.js            rules: breed levels + difficulty dials, Elo ratings (SAT scale), XP, streaks, hearts, treats, feeding, quests, achievements, leagues
js/backend.js         Supabase (plain fetch) and device-only backends with the same interface
js/lesson.js          question selection (unseen first, level dials, weakest types for Top Dog/hunts), lesson player, level-up celebration
js/screens.js         welcome/onboarding, breed path, Scent Tracker radars, leagues, quests, pack, Doghouse, profile, dog picker
js/ui.js              icons, synthesized sounds, confetti, sheets, toasts
js/app.js             router, tab bar, boot, pack sync
css/app.css           styles (light and dark)
sw.js, manifest.webmanifest, icon.svg, icons/   installable app (iPhone + Android) + offline cache
```

Tuning knobs, like hearts per hour, prices, XP values, treats per lesson, hunger speed and food, the breed ladder and question-type order (`LADDER`, `TYPE_ORDER`, `levelSpec`), and league zones, are at the top of `js/game.js`.

## Known limits

- **No push notifications.** Real push reminders need a server. Use the calendar reminder in Profile → Settings.
- **League weeks run on each phone's local time**, Monday to Sunday. Results are settled the first time each player opens the app in a new week.
- **One device at a time per player.** If the same player uses two phones, the last one to sync wins. The transfer code is for moving to a new phone.
- **Daily Challenge fairness** assumes everyone has the same question bank. That holds once the site is deployed, but if the bank is rebuilt mid-day, that day's questions change.
- Not affiliated with College Board. SAT® is a trademark registered by the College Board, which does not endorse this app.
