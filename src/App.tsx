import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useConfig } from './hooks/useConfig'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { useTranscription } from './hooks/useTranscription'
import { useTextProcessing } from './hooks/useTextProcessing'
import { useHistory } from './hooks/useHistory'
import { initializeProviders } from './providers/init'
import { isConfigured } from './services/config'
import { markdownToLatex } from './services/markdown-to-latex'
import { AudioRecorder } from './components/AudioRecorder'
import { TranscriptionResult } from './components/TranscriptionResult'
import { ExportBar } from './components/ExportBar'
import { HistoryList } from './components/HistoryList'
import { SettingsPanel } from './components/SettingsPanel'
import { navigate } from './hooks/useHashRoute'

type PipelineState = 'idle' | 'recording' | 'transcribing' | 'processing' | 'done' | 'error'

export default function App() {
  const { config, updateConfig } = useConfig()
  const { state: recState, duration, audioBlob, error: recError, startRecording, stopRecording } = useAudioRecorder()
  const { state: txState, result: txResult, error: txError, transcribe } = useTranscription()
  const { state: tpState, cleanState, promptState, cleanedText, setCleanedText, promptText, error: tpError, process } = useTextProcessing()
  const { entries: historyEntries, addEntry, updateLatest, selectedEntry, selectEntry, clearHistory } = useHistory()
  const lastSavedTxRef = useRef<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showLatex, setShowLatex] = useState(false)
  const [theme, setTheme] = useState<'cream' | 'dark'>(() => {
    try { return localStorage.getItem('wp-theme') === 'dark' ? 'dark' : 'cream' }
    catch { return 'cream' }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('wp-theme', theme) } catch { /* noop */ }
  }, [theme])

  const processingEnabled = config.enableCleaning || config.enablePrompt

  useEffect(() => {
    console.log('[WP:app] Config changed, reinitializing providers', {
      stt: config.sttProvider?.providerId,
      llm: config.llmProvider?.providerId,
      enableCleaning: config.enableCleaning,
      enablePrompt: config.enablePrompt,
    })
    initializeProviders(config)
  }, [config])

  useEffect(() => {
    if (!isConfigured(config)) setSettingsOpen(true)
  }, [])

  useEffect(() => {
    if (audioBlob && config.sttProvider) {
      console.log('[WP:app] Audio blob ready, triggering transcription')
      transcribe(audioBlob, config.sttProvider.providerId, config.language)
    }
  }, [audioBlob])

  useEffect(() => {
    if (txState === 'done' && txResult?.text) {
      console.log('[WP:app] Transcription done | text:', txResult.text.substring(0, 100) + '...')

      if (!config.llmProvider) {
        console.log('[WP:app] No LLM provider configured, skipping processing')
        return
      }
      if (!processingEnabled) {
        console.log('[WP:app] Processing disabled, showing raw text only')
        return
      }

      if (config.enableCleaning) {
        console.log('[WP:app] Triggering clean processing')
        process(txResult.text, config.llmProvider.providerId, 'clean', config.language, config.customPrompt)
      }
      // Prompt-Erstellung nur manuell per Button (zweistufige Pipeline)
    }
  }, [txState, txResult])

  // History: save entry when transcription completes
  useEffect(() => {
    if (txState === 'done' && txResult?.text && txResult.text !== lastSavedTxRef.current) {
      lastSavedTxRef.current = txResult.text
      addEntry({
        rawText: txResult.text,
        language: txResult.language ?? config.language,
        duration: txResult.duration ?? 0,
        cleanedText: null,
        promptText: null,
      })
    }
  }, [txState, txResult])

  // History: update latest entry when processing completes
  useEffect(() => {
    if (cleanedText && lastSavedTxRef.current) {
      updateLatest({ cleanedText })
    }
  }, [cleanedText])

  useEffect(() => {
    if (promptText && lastSavedTxRef.current) {
      updateLatest({ promptText })
    }
  }, [promptText])

  const handleClean = useCallback(() => {
    const text = txResult?.text
    if (!text || !config.llmProvider) return
    console.log('[WP:app] Manual clean triggered')
    process(text, config.llmProvider.providerId, 'clean', config.language, config.customPrompt)
  }, [txResult, config, process])

  const handlePrompt = useCallback(() => {
    const text = cleanedText ?? txResult?.text
    if (!text || !config.llmProvider) return
    console.log('[WP:app] Manual prompt triggered | source:', cleanedText ? 'cleanedText' : 'rawText')
    process(text, config.llmProvider.providerId, 'prompt', config.language)
  }, [txResult, cleanedText, config, process])

  const handleFileUpload = useCallback((file: File) => {
    if (config.sttProvider) {
      selectEntry(null)
      console.log('[WP:app] File upload, triggering transcription | name:', file.name, '| size:', file.size)
      transcribe(file, config.sttProvider.providerId, config.language)
    }
  }, [config, transcribe, selectEntry])

  const handleStartRecording = useCallback(() => {
    selectEntry(null)
    startRecording()
  }, [startRecording, selectEntry])

  const isViewingHistory = selectedEntry !== null

  const pipelineState: PipelineState =
    recState === 'recording' ? 'recording' :
    txState === 'transcribing' ? 'transcribing' :
    tpState === 'processing' ? 'processing' :
    txResult || cleanedText || promptText ? 'done' :
    recError || txError || tpError ? 'error' : 'idle'

  const buttonState = pipelineState === 'transcribing' || pipelineState === 'processing'
    ? 'processing' as const : pipelineState

  const displayRawText = isViewingHistory ? selectedEntry.rawText : (txResult?.text ?? null)
  const displayCleanedText = isViewingHistory ? selectedEntry.cleanedText : cleanedText
  const displayPromptText = isViewingHistory ? selectedEntry.promptText : promptText

  const exportText = displayPromptText || displayCleanedText || displayRawText || ''
  const latexText = useMemo(() => exportText ? markdownToLatex(exportText) : null, [exportText])
  const hasResult = !!(displayRawText)

  return (
    <div className="min-h-screen flex flex-col bg-bg-page relative overflow-x-hidden">
      {/* Paper grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Decorative atmosphere blobs */}
      <div aria-hidden className="pointer-events-none fixed -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-matcha-300/20 dark:bg-matcha-600/10 blur-3xl z-0" />
      <div aria-hidden className="pointer-events-none fixed top-[40%] -right-40 w-[420px] h-[420px] rounded-full bg-ube-300/25 dark:bg-ube-800/15 blur-3xl z-0" />

      {/* Header */}
      <header className="relative z-10 sticky top-0 backdrop-blur-md bg-bg-page/75 border-b border-border-oat">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('landing')}
              aria-label="Zur Startseite"
              title="Zur Startseite"
              className="group relative w-9 h-9 rounded-[10px] bg-matcha-300/40 hover:bg-matcha-300/60 flex items-center justify-center transition-all duration-200 hover:-rotate-6 hover:-translate-y-0.5 hover:shadow-[-4px_4px_0_0_#000] dark:hover:shadow-[-4px_4px_0_0_var(--color-matcha-600)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-matcha-800 dark:text-matcha-300">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </button>
            <h1 className="font-clay-heading text-[17px] tracking-[-0.02em] text-text-primary">
              Whisper<span className="italic text-matcha-600 dark:text-matcha-300">Prompt</span>
            </h1>
            <span className="hidden md:inline-block ml-1 px-2 py-0.5 rounded-full bg-lemon-400/60 text-[9.5px] font-mono tracking-[0.12em] uppercase text-lemon-800">
              v1 · beta
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'cream' : 'dark')}
              aria-label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary border border-border-oat bg-bg-card/60 hover:bg-bg-card transition-all duration-200 hover:-rotate-6 hover:-translate-y-0.5 hover:shadow-[-4px_4px_0_0_#000]"
            >
              {theme === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" /><path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" /><path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-clay-ui text-text-primary bg-bg-card border border-border-oat shadow-clay transition-all duration-200 hover:-rotate-6 hover:-translate-y-0.5 hover:shadow-[-4px_4px_0_0_#000]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-70">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Einstellungen
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col md:flex-row p-6 md:p-8 gap-8 overflow-hidden max-w-6xl mx-auto w-full">
        {/* Left: Recorder + Aktuelle Aufnahme + History */}
        <div className={`flex flex-col gap-6 transition-all duration-300 ${hasResult ? 'md:w-[380px] md:flex-shrink-0' : 'md:flex-1'} order-2 md:order-1`}>
          <section className="bg-bg-card/80 backdrop-blur-sm border border-border-oat rounded-[24px] shadow-clay p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="label-uppercase text-text-tertiary">Aufnahme</p>
              <span className="w-1.5 h-1.5 rounded-full bg-matcha-600 animate-pulse" aria-hidden />
            </div>
            <AudioRecorder
              recordingState={buttonState}
              duration={duration}
              onStartRecording={handleStartRecording}
              onStopRecording={stopRecording}
              onFileUpload={handleFileUpload}
            />
          </section>

          {displayRawText && !isViewingHistory && (
            <div className="animate-fade-in bg-bg-card border border-border-oat rounded-[24px] shadow-clay p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="label-uppercase text-text-tertiary">Rohtext</p>
                <span className="px-2 py-0.5 rounded-full bg-matcha-300/40 text-matcha-800 dark:text-matcha-300 text-[10px] font-clay-ui">STT</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">{displayRawText}</p>
            </div>
          )}

          {(recError || txError || tpError) && (
            <div className="animate-fade-in flex items-start gap-2 px-3 py-2 rounded-[8px] bg-pomegranate-400/10 border border-pomegranate-400/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-pomegranate-400 mt-0.5 flex-shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <p className="text-pomegranate-400 text-xs leading-relaxed">{recError || txError || tpError}</p>
            </div>
          )}

          {/* History: Desktop unter Recorder, Mobil ganz unten */}
          <div className="hidden md:block">
            <HistoryList
              entries={historyEntries}
              selectedId={selectedEntry?.id ?? null}
              onSelect={selectEntry}
              currentRawText={txResult?.text ?? null}
              isViewingHistory={isViewingHistory}
              onClear={clearHistory}
            />
          </div>
        </div>

        {/* Right: Results + Export */}
        <div className={`flex flex-col order-1 md:order-2 min-h-0 transition-all duration-300 ${hasResult ? 'md:flex-1' : 'md:w-[380px]'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="label-uppercase text-text-tertiary">
              Ergebnis {isViewingHistory && <span className="ml-2 normal-case tracking-normal text-[10px] font-mono text-ube-800 dark:text-ube-300">· Verlaufseintrag</span>}
            </p>
            {hasResult && (
              <span className="px-2 py-0.5 rounded-full bg-ube-300/40 text-ube-800 dark:text-ube-300 text-[10px] font-clay-ui">
                {displayPromptText ? 'Prompt' : displayCleanedText ? 'Bereinigt' : 'Roh'}
              </span>
            )}
          </div>
          <TranscriptionResult
            rawText={displayRawText}
            cleanedText={displayCleanedText}
            promptText={displayPromptText}
            isProcessing={!isViewingHistory && tpState === 'processing'}
            showCleanTab={!!config.enableCleaning}
            showPromptTab={!!config.enablePrompt}
            isCleanProcessing={!isViewingHistory && cleanState === 'processing'}
            isPromptProcessing={!isViewingHistory && promptState === 'processing'}
            onClean={!isViewingHistory && config.llmProvider ? handleClean : undefined}
            onPrompt={!isViewingHistory && config.llmProvider ? handlePrompt : undefined}
            onCleanedTextChange={!isViewingHistory ? setCleanedText : undefined}
            showLatex={showLatex}
            latexText={latexText}
          />
          <ExportBar
            text={exportText}
            latexText={latexText}
            disabled={!displayRawText}
            showLatex={showLatex}
            onToggleLatex={() => setShowLatex(prev => !prev)}
          />
        </div>

        {/* History: Mobil ganz unten */}
        <div className="md:hidden order-3">
          <HistoryList
            entries={historyEntries}
            selectedId={selectedEntry?.id ?? null}
            onSelect={selectEntry}
            currentRawText={txResult?.text ?? null}
            isViewingHistory={isViewingHistory}
            onClear={clearHistory}
          />
        </div>
      </main>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={config}
        onConfigChange={updateConfig}
      />
    </div>
  )
}
