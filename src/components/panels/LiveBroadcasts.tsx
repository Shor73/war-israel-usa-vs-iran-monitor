'use client'
import { useState, useEffect } from 'react'
import type { StreamInfo } from '@/../../app/api/streams/route'

const FALLBACK_STREAMS: StreamInfo[] = [
  { key: 'i24',      name: 'i24 News English', videoId: 'arQQHsgw2Ek', label: 'IL',   color: '#2196f3' },
  { key: 'sky',      name: 'Sky News',          videoId: 'uvviIF4725I', label: 'NEWS', color: '#ab47bc' },
  { key: 'france24', name: 'France 24 English', videoId: 'Ap-UM1O9RBU', label: 'NEWS', color: '#2196f3' },
  { key: 'bbc',      name: 'BBC News',          videoId: 'bjgQzJzCZKs', label: 'NEWS', color: '#ff6b35' },
  { key: 'dw',       name: 'DW News',           videoId: 'LuKwFajn37U', label: 'NEWS', color: '#ffc107' },
  { key: 'arabiya',  name: 'Al Arabiya',        videoId: 'n7eQejkXbnM', label: 'ARAB', color: '#00e676' },
]

function StreamTile({ stream, idx }: { stream: StreamInfo; idx: number }) {
  const [unavailable, setUnavailable] = useState(false)
  const ytUrl = `https://www.youtube.com/embed/${stream.videoId}?autoplay=0&mute=1&rel=0`
  const ytOpen = `https://www.youtube.com/watch?v=${stream.videoId}`

  return (
    <div
      className="relative border overflow-hidden"
      style={{ borderColor: '#2a4a6b' }}
    >
      {/* Header bar */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-1.5 py-0.5"
        style={{ background: 'rgba(10,14,20,0.92)' }}
      >
        <span className="font-military text-[8px]" style={{ color: '#c8d6e5' }}>{stream.name}</span>
        <div className="flex items-center gap-1">
          <span className="font-military text-[7px] border px-0.5" style={{ color: stream.color, borderColor: stream.color + '80' }}>
            {stream.label}
          </span>
          {!unavailable && (
            <>
              <span className="w-1.5 h-1.5 rounded-full live-dot" style={{ backgroundColor: '#ff2d2d' }} />
              <span className="font-military text-[7px]" style={{ color: '#ff2d2d' }}>LIVE</span>
            </>
          )}
          <a
            href={ytOpen}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="font-military text-[7px] border px-0.5 ml-1 hover:opacity-80"
            style={{ color: '#4a6a7a', borderColor: '#2a4a6b' }}
          >
            ↗
          </a>
        </div>
      </div>

      {/* Player or unavailable state */}
      {unavailable ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: '#0a0e14' }}>
          <span className="font-military text-[8px]" style={{ color: '#4a6a7a' }}>STREAM UNAVAILABLE</span>
          <a
            href={ytOpen}
            target="_blank"
            rel="noopener noreferrer"
            className="font-military text-[7px] border px-2 py-0.5 hover:opacity-80"
            style={{ color: '#ffc107', borderColor: '#ffc10750' }}
          >
            OPEN ON YOUTUBE ↗
          </a>
          <button
            onClick={() => setUnavailable(false)}
            className="font-military text-[7px]"
            style={{ color: '#4a6a7a' }}
          >
            retry
          </button>
        </div>
      ) : (
        <iframe
          key={idx}
          className="w-full h-full"
          src={ytUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none', background: '#0a0e14' }}
          onError={() => setUnavailable(true)}
        />
      )}
    </div>
  )
}

export default function LiveBroadcasts() {
  const [streams, setStreams] = useState<StreamInfo[]>(FALLBACK_STREAMS)

  useEffect(() => {
    fetch('/api/streams')
      .then(r => r.json())
      .then((data: StreamInfo[]) => { if (Array.isArray(data) && data.length > 0) setStreams(data) })
      .catch(() => { /* keep fallback */ })
  }, [])

  return (
    <div className="grid h-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '2px' }}>
      {streams.map((stream, idx) => (
        <StreamTile key={stream.key} stream={stream} idx={idx} />
      ))}
    </div>
  )
}
