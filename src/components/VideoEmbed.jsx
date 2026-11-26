import { buildEmbedUrl, buildWatchUrl, buildThumbnailUrl } from '../utils/youtube';
import { useState } from 'react';
import '../styles/components.css';

function YouTubeEmbed({ youtubeUrl }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl  = buildEmbedUrl(youtubeUrl);
  const thumbUrl  = buildThumbnailUrl(youtubeUrl);
  const watchUrl  = buildWatchUrl(youtubeUrl);

  if (!embedUrl) {
    return (
      <div className="video-embed" style={{ paddingBottom: '56.25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', textAlign: 'center', color: '#888' }}>
          <p className="label" style={{ marginBottom: 8 }}>Invalid YouTube URL</p>
          {watchUrl && (
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              Watch on YouTube ↗
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="video-embed">
      {playing ? (
        <iframe
          src={`${embedUrl}&autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className="video-embed__poster"
          onClick={() => setPlaying(true)}
          aria-label="Play video"
        >
          {thumbUrl && (
            <img src={thumbUrl} alt="Video thumbnail" loading="lazy" />
          )}
          <span className="video-embed__play" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

function LocalVideo({ videoSrc, thumbnail }) {
  return (
    <div className="video-embed">
      <video
        controls
        preload="none"
        poster={thumbnail || undefined}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
}

export default function VideoEmbed({ project }) {
  if (project.type === 'youtube') {
    return <YouTubeEmbed youtubeUrl={project.youtubeUrl} />;
  }
  if (project.type === 'video') {
    return <LocalVideo videoSrc={project.videoSrc} thumbnail={project.thumbnail} />;
  }
  return null;
}

