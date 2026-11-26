# auron.ae — Retro Creative Portfolio

> Personal portfolio for **Sarang**, independent video editor, motion designer and graphic designer.
> Public creative brand: **auron.ae**

---

## Quick start

```bash
# 1. Install dependencies
cd auron-ae
npm install

# 2. (Optional) Configure Supabase
cp .env.example .env
# Edit .env and add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

# 3. Run locally
npm run dev
# → http://localhost:5173
```

---

## Project structure

```
auron-ae/
├── public/
│   ├── assets/
│   │   ├── images/       ← graphic design artwork
│   │   ├── thumbnails/   ← card preview images
│   │   ├── videos/       ← local MP4 files (keep small)
│   │   └── textures/     ← optional grain/noise textures
│   ├── favicon.svg
│   ├── og-image.jpg      ← social sharing image (1200×630)
│   └── _redirects        ← Netlify SPA routing rule
├── src/
│   ├── components/       ← Navbar, Footer, ProjectCard, etc.
│   ├── data/
│   │   ├── projects.js   ← ★ add your projects here
│   │   └── siteConfig.js ← ★ change your name, links, text here
│   ├── hooks/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Work.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── admin/        ← private admin dashboard
│   ├── styles/
│   │   ├── tokens.css    ← colour palette & spacing variables
│   │   ├── global.css
│   │   └── components.css
│   └── utils/
│       ├── youtube.js    ← YouTube URL parsing
│       └── supabase.js   ← Supabase client
├── .env.example
└── vite.config.js
```

---

## How to change personal details

Edit **`src/data/siteConfig.js`**:

```js
export const siteConfig = {
  brand:       'auron.ae',
  creatorName: 'Sarang',
  email:       'your@email.com',   // ← change this
  socials: {
    instagram: 'https://instagram.com/YOUR_HANDLE',  // ← add yours
    youtube:   '',
    behance:   '',
    linkedin:  '',
  },
  // hero, about copy, services, etc. are all here
};
```

---

## How to add a project

### YouTube project
1. Add an entry to `src/data/projects.js`:

```js
{
  id:          'my-edit-01',
  slug:        'my-edit-01',
  title:       'My Video Edit',
  summary:     'Short description shown on the card.',
  description: 'Full description shown in the project modal.',
  category:    'Video Editing',   // see CATEGORIES in projects.js
  type:        'youtube',
  featured:    false,
  year:        '2026',
  thumbnail:   '/assets/thumbnails/my-edit-01.webp',  // optional
  youtubeUrl:  'https://youtu.be/VIDEO_ID',
  role:        'Editor',
  tools:       ['Premiere Pro', 'After Effects'],
  visible:     true,
  status:      'published',
  sortOrder:   10,
}
```

### Image / graphic design project
```js
{
  id:       'my-poster-01',
  title:    'Event Poster',
  category: 'Posters & Thumbnails',
  type:     'image',
  thumbnail: '/assets/thumbnails/my-poster-01.webp',
  imageSrc:  '/assets/images/my-poster-01-full.webp',
  visible:  true,
  status:   'published',
  sortOrder: 20,
}
```

### Gallery
```js
{
  id:       'my-gallery-01',
  title:    'Design Collection',
  category: 'Graphic Design',
  type:     'gallery',
  thumbnail: '/assets/thumbnails/my-gallery-cover.webp',
  media: [
    '/assets/images/design-01.webp',
    '/assets/images/design-02.webp',
  ],
  visible:  true,
  status:   'published',
}
```

### Local video
```js
{
  id:       'my-motion-01',
  title:    'Motion Reel',
  category: 'Motion Graphics',
  type:     'video',
  thumbnail: '/assets/thumbnails/my-motion-01.webp',
  videoSrc:  '/assets/videos/my-motion-01.mp4',
  visible:  true,
  status:   'published',
}
```

> **Large videos**: keep MP4 files under ~50 MB for practical web use. Prefer YouTube for anything larger.

---

## How to add images and videos

1. Copy your file into the correct folder in `public/assets/`:
   - `public/assets/images/`      — graphic artwork, full-size
   - `public/assets/thumbnails/`  — card preview images (aim for 800×450 px WebP)
   - `public/assets/videos/`      — MP4 video files

2. Use simple, lowercase filenames with no spaces: `poster-event-01.webp`

