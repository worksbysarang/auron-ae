// ============================================================
// AURON.AE — Project Data
// Add, edit or remove projects here.
//
// Supported types: 'youtube' | 'video' | 'image' | 'gallery'
//
// To add a project:
//   1. Copy a media file into public/assets/ (images/, thumbnails/, videos/)
//   2. Add a new object below following the shape of existing entries.
//   3. Set visible: true to publish it.
//
// Fields marked [optional] can be omitted — missing fields are hidden,
// they will NOT break the UI.
// ============================================================

export const projects = [
  // ---- YOUTUBE EXAMPLE ----
  {
    id: 'placeholder-video-01',
    slug: 'placeholder-video-01',
    title: 'Video Edit — Coming Soon',
    summary: 'A sample YouTube project. Replace this with your own work.',
    description: 'Replace this description with a brief about the project — what you did, the goal, the result.',
    category: 'Video Editing',
    type: 'youtube',
    featured: true,
    year: '2026',
    thumbnail: '', // '/assets/thumbnails/your-thumbnail.webp'
    youtubeUrl: '', // 'https://youtu.be/VIDEO_ID' or 'https://www.youtube.com/watch?v=VIDEO_ID'
    role: '', // [optional] e.g. 'Editor'
    tools: [], // [optional] e.g. ['Premiere Pro', 'After Effects']
    clientLabel: '', // [optional] e.g. 'Personal Project'
    externalLink: '', // [optional]
    altText: 'Video edit placeholder project',
    visible: true,
    status: 'published',
    sortOrder: 1,
  },

  // ---- LOCAL VIDEO EXAMPLE ----
  {
    id: 'placeholder-motion-01',
    slug: 'placeholder-motion-01',
    title: 'Motion Graphic — Coming Soon',
    summary: 'A sample local video project. Replace this with your own work.',
    description: '',
    category: 'Motion Graphics',
    type: 'video',
    featured: false,
    year: '2026',
    thumbnail: '',
    videoSrc: '', // '/assets/videos/your-file.mp4'
    role: '',
    tools: [],
    clientLabel: '',
    externalLink: '',
    altText: 'Motion graphics placeholder project',
    visible: true,
    status: 'published',
    sortOrder: 2,
  },

  // ---- SINGLE IMAGE EXAMPLE ----
  {
    id: 'placeholder-graphic-01',
    slug: 'placeholder-graphic-01',
    title: 'Graphic Design — Coming Soon',
    summary: 'A sample image project. Replace this with your own work.',
    description: '',
    category: 'Graphic Design',
    type: 'image',
    featured: true,
    year: '2026',
    thumbnail: '',
    imageSrc: '', // '/assets/images/your-image.webp'
    role: '',
    tools: [],
    clientLabel: '',
    externalLink: '',
    altText: 'Graphic design placeholder project',
    visible: true,
    status: 'published',
    sortOrder: 3,
  },

  // ---- GALLERY EXAMPLE ----
  {
    id: 'placeholder-poster-01',
    slug: 'placeholder-poster-01',
    title: 'Poster / Thumbnail — Coming Soon',
    summary: 'A sample gallery project. Replace this with your own work.',
    description: '',
    category: 'Posters & Thumbnails',
    type: 'gallery',
    featured: true,
    year: '2026',
    thumbnail: '',
    media: [], // ['/assets/images/01.webp', '/assets/images/02.webp']
    role: '',
    tools: [],
    clientLabel: '',
    externalLink: '',
    altText: 'Poster collection placeholder',
    visible: true,
    status: 'published',
    sortOrder: 4,
  },
];

// ---- CATEGORIES ----
export const CATEGORIES = [
  'All',
  'Video Editing',
  'Motion Graphics',
  'Graphic Design',
  'Posters & Thumbnails',
  'Experiments',
];

