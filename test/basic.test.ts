import rehypeParse from 'rehype-parse'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import { expect, it } from 'vitest'
import rehypeTreeSitterHighlight, { RehypeTreeSitterHighlightOptions } from '../src'

const getProcessor = (options: RehypeTreeSitterHighlightOptions = {}) =>
  unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTreeSitterHighlight, options)
    .use(rehypeStringify)

const processor = getProcessor()

const unknown = `<h1>Heading</h1>
<p>Text</p>
<pre>
  <code class="unknown">
    Hello!
  </code>
</pre>
<p>More text</p>`

it('highlights basic javascript', async () => {
  const vfile = await processor.process(`<h1>Heading</h1>
<p>Text</p>
<pre>
  <code class="language-js">
    const hello = "World";
  </code>
</pre>
<p>More text</p>`)

  expect(vfile.toString()).toMatchInlineSnapshot(`
"<h1>Heading</h1>
<p>Text</p>
<pre class=\\"source\\">
    <span class=\\"keyword\\">const</span> <span class=\\"variable\\">hello</span> <span class=\\"operator\\">=</span> <span class=\\"string\\">\\"World\\"</span><span class=\\"punctuation delimiter\\">;</span>
  </pre>
<p>More text</p>"`)
})

it('skips unknown language', async () => {
  const vfile = await processor.process(unknown)

  expect(vfile.toString()).toMatchInlineSnapshot(`
"<h1>Heading</h1>
<p>Text</p>
<pre>  <code class=\\"unknown\\">
    Hello!
  </code>
</pre>
<p>More text</p>"`)
})

it('throws error on unknown', async () => {
  const thisProcessor = getProcessor({ ignoreUnknownLanguage: false })
  let error

  try {
    await thisProcessor.process(unknown)
  } catch (e) {
    error = e
  }

  expect(error).toBeInstanceOf(Error)
  expect((error as Error).message).toContain('unknown language')
})
