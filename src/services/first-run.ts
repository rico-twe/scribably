import type { AppConfig } from './config-types'

const WIZARD_SKIPPED_KEY = 'scribably-wizard-skipped'

export function isFirstRun(): boolean {
  const skipped = localStorage.getItem(WIZARD_SKIPPED_KEY)
  if (skipped === 'true') return false

  const raw = localStorage.getItem('scribably-config')
  if (!raw) return true

  try {
    const parsed = JSON.parse(raw)
    return parsed.sttProvider === null
  } catch {
    return true
  }
}

export function markWizardSkipped(): void {
  localStorage.setItem(WIZARD_SKIPPED_KEY, 'true')
}

export function markWizardCompleted(): void {
  localStorage.setItem(WIZARD_SKIPPED_KEY, 'true')
}

export function shouldShowWizard(config: AppConfig): boolean {
  const skipped = localStorage.getItem(WIZARD_SKIPPED_KEY)
  if (skipped === 'true') return false
  return config.sttProvider === null
}
