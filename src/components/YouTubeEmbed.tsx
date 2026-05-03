import React, { useRef, forwardRef, useImperativeHandle } from 'react';

export interface YouTubeEmbedProps {
  videoId: string;
  width?: string;
  height?: string;
  title?: string;
  onRequestFullScreen?: () => void;
}

type YouTubeEmbedHandle = {
  requestFullScreen: () => void;
};

const YouTubeEmbed = forwardRef<YouTubeEmbedHandle, YouTubeEmbedProps>(
  ({ videoId, width = '100%', height = '400', title = 'YouTube video player', onRequestFullScreen }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      requestFullScreen: () => {
        if (containerRef.current) {
          if (containerRef.current.requestFullscreen) {
            containerRef.current.requestFullscreen();
          } else if ((containerRef.current as any).webkitRequestFullscreen) {
            (containerRef.current as any).webkitRequestFullscreen();
          } else if ((containerRef.current as any).msRequestFullscreen) {
            (containerRef.current as any).msRequestFullscreen();
          }
        }
      }
    }), []);

    return (
      <div ref={containerRef} style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          width={width}
          height={height}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
        {onRequestFullScreen && (
          <button
            style={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
            onClick={onRequestFullScreen}
            aria-label="Full Screen"
          >
            Full Screen
          </button>
        )}
      </div>
    );
  }
);

export default YouTubeEmbed;
