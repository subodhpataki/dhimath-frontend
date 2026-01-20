"use client";

import * as React from "react";
import { Input } from "@/components/greywiz-ui/input";
import AvatarIconPicker from "@/components/registry/agents/avatar-icon-picker";
import { InitialsIconPicker } from "@/components/registry/agents/initails-icon-picker";
import { ArrowRight, RefreshCcw } from "lucide-react";

type IconSelection = {
    type: "iconify" | "initials";
    value: string;
};

export default function IconPickerPage() {
    const [inputValue, setInputValue] = React.useState("");
    const [previewIcon, setPreviewIcon] = React.useState<IconSelection | null>(null);
    const [confirmedIcon, setConfirmedIcon] = React.useState<IconSelection | null>(null);

    const handleSelectIcon = (icon: string) => {
        setPreviewIcon({ type: "iconify", value: icon });
    };

    const handleSelectInitials = () => {
        if (!inputValue) return;
        setPreviewIcon({ type: "initials", value: inputValue });
    };

    const handleSubmit = () => {
        if (!previewIcon) return;
        setConfirmedIcon(previewIcon);
        setPreviewIcon(null);
    };

    const handleSwap = () => setPreviewIcon(null);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12">
        {/* INPUT */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Icon Seed</label>
            <Input
            placeholder="Type agent name (e.g. Marketing advisor)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-[50%]"
            disabled={!!previewIcon}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* LEFT: PICKERS */}
            <div
            className={`space-y-8 transition-opacity ${
                previewIcon ? "opacity-50 pointer-events-none" : ""
            }`}
            >
            <InitialsIconPicker value={inputValue} onClick={handleSelectInitials} />
            <AvatarIconPicker value={inputValue} onSelect={handleSelectIcon} />
            </div>

            {/* RIGHT: PREVIEW + FIXED (SIDE BY SIDE) */}
            <div className="flex items-start justify-center gap-20">
            {/* LOCATION #1 */}
            <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground tracking-wider">
                Preview
                </span>

                <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center bg-gray-50">
                    {!previewIcon ? (
                    <span className="text-3xl text-gray-300 font-bold">?</span>
                    ) : previewIcon.type === "iconify" ? (
                    <img
                        src={`https://api.iconify.design/${previewIcon.value}.svg`}
                        className="w-8 h-8"
                    />
                    ) : (
                    <div className="scale-150">
                        <InitialsIconPicker value={previewIcon.value} />
                    </div>
                    )}
                </div>

                {previewIcon && (
                    <button
                    onClick={handleSwap}
                    className="absolute -top-2 -right-2 bg-white border shadow-sm rounded-full p-1 hover:bg-gray-100"
                    >
                    <RefreshCcw size={10} />
                    </button>
                )}
                </div>

                <button
                onClick={handleSubmit}
                disabled={!previewIcon}
                className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition ${
                    previewIcon
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                >
                Confirm <ArrowRight size={12} />
                </button>
            </div>

            {/* LOCATION #2 */}
            <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground tracking-wider">
                Fixed
                </span>

                <div className="w-16 h-16 rounded-full border flex items-center justify-center bg-white shadow-inner">
                {!confirmedIcon ? (
                    <span className="text-xs text-gray-400">Empty</span>
                ) : confirmedIcon.type === "iconify" ? (
                    <img
                    src={`https://api.iconify.design/${confirmedIcon.value}.svg`}
                    className="w-8 h-8"
                    />
                ) : (
                    <div className="scale-150">
                    <InitialsIconPicker value={confirmedIcon.value} />
                    </div>
                )}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}
