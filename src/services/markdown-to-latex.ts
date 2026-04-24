import { Lexer, type Token, type Tokens } from 'marked'

const SPECIAL_CHARS = /([&%$#_{}])/g
const TILDE = /~/g
const CARET = /\^/g
const BACKSLASH = /\\/g

function escapeLatex(text: string): string {
  return text
    .replace(BACKSLASH, '\\textbackslash{}')
    .replace(SPECIAL_CHARS, '\\$1')
    .replace(TILDE, '\\textasciitilde{}')
    .replace(CARET, '\\textasciicircum{}')
}

function processInlineText(raw: string): string {
  // Split on inline code/bold/italic boundaries, escape only plain text
  const parts: string[] = []
  const remaining = raw

  const inlinePattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = inlinePattern.exec(remaining)) !== null) {
    // Escape text before the match
    if (match.index > lastIndex) {
      parts.push(escapeLatex(remaining.slice(lastIndex, match.index)))
    }

    const full = match[0]
    if (full.startsWith('**')) {
      parts.push(`\\textbf{${escapeLatex(match[2])}}`)
    } else if (full.startsWith('*')) {
      parts.push(`\\textit{${escapeLatex(match[3])}}`)
    } else if (full.startsWith('`')) {
      parts.push(`\\texttt{${escapeLatex(match[4])}}`)
    } else if (full.startsWith('[')) {
      parts.push(`\\href{${match[6]}}{${escapeLatex(match[5])}}`)
    }

    lastIndex = match.index + full.length
  }

  if (lastIndex < remaining.length) {
    parts.push(escapeLatex(remaining.slice(lastIndex)))
  }

  return parts.join('')
}

function tokensToLatex(tokens: Token[]): string {
  const lines: string[] = []

  for (const token of tokens) {
    switch (token.type) {
      case 'heading': {
        const t = token as Tokens.Heading
        const text = processInlineText(t.text)
        const commands = ['\\section', '\\subsection', '\\subsubsection', '\\paragraph', '\\subparagraph', '\\subparagraph']
        const cmd = commands[Math.min(t.depth - 1, commands.length - 1)]
        lines.push(`${cmd}{${text}}`)
        lines.push('')
        break
      }

      case 'paragraph': {
        const t = token as Tokens.Paragraph
        lines.push(processInlineText(t.text))
        lines.push('')
        break
      }

      case 'code': {
        const t = token as Tokens.Code
        if (t.lang) {
          lines.push(`\\begin{verbatim}`)
        } else {
          lines.push('\\begin{verbatim}')
        }
        lines.push(t.text)
        lines.push('\\end{verbatim}')
        lines.push('')
        break
      }

      case 'blockquote': {
        const t = token as Tokens.Blockquote
        lines.push('\\begin{quote}')
        if (t.tokens) {
          lines.push(tokensToLatex(t.tokens).trim())
        } else {
          lines.push(processInlineText(t.text))
        }
        lines.push('\\end{quote}')
        lines.push('')
        break
      }

      case 'list': {
        const t = token as Tokens.List
        const env = t.ordered ? 'enumerate' : 'itemize'
        lines.push(`\\begin{${env}}`)
        for (const item of t.items) {
          const itemText = item.tokens
            ? tokensToLatex(item.tokens).trim()
            : processInlineText(item.text)
          lines.push(`  \\item ${itemText}`)
        }
        lines.push(`\\end{${env}}`)
        lines.push('')
        break
      }

      case 'hr': {
        lines.push('\\noindent\\rule{\\textwidth}{0.4pt}')
        lines.push('')
        break
      }

      case 'space': {
        lines.push('')
        break
      }

      case 'html': {
        // Skip HTML tokens
        break
      }

      default: {
        // Fallback: try to render raw text
        if ('text' in token && typeof token.text === 'string') {
          lines.push(processInlineText(token.text))
          lines.push('')
        }
        break
      }
    }
  }

  return lines.join('\n')
}

export function markdownToLatex(markdown: string): string {
  const lexer = new Lexer()
  const tokens = lexer.lex(markdown)
  const body = tokensToLatex(tokens).trim()

  return `\\documentclass[a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{hyperref}

\\begin{document}

${body}

\\end{document}
`
}
