import * as React from "react"

export function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query) return <>{text}</>

    // Escape regex special characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"))

    return (
        <>
        {parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
            <span
                key={i}
                className="bg-yellow-400/80 text-black font-semibold rounded-[1px]"
            >
                {part}
            </span>
            ) : (
            part
            )
        )}
        </>
    )
}