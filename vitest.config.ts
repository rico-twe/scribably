import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['.worktrees/**'],
  },
  poolOptions: {
    forks: {
      singleFork: true,
    },
  },
})
