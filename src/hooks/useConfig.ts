import { useState, useCallback } from 'react'
import { loadConfig, saveConfig } from '../services/config'
import type { AppConfig } from '../services/config-types'

export function useConfig() {
  const [config, setConfig] = useState<AppConfig>(loadConfig)

  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setConfig(prev => {
      const next = { ...prev, ...updates }
      saveConfig(next)
      return next
    })
  }, [])

  return { config, updateConfig }
}
