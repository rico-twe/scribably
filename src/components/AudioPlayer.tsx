import type { RefObject } from 'react'

interface AudioPlayerProps {
  src: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  onTimeUpdate: (t: number) => void;
}

export function AudioPlayer({ src, audioRef, onTimeUpdate }: AudioPlayerProps) {
  return (
    <div className="mb-3 px-1">
      <audio
        ref={audioRef}
        src={src}
        controls
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
        className="w-full h-8 rounded-[8px]"
      />
    </div>
  )
}
