"use client"

import * as React from "react"
import { Search, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
    id: string
    name: string
}

interface SearchableSelectProps {
    options: Option[] | string[]
    value: string
    onChange: (val: string) => void
    placeholder: string
    disabled?: boolean
    icon: any
}

export function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder,
    disabled,
    icon: Icon,
    }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    // Normalize options to ensure they are always objects
    const normalizedOptions = React.useMemo(() => {
        return options.map((opt) =>
        typeof opt === "string" ? { id: opt, name: opt } : opt
        )
    }, [options])

    const filteredOptions = normalizedOptions.filter((opt) =>
        opt.name.toLowerCase().includes(search.toLowerCase())
    )

    // Handle outside clicks
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setIsOpen(false)
        }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selectedLabel = normalizedOptions.find((o) => o.id === value)?.name

    return (
        <div
        className={cn("relative transition-opacity duration-300", disabled && "opacity-50 cursor-not-allowed")}
        ref={wrapperRef}
        >
        <div
            className={cn(
            "flex items-center justify-between w-full px-2 py-1 text-xs border rounded-sm bg-white shadow-sm transition-all hover:border-slate-300",
            isOpen ? "ring-2 ring-blue-100 border-blue-400" : "border-slate-200",
            disabled ? "pointer-events-none bg-slate-50" : "cursor-pointer"
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
        >
            <div className="flex items-center gap-2 overflow-hidden">
            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
            <span className={cn("truncate", !selectedLabel && "text-slate-400")}>
                {selectedLabel || placeholder}
            </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 opacity-50" />
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 border-b">
                <div className="flex items-center px-2 py-1 bg-slate-50 border rounded text-xs">
                <Search className="w-3 h-3 text-slate-400 mr-2" />
                <input
                    autoFocus
                    className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                </div>
            </div>
            <div className="max-h-45 overflow-y-auto p-1">
                {filteredOptions.length === 0 ? (
                <div className="px-2 py-3 text-xs text-center text-slate-400">
                    No results found.
                </div>
                ) : (
                filteredOptions.map((opt) => (
                    <div
                    key={opt.id}
                    className={cn(
                        "px-2 py-1.5 text-xs rounded-sm cursor-pointer flex items-center justify-between group",
                        value === opt.id ? "bg-blue-50 text-blue-700" : "hover:bg-slate-50 text-slate-700"
                    )}
                    onClick={() => {
                        onChange(opt.id)
                        setIsOpen(false)
                        setSearch("")
                    }}
                    >
                    <span>{opt.name}</span>
                    {value === opt.id && <Check className="w-3 h-3" />}
                    </div>
                ))
                )}
            </div>
            </div>
        )}
        </div>
    )
}