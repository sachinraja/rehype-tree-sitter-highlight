# rehype-tree-sitter-highlight

highlight your code using [tree-sitter-highlight](https://github.com/devongovett/tree-sitter-highlight)

## Installation

```sh
npm install rehype-tree-sitter-highlight
```

## Usage

This is a [rehype](https://github.com/rehypejs/rehype) plugin.
To highlight code blocks in html:

````js
import fromHtml from 'rehype-parse'
import toHtml from 'rehype-stringify'
import rehypeTreeSitterHighlight from 'rehype-tree-sitter-highlight'
import { unified } from 'unified'

const doc = "```js\nconst hello = 'World';\n```\n"

async function createProcessor() {
  const processor = unified()
    .use(fromHtml)
    .use(rehypeTreeSitterHighlight)
    .use(toHtml)

  return processor
}

const processor = await createProcessor()
const vfile = await processor.process(doc)
console.log(vfile.toString())
````

## Configuration

### Theme

Refer to the [tree-sitter-highlight docs](https://github.com/devongovett/tree-sitter-highlight#themes) for information on how to theme the output html.

### Supported Languages

Refer to the [tree-sitter-highlight](https://github.com/devongovett/tree-sitter-highlight/blob/054c85b01cb2cd52b819c7f2dbe2c026a3c96d40/src/lib.rs#L8-L14) for supported languages.

### Unknown Languages

Unknown languages are ignored by default. You can set `ignoreUnknownLanguage: false` to throw an error when an unsupported language is encountered.

## Examples

See [examples](https://github.com/sachinraja/rehype-tree-sitter-highlight/tree/main/examples) for ways to use this plugin.

## Inspiration

Much of the docs and code is taken from [rehype-shiki](https://github.com/stefanprobst/rehype-shiki).
