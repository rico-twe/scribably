declare module 'escape-latex' {
  function escapeLatex(text: string, options?: { preserveFormatting?: boolean }): string
  export default escapeLatex
}
