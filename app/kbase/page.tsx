"use client"

import * as React from "react"
import AutoLearnKB from "@/components/registry/kbase/kbase"

export default function KBasePage() {
    return (
        <div className="space-y-4">
        <h1 className="text-lg font-semibold">Knowledge Base</h1>
        <AutoLearnKB />
        </div>
    )
}