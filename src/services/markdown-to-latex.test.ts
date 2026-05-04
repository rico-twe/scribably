import { markdownToLatex } from './markdown-to-latex'

function extractBody(latex: string): string {
  const match = latex.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/)
  return match ? match[1].trim() : latex
}

describe('markdownToLatex – LaTeX escaping', () => {
  it('escapes ampersand', () => {
    expect(extractBody(markdownToLatex('a & b'))).toBe('a \\& b')
  })

  it('escapes percent', () => {
    expect(extractBody(markdownToLatex('50% done'))).toBe('50\\% done')
  })

  it('escapes dollar sign', () => {
    expect(extractBody(markdownToLatex('costs $5'))).toBe('costs \\$5')
  })

  it('escapes hash', () => {
    expect(extractBody(markdownToLatex('issue #1'))).toBe('issue \\#1')
  })

  it('escapes underscore', () => {
    expect(extractBody(markdownToLatex('foo_bar'))).toBe('foo\\_bar')
  })

  it('escapes curly braces', () => {
    expect(extractBody(markdownToLatex('{value}'))).toBe('\\{value\\}')
  })

  it('escapes tilde', () => {
    expect(extractBody(markdownToLatex('hello~world'))).toBe('hello\\textasciitilde{}world')
  })

  it('escapes caret', () => {
    expect(extractBody(markdownToLatex('x^2'))).toBe('x\\textasciicircum{}2')
  })

  it('escapes backslash', () => {
    expect(extractBody(markdownToLatex('a\\b'))).toBe('a\\textbackslash{}b')
  })

  it('leaves plain text untouched', () => {
    expect(extractBody(markdownToLatex('Hello World'))).toBe('Hello World')
  })

  it('escapes special chars inside headings', () => {
    const result = markdownToLatex('# Price: $100 & more')
    expect(result).toContain('\\section{Price: \\$100 \\& more}')
  })

  it('escapes special chars inside bold text', () => {
    const result = markdownToLatex('**50% off**')
    expect(result).toContain('\\textbf{50\\% off}')
  })
})
