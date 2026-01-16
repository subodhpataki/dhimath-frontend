"use client"

import { useEffect, useState } from "react"

interface AvatarIconPickerProps {
    value: string
    onChange?: (icon: string) => void
}

const STOP_WORDS = [
    "agent",
    "bot",
    "system",
    "assistant",
    "manager",
    "expert",
    "ai",
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
        .replace(/[^a-z\s]/g, "")
        .split(" ")
        .filter((w) => w.length > 2 && !STOP_WORDS.includes(w))
}

export default function AvatarIconPicker({
    value,
    onChange,
    }: AvatarIconPickerProps) {
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
            // 1. Create a search promise for EACH valid term
            const searchPromises = terms.map((term) => {
            const searchParams = new URLSearchParams({
                query: term, // Search one word at a time
                limit: "5",  // Get top 5 for this specific word
                prefixes: "lucide,fa6-solid,mdi",
            })
            return fetch(`https://api.iconify.design/search?${searchParams}`).then(
                (res) => res.json()
            )
            })

            // 2. Run all searches in parallel
            const results = await Promise.all(searchPromises)

            // 3. Combine and Deduplicate results
            const allIcons = new Set<string>()
            
            results.forEach((data) => {
            if (data.icons) {
                data.icons.forEach((icon: string) => allIcons.add(icon))
            }
            })

            // 4. Convert Set to Array and take the top 5
            const finalIcons = Array.from(allIcons).slice(0, 5)

            if (finalIcons.length > 0) {
            setIcons(finalIcons)
            } else {
            setIcons(DEFAULT_ICONS) // Fallback if absolutely nothing matches
            }
        } catch (error) {
            console.error("Icon fetch failed:", error)
            setIcons(DEFAULT_ICONS)
        } finally {
            setLoading(false)
        }
        }, 500)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div className="space-y-3">
        {loading ? (
            <p className="text-sm text-muted-foreground animate-pulse">
            Searching icons...
            </p>
        ) : (
            <div className="flex gap-3 flex-wrap">
            {icons.length > 0 ? (
                icons.map((icon) => (
                <button
                    key={icon}
                    type="button"
                    onClick={() => onChange?.(icon)}
                    className="border rounded p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    title={icon}
                >
                    <img
                    src={`https://api.iconify.design/${icon}.svg`}
                    width={24}
                    height={24}
                    alt={icon}
                    className="w-6 h-6"
                    />
                </button>
                ))
            ) : (
                <p className="text-sm text-muted-foreground">
                No specific icons found.
                </p>
            )}
            </div>
        )}
        </div>
    )
}