// deno-lint-ignore no-explicit-any
declare const CSS: { highlights: any }

function* walk(walker: TreeWalker) {
    while (walker.nextNode()) {
        yield walker.currentNode
    }
}

const style =
(content: string) => {
    const el = document.createElement("style")

    el.textContent = content

    document.head.appendChild(el)
    return el
}

export const parse =
(el: HTMLElement) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)

    const ranges = walk(walker).flatMap(el => el.textContent!
        .matchAll(/[AEIOUaeiou]+/g)
        .map(({ index, [0]: str }) => {
            const range = new Range()
            range.setStart(el, index)
            range.setEnd(el, index + str.length)
            return range
        })
    )

    const highlight = new Highlight(...ranges)
    CSS.highlights.set("hi1", highlight)

    style(`::highlight(hi1) { color: red; }`)
}
