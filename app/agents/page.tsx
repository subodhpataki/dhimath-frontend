"use client";

import * as React from "react";
import { Input } from "@/components/greywiz-ui/input"; // Ensure this path is correct for you
import AvatarIconPicker from "@/components/registry/agents/avatar-icon-picker";
import { InitialsIconPicker } from "@/components/registry/agents/initails-icon-picker";
import { ArrowRight, Check, RefreshCcw, User } from "lucide-react"; // Using Lucide icons for UI controls

type IconSelection = {
    type: "iconify" | "initials";
    value: string; // Contains the icon string OR the name seed
};

export default function IconPickerPage() {
    const [inputValue, setInputValue] = React.useState("");
    
    // Loc #1: The currently selected/previewing icon
    const [previewIcon, setPreviewIcon] = React.useState<IconSelection | null>(null);
    
    // Loc #2: The final confirmed icon
    const [confirmedIcon, setConfirmedIcon] = React.useState<IconSelection | null>(null);

    const handleSelectIcon = (iconString: string) => {
        setPreviewIcon({ type: "iconify", value: iconString });
    };

    const handleSelectInitials = () => {
        // We snapshot the current input value as the seed for the initials
        if (!inputValue) return;
        setPreviewIcon({ type: "initials", value: inputValue });
    };

    const handleSubmit = () => {
        if (previewIcon) {
        setConfirmedIcon(previewIcon);
        setPreviewIcon(null); // Optional: Clear preview after submit? Or keep it?
        // If you want to clear the input after submit, uncomment below:
        // setInputValue("");
        }
    };

    const handleSwap = () => {
        setPreviewIcon(null);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
        {/* 1. INPUT SECTION */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Icon Seed</label>
            <Input
            placeholder="Type name (e.g. Agent Smith)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!!previewIcon} // Disable input if an icon is currently selected (optional UX choice)
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* LEFT COLUMN: Selection Area */}
            <div className="space-y-8">
            <div className={`transition-opacity ${previewIcon ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <h3 className="text-sm font-bold text-muted-foreground tracking-wider mb-4">
                Select an Option
                </h3>
                
                {/* Initials Option */}
                <div className="mb-8">
                <InitialsIconPicker 
                    value={inputValue} 
                    onClick={handleSelectInitials} 
                />
                </div>

                {/* Iconify Option */}
                <AvatarIconPicker 
                value={inputValue} 
                onSelect={handleSelectIcon} 
                />
            </div>
            </div>

            {/* RIGHT COLUMN: Locations #1 and #2 */}
            <div className="space-y-8 flex flex-col items-center justify-start border-l pl-8">
            
            {/* LOCATION #1: PREVIEW & CONFIRM */}
            <div className="space-y-4 w-full flex flex-col items-center">
                <h3 className="text-sm font-bold text-muted-foreground tracking-wider">
                Location #1 (Preview)
                </h3>
                
                <div className="relative group">
                {/* The Circle */}
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                    {!previewIcon ? (
                    // Initial State: Question Mark
                    <span className="text-4xl text-gray-300 font-bold">?</span>
                    ) : (
                    // Selected State
                    <>
                        {previewIcon.type === "iconify" ? (
                        <img
                            src={`https://api.iconify.design/${previewIcon.value}.svg`}
                            alt="selected"
                            className="w-12 h-12"
                        />
                        ) : (
                        // Re-using the component in "display" mode by not passing onClick
                        <div className="transform scale-150">
                            <InitialsIconPicker value={previewIcon.value} />
                        </div>
                        )}
                    </>
                    )}
                </div>

                {/* Swap Button (Only appears when selected) */}
                {previewIcon && (
                    <button
                    onClick={handleSwap}
                    className="absolute -top-2 -right-2 bg-white border shadow-sm rounded-full p-1.5 hover:bg-gray-100 text-xs font-medium flex items-center gap-1"
                    title="Swap / Change"
                    >
                    <RefreshCcw size={14} />
                    </button>
                )}
                </div>

                {/* Submit Button */}
                <button
                onClick={handleSubmit}
                disabled={!previewIcon}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${
                    previewIcon
                    ? "bg-black text-white hover:bg-gray-800 shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                >
                Confirm Selection <ArrowRight size={16} />
                </button>
            </div>

            <div className="w-full h-px bg-gray-200" />

            {/* LOCATION #2: FIXED RESULT */}
            <div className="space-y-4 w-full flex flex-col items-center">
                <h3 className="text-sm font-bold text-muted-foreground tracking-wider">
                Location #2 (Fixed)
                </h3>
                
                <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-inner overflow-hidden">
                {!confirmedIcon ? (
                    <span className="text-sm text-gray-400">Empty</span>
                ) : (
                    <>
                        {confirmedIcon.type === "iconify" ? (
                        <img
                            src={`https://api.iconify.design/${confirmedIcon.value}.svg`}
                            alt="confirmed"
                            className="w-12 h-12"
                        />
                        ) : (
                        <div className="transform scale-150">
                            <InitialsIconPicker value={confirmedIcon.value} />
                        </div>
                        )}
                    </>
                )}
                </div>
            </div>

            </div>
        </div>
        </div>
    );
}