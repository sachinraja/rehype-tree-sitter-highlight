/* eslint-disable @typescript-eslint/no-explicit-any */
import { toString } from 'hast-util-to-string'
import treeSitter, { Language } from 'tree-sitter-highlight'
import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

export type RehypeTreeSitterHighlightOptions = {
  /**
   * @default true
   * Ignore languages that tree-sitter-highlight cannot highlight.
   */
  ignoreUnknownLanguage?: boolean
}

const defineOptions = <T extends RehypeTreeSitterHighlightOptions>(options: T) => options

const defaultOptions = defineOptions({
  ignoreUnknownLanguage: true,
})

const langMap = {
  'js': 0,
  'javascript': 0,
  'jsx': 1,
  'ts': 2,
  'typescript': 2,
  'tsx': 3,
  'css': 4,
} as Record<string, Language>

/**
 * @see https://github.com/stefanprobst/rehype-shiki/blob/baf348eb800e8a1d64cba37c6ed586aa69ecfb41/src/index.js
 */
const attacher: Plugin<[] | [RehypeTreeSitterHighlightOptions]> = (options = {}) => {
  const resolvedOptions = { ...defaultOptions, ...options }

  const transformer = (tree: any) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
        return
      }

      const lang = getLanguage(node)

      if (lang === null) {
        if (resolvedOptions.ignoreUnknownLanguage) return node
        else throw new Error(`[rehype-tree-sitter-highlight]: unknown language`)
      }

      const code = treeSitter.highlightHast(toString(node), lang)

      parent.properties = code.properties
      parent.children = code.children
    })
  }

  return transformer
}

const getLanguage = (node: any) => {
  const className: string[] = node.properties.className || []

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === 'language-') {
      const classNameLanguage = classListItem.slice(9).toLowerCase()

      const matchedLanguage = langMap[classNameLanguage]

      if (matchedLanguage !== undefined) return matchedLanguage
    }
  }

  return null
}

export default attacher
