import { useState, useCallback, useMemo } from 'react'
import type { ProcessingMode } from '../providers/text-processing/types'
import { getTextProcessingProvider } from '../providers/text-processing/registry'
import { listTextProcessingProviders } from '../providers/text-processing/registry'

export type TextProcessingState = 'idle' | 'processing' | 'done' | 'error'

export function useTextProcessing() {
  const [cleanState, setCleanState] = useState<TextProcessingState>('idle')
  const [promptState, setPromptState] = useState<TextProcessingState>('idle')
  const [cleanedText, setCleanedText] = useState<string | null>(null)
  const [promptText, setPromptText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const state = useMemo<TextProcessingState>(() => {
    if (cleanState === 'processing' || promptState === 'processing') return 'processing'
    if (cleanState === 'error' || promptState === 'error') return 'error'
    if (cleanState === 'done' || promptState === 'done') return 'done'
    return 'idle'
  }, [cleanState, promptState])

  const process = useCallback(async (
    text: string,
    providerId: string,
    mode: ProcessingMode,
    language: string,
    customSystemPrompt?: string,
  ) => {
    const setModeState = mode === 'clean' ? setCleanState : setPromptState
    const registered = listTextProcessingProviders().map(p => p.id)
    console.log(`[WP:process:${mode}] Looking up provider "${providerId}" | registered:`, registered)

    const provider = getTextProcessingProvider(providerId)
    if (!provider) {
      console.error(`[WP:process:${mode}] Provider not found: "${providerId}"`)
      setError(`Provider "${providerId}" not found`)
      setModeState('error')
      return
    }
    console.log(`[WP:process:${mode}] Starting via ${providerId} | text length: ${text.length}`)
    setModeState('processing')
    setError(null)
    try {
      const result = await provider.process(text, { mode, language, customSystemPrompt })
      console.log(`[WP:process:${mode}] Done | result length: ${result.text.length} | tokens: ${result.tokensUsed}`)
      if (mode === 'clean') {
        setCleanedText(result.text)
      } else {
        setPromptText(result.text)
      }
      setModeState('done')
    } catch (err) {
      console.error(`[WP:process:${mode}] Error:`, err)
      setError(err instanceof Error ? err.message : 'Processing failed')
      setModeState('error')
    }
  }, [])

  const processPromptPipeline = useCallback(async (
    text: string,
    providerId: string,
    language: string,
  ) => {
    const registered = listTextProcessingProviders().map(p => p.id)
    console.log(`[WP:process:prompt-pipeline] Looking up provider "${providerId}" | registered:`, registered)

    const provider = getTextProcessingProvider(providerId)
    if (!provider) {
      console.error(`[WP:process:prompt-pipeline] Provider not found: "${providerId}"`)
      setError(`Provider "${providerId}" not found`)
      setPromptState('error')
      return
    }

    setPromptState('processing')
    setError(null)

    try {
      // Schritt 1: Rohtext → Prompt-Engineering → strukturierter Prompt
      console.log(`[WP:process:prompt-pipeline] Step 1: Generating prompt via ${providerId} | text length: ${text.length}`)
      const promptResult = await provider.process(text, { mode: 'prompt', language })
      console.log(`[WP:process:prompt-pipeline] Step 1 done | prompt length: ${promptResult.text.length} | tokens: ${promptResult.tokensUsed}`)

      // Schritt 2: Generierten Prompt ausführen → Endergebnis
      console.log(`[WP:process:prompt-pipeline] Step 2: Executing generated prompt | length: ${promptResult.text.length}`)
      const executeResult = await provider.process(promptResult.text, { mode: 'execute', language })
      console.log(`[WP:process:prompt-pipeline] Step 2 done | result length: ${executeResult.text.length} | tokens: ${executeResult.tokensUsed}`)

      setPromptText(executeResult.text)
      setPromptState('done')
    } catch (err) {
      console.error(`[WP:process:prompt-pipeline] Error:`, err)
      setError(err instanceof Error ? err.message : 'Processing failed')
      setPromptState('error')
    }
  }, [])

  const reset = useCallback(() => {
    setCleanState('idle')
    setPromptState('idle')
    setCleanedText(null)
    setPromptText(null)
    setError(null)
  }, [])

  return { state, cleanState, promptState, cleanedText, setCleanedText, promptText, error, process, processPromptPipeline, reset }
}
