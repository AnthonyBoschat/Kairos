import s from "./styles.module.scss"

interface HighlightProps {
    text: string
    search: string
    contextWordsBefore?: number
}

export default function Highlight({ text, search, contextWordsBefore = 2 }: HighlightProps) {
    const trimmedSearch = search.trim()
    if (!trimmedSearch) return <>{text}</>

    const lowerText = text.toLowerCase()
    const lowerSearch = trimmedSearch.toLowerCase()

    const matchStartIndex = lowerText.indexOf(lowerSearch)
    if (matchStartIndex === -1) return <>{text}</>

    const matchEndIndex = matchStartIndex + trimmedSearch.length

    const wordRegex = /\S+/g
    const wordRanges: { start: number; end: number }[] = []
    let match: RegExpExecArray | null

    while ((match = wordRegex.exec(text)) !== null) {
        wordRanges.push({ start: match.index, end: match.index + match[0].length })
    }

    const matchWordIndex = wordRanges.findIndex(
        (range) => matchStartIndex >= range.start && matchStartIndex < range.end,
    )
    if (matchWordIndex === -1) return <>{text}</>

    const startWordIndex = Math.max(0, matchWordIndex - contextWordsBefore)
    const snippetStartIndex = wordRanges[startWordIndex].start

    const hasMoreBefore = startWordIndex > 0

    const beforeMatch = text.slice(snippetStartIndex, matchStartIndex)
    const matchedText = text.slice(matchStartIndex, matchEndIndex)
    const afterMatch = text.slice(matchEndIndex)

    return (
        <>
            {hasMoreBefore && "... "}
            {beforeMatch}
            <mark className={s.mark}>{matchedText}</mark>
            {afterMatch}
        </>
    )
}
