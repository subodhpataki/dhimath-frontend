"use client";

import * as React from "react";

interface InitialsIconPickerProps {
    value?: string;
    onClick?: () => void; 
}

export const InitialsIconPicker: React.FC<InitialsIconPickerProps> = ({
    value,
    onClick,
    }) => {
    const initials = React.useMemo(() => getInitialsFromName(value), [value]);
    const bgColor = React.useMemo(
    () => (initials ? getPastelColor(initials) : "#e5e7eb"),
    [initials]
    );

    return (
    <div className="space-y-3">
        {/* Only show Title if we are in 'Picker' mode (implied by presence of onClick) */}
        {onClick && <h2 className="text-lg font-semibold">Initials</h2>}

        <div
        onClick={onClick}
        role={onClick ? "button" : "presentation"}
        className={`
            w-12 h-12 rounded-full
            flex items-center justify-center
            border text-lg font-semibold
            select-none shadow-sm
            transition-transform
            ${onClick ? "cursor-pointer hover:scale-110 active:scale-95 hover:ring-2 hover:ring-offset-2 hover:ring-black" : ""}
        `}
        style={{
            backgroundColor: bgColor,
            color: "#ffffff",
            letterSpacing: "0.04em",
        }}
        >
        {initials || "?"}
        </div>
    </div>
    );
};

function getInitialsFromName(name?: string) {
    if (!name) return "";

    const words = name
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w && w !== "agent");

    if (words.length === 0) return "";

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
}

function getPastelColor(seed: string) {
    let hash = 0;

    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash & 0xff) + 127;
    const g = ((hash >> 8) & 0xff) + 127;
    const b = ((hash >> 16) & 0xff) + 127;

    return `rgb(${r % 255}, ${g % 255}, ${b % 255})`;
}