"use client"

import { useEffect, useState } from "react"

interface AvatarIconPickerProps {
    value: string
    onSelect?: (icon: string) => void
}

const STOP_WORDS = [
    "agent",
    "bot",
    "system",
    "assistant",
    "manager",
    "expert",
    "ai",
    "the",
    "and",
    "for"
]

const DEFAULT_ICONS = [
    "lucide:sparkles",
    "lucide:user",
    "lucide:briefcase",
    "lucide:zap",
    "lucide:rocket",
]

function getSearchTerms(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") 
        .split(" ")
        .filter((w) => w.length > 2 && !STOP_WORDS.includes(w))
    }

    export default function AvatarIconPicker({ value, onSelect }: AvatarIconPickerProps) {
    const [icons, setIcons] = useState<string[]>(DEFAULT_ICONS)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
    const terms = getSearchTerms(value)

    if (terms.length === 0) {
        setIcons(DEFAULT_ICONS)
        setLoading(false)
        return
    }

    const timeout = setTimeout(async () => {
        setLoading(true)

        try {
        const term = terms[0] 

        const params = new URLSearchParams({
            query: term,
            limit: "64", 
        })

        const res = await fetch(`https://api.iconify.design/search?${params}`)
        const data = await res.json()

        if (Array.isArray(data.icons) && data.icons.length > 0) {
            setIcons(data.icons.slice(0, 5))
        } else {
            const fallbackRes = await fetch(
            `https://api.iconify.design/search?query=${term}&limit=64`
            )
            const fallbackData = await fallbackRes.json()

            setIcons(
            fallbackData.icons?.slice(0, 5) ?? DEFAULT_ICONS
            )
        }
        } catch {
        setIcons(DEFAULT_ICONS)
        } finally {
        setLoading(false)
        }
    }, 500)

    return () => clearTimeout(timeout)
    }, [value])


    return (
        <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
            AI Suggestions
            {loading && (
            <span className="text-xs font-normal text-muted-foreground animate-pulse">
                (Searching...)
            </span>
            )}
        </h2>

        <div className="flex gap-3 flex-wrap">
            {icons.map((icon) => (
            <button
                key={icon}
                type="button"
                onClick={() => onSelect?.(icon)}
                className="group border rounded-lg p-3 bg-white shadow-sm 
                            transition-all hover:bg-blue-900 hover:scale-105 active:scale-95
                            flex items-center justify-center"
                >
                <img
                    src={`https://api.iconify.design/${icon}.svg`}
                    width={24}
                    height={24}
                    alt={icon}
                    className="w-6 h-6 transition-all 
                                invert-0 group-hover:invert"
                />
            </button>
            ))}
            {icons.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">No specific icons found.</p>
            )}
        </div>
        </div>
    )
}