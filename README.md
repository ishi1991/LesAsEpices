# Les As Épicés – Website

Bilingual (FR/EN) static website: Home, About, Past events, Menus, Join us, Donate, Contact.
Forms are saved in **Supabase**. The site is hosted for free on **GitHub Pages**.

## 1. Supabase (stores the forms)
1. Create a free account/project at https://supabase.com
2. Open **SQL Editor → New query**, paste the content of `supabase.sql`, click **Run**.
3. Open **Project Settings → API**. Copy the **Project URL** and the **anon public key**.
4. Paste them in `config.js` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
   The anon key is public by design; the security rules in `supabase.sql` only allow sending forms, not reading them.
5. Read the submissions in **Table Editor** (`join_requests`, `donation_pledges`, `contact_messages`).

## 2. GitHub Pages (puts the site online)
1. Create a GitHub repository (e.g. `lesasepices`) and upload all files of this folder.
2. **Settings → Pages → Deploy from a branch → `main` / root → Save**.
3. After a minute the site is live at `https://YOUR-USERNAME.github.io/lesasepices/`.
   (A custom domain such as lesasepices.fr can be added later in the same page.)

## 3. Add your photos and videos
- Copy files into the `images/` folder (e.g. `images/mariage1.jpg`, `images/video1.mp4`).
- In `app.js`, edit the `EVENTS` list: add `{t:"img", src:"images/mariage1.jpg"}` or `{t:"video", src:"images/film.mp4", poster:"images/film.jpg"}` to an event's `media` list.
- Videos: use H.264 `.mp4` (iPhone `.mov` in HEVC does not play in every browser).
- Keep photos under ~500 KB and videos short (GitHub limit: 100 MB per file).

## 4. Donations
- Real online payments: create a free HelloAsso page (made for French associations, no fees),
  then put its link in `config.js` → `DONATION_LINK`. A "Donate online" button will appear.
- You can also show your association IBAN with `IBAN` in `config.js`.
- Without this, the donate form simply records the pledge and you contact the donor.

## 5. Menus page
- `menus.html` is the menus page. Open `menus.js` and fill in the `MENUS` list (an example is written at the top of the file).
- You can also show a menu as a picture (`image:"images/menu.jpg"`) or a PDF (`pdf:"images/menu.pdf"`).
- Or just send me your menus and I will add them.

## 6. Reviews
- Visitors leave a review on the site. It is saved unpublished in Supabase (`reviews` table).
- To publish it: Table Editor > `reviews` > set `approved` to `true`.
- Reviews you collect yourself: add them to the `REVIEWS` list in `app.js`.

## Files
`menus.html` + `menus.js` menus page · `index.html` structure · `style.css` design · `app.js` language, events, forms · `config.js` your settings · `supabase.sql` database
