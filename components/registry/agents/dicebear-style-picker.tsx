"use client";

import * as React from "react";

interface DicebearStylePickerProps {
    value?: string;
}

const STYLES = [
    { key: "identicon", label: "Identicon" },
];

export const DicebearStylePicker: React.FC<DicebearStylePickerProps> = ({
    value,
    }) => {
    const seed = value || "default";

    return (
        <div className="space-y-3">
        <h2 className="text-lg font-semibold">DiceBear Styles Preview</h2>

        <div className="flex">
            {STYLES.map((style) => {
            const url =
                style.key === "identicon"
                ? `https://api.dicebear.com/9.x/${style.key}/svg?seed=${encodeURIComponent(
                    seed
                    )}&rotate=0`
                : `https://api.dicebear.com/9.x/${style.key}/svg?seed=${encodeURIComponent(
                    seed
                    )}`;

            return (
                <div
                key={style.key}
                className="flex flex-col items-center gap-2"
                >
                <div className="w-16 h-16 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                    <img
                    src={url}
                    alt={style.label}
                    className="w-full h-full"
                    />
                </div>
                <span className="text-xs text-muted-foreground">
                    {style.label}
                </span>
                </div>
            );
            })}
        </div>
        </div>
    );
};