3. Reference the file in `projects.js` using its path relative to `public/`:
   ```
   thumbnail: '/assets/thumbnails/poster-event-01.webp'
   ```

---

## Admin dashboard

The site includes a private admin dashboard at `/admin`.

**Without Supabase configured**: the dashboard is accessible with any email/password (for local dev only). Use it to preview the UI; save operations will remind you to edit the JSON files directly.

**With Supabase configured**:
- Only the authorized owner account can log in.
- Projects are stored in the Supabase database.
- Changes made in the dashboard are reflected on the live site.

### Setting up Supabase (free)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
4. Create a `.env` file from `.env.example` and paste the values
5. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, and click **Run**.
   This creates the `projects` and `site_settings` tables, RLS policies, and the public `portfolio-media` storage bucket.

### Create the owner account

In Supabase → **Authentication → Users → Invite user**, enter your email.
You will receive an email to set your password. Use those credentials to log in at `/admin`.

**Disable public sign-up**: Supabase → Authentication → Settings → disable **Enable email confirmations** for invites only, and set **Disable sign ups** = true.

---

## Deployment (free, no custom domain)

### Recommended: Netlify

1. Push your project to a **GitHub repository**
2. Go to [netlify.com](https://netlify.com) → **New site → Import from Git**
3. Connect your GitHub repo
4. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Under **Environment variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **Deploy**
7. Your site will be live at `yoursite.netlify.app` (rename it in Netlify settings)

The `public/_redirects` file handles SPA routing automatically.

### Alternative: Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project → Import from GitHub**
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
6. Click **Deploy** → live at `yourproject.vercel.app`

### Alternative: GitHub Pages

1. Install `gh-pages`: `npm install -D gh-pages`
2. Add to `package.json` scripts: `"deploy": "gh-pages -d dist"`
3. Set `base: '/your-repo-name/'` in `vite.config.js`
4. Run: `npm run build && npm run deploy`

> ⚠ GitHub Pages does not support SPA routing out of the box. Use Netlify or Vercel for best results.

---

## Build & preview locally

```bash
# Production build
npm run build

# Preview the production build locally
npm run preview
# → http://localhost:4173
```

---

## Free-tier limits (as of late 2026)

| Service         | Storage      | Bandwidth      | Notes |
|-----------------|-------------|----------------|-------|
| Netlify free    | 100 GB/mo   | 100 GB/mo      | Fine for a portfolio |
| Vercel free     | —           | 100 GB/mo      | Fine for a portfolio |
| Supabase free   | 500 MB DB   | 2 GB storage   | Sufficient for metadata + thumbnails |
| GitHub (repo)   | Soft limit  | —              | Avoid committing large videos |

> ⚠ Free-tier terms change. Check each provider's current pricing page before launch.
> Keep large video files on YouTube. Only store images and thumbnails in Supabase Storage or the repo.

---

## Backup / export

To back up your projects from Supabase:
```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

Or export via Supabase Dashboard → **Table Editor → Export as CSV**.

---

## Placeholders still needing your information

| Item | Location |
|------|----------|
| Your email | `src/data/siteConfig.js` → `email` |
| Instagram URL | `src/data/siteConfig.js` → `socials.instagram` |
| YouTube channel | `src/data/siteConfig.js` → `socials.youtube` |
| Behance URL | `src/data/siteConfig.js` → `socials.behance` |
| LinkedIn URL | `src/data/siteConfig.js` → `socials.linkedin` |
| Project thumbnails | `public/assets/thumbnails/` |
| Project media | `public/assets/images/` and/or YouTube URLs in `projects.js` |
| OG image | `public/og-image.jpg` (1200×630 px) |
| Supabase credentials | `.env` (copy from `.env.example`) |
| Availability message | `src/data/siteConfig.js` → `availabilityMessage` |

---

## Known limitations

- The admin dashboard requires Supabase to persist changes across devices. Without it, edits must be made in `src/data/projects.js` directly.
- Large local video files will slow builds and may exceed free hosting bandwidth limits. Use YouTube for videos over ~20 MB.
- No built-in image optimization. Use WebP files at appropriate sizes for best performance.
- Supabase free tier pauses inactive projects after 7 days of inactivity (as of 2026). Upgrade to Pro or use a workaround (ping endpoint) if needed.

