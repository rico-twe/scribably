interface UmamiTracker {
  track(): void
  track(eventName: string): void
  track(eventName: string, data: Record<string, string | number | boolean>): void
  track(payload: Record<string, unknown>): void
  track(fn: (props: Record<string, unknown>) => Record<string, unknown>): void
  identify(sessionData: Record<string, unknown>): void
}

interface Window {
  umami?: UmamiTracker
}
