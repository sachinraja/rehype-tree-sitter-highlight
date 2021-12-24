import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import rehypeTreeSitterHighlight from '../../src'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const basicMd = await fs.readFile(path.join(__dirname, 'index.md'), 'utf8')
const templateHtml = await fs.readFile(path.join(__dirname, 'template.html'), 'utf8')

const vfile = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeTreeSitterHighlight)
  .use(rehypeStringify)
  .process(basicMd)

const outHtml = templateHtml.replace('{{ md }}', vfile.toString())
await fs.writeFile(path.join(__dirname, 'out.html'), outHtml, 'utf8')
