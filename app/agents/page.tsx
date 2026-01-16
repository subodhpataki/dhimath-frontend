"use client";

import * as React from "react";
import { Input } from "@/components/greywiz-ui/input";
import AvatarIconPicker from "@/components/registry/agents/avatar-icon-picker";
import { InitialsIconPicker } from "@/components/registry/agents/initails-icon-picker";
import { DicebearStylePicker } from "@/components/registry/agents/dicebear-style-picker";

export default function IconPickerPage() {
    const [inputValue, setInputValue] = React.useState("");

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12">
        {/* Single shared input */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Icon Seed</label>
            <Input
            placeholder="Type once, all icons update…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            />
        </div>

        <AvatarIconPicker value={inputValue} />

        {/* <AvatarIconPicker value={inputValue} /> */}
        <InitialsIconPicker value={inputValue} />

        {/* NEW: DiceBear all styles */}
        <DicebearStylePicker value={inputValue} />
        </div>
    );
}
