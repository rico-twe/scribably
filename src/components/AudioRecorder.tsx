import { useCallback } from 'react'
import { RecordButton } from './RecordButton'

interface AudioRecorderProps {
  recordingState: 'idle' | 'recording' | 'processing' | 'done' | 'error';
  duration: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onFileUpload: (file: File) => void;
  isDemo?: boolean;
  maxDurationReached?: boolean;
}

const ACCEPTED_TYPES = '.webm,.wav,.mp3,.m4a,.ogg'

export function AudioRecorder({
  recordingState, duration, onStartRecording, onStopRecording, onFileUpload,
  isDemo, maxDurationReached,
}: AudioRecorderProps) {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFileUpload(file)
  }, [onFileUpload])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFileUpload(file)
  }, [onFileUpload])

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <RecordButton
        state={recordingState}
        duration={duration}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
      />
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="w-full group border border-dashed border-border-oat rounded-[12px] p-4 text-center hover:border-border-input hover:bg-lemon-400/5 transition-all cursor-pointer"
      >
        <label className="cursor-pointer flex flex-col items-center gap-1.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-tertiary group-hover:text-text-secondary transition-colors">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          <span className="text-[11px] text-text-tertiary group-hover:text-text-secondary transition-colors font-clay-ui">
            Upload audio file
          </span>
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}
