"use client"

import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/greywiz-ui/card"
import { Label } from "@/components/greywiz-ui/label"
import { Input } from "@/components/greywiz-ui/input"
import { Bolt, RotateCcw, Save } from 'lucide-react'
import { Button } from "@/components/greywiz-ui/button"
import { showToast } from "@/lib/toast"
import { setOrgLimits } from "@/lib/services/api"

interface LimitsConfigProps {
  orgData: { id: string | number; name: string } | null
  onLimitsSaved: () => void
}

export default function LimitsConfig({ orgData, onLimitsSaved }: LimitsConfigProps) {
  const initialState = {
    maxUsers: 0,
    maxAgents: 0,
    maxProjects: 0,
    maxDocsProjects: 0,
    maxDocsChat: 0,
    maxRoles: 0,
    maxLLM: 0,
    chatLimit: 0,
  }

  const [limits, setLimits] = React.useState(initialState)
  const [loading, setLoading] = React.useState(false)

  const resetLimits = () => {
    setLimits(initialState)
  }

const handleSaveChanges = async () => {
  if (!orgData?.id) {
    showToast("error", "Organization not created yet!")
    return
  }

  try {
    setLoading(true)

    const formData = new FormData()

    formData.append("org_id", String(orgData.id))
    formData.append("org_name", orgData.name)
    formData.append("org_user_id", "1")

    formData.append("max_users", String(limits.maxUsers))
    formData.append("max_agents", String(limits.maxAgents))
    formData.append("max_projects", String(limits.maxProjects))
    formData.append("max_docs_in_projects", String(limits.maxDocsProjects))
    formData.append("max_docs_in_chat", String(limits.maxDocsChat))
    formData.append("max_number_of_roles", String(limits.maxRoles))
    formData.append("max_number_of_llm", String(limits.maxLLM))
    formData.append("chat_conversation_limit", String(limits.chatLimit))
    formData.append("max_user_device_logins", "0")

    await setOrgLimits(formData)

    showToast("success", "Configuration limits set successfully!")
    setLimits(initialState)
    onLimitsSaved()
  } catch (error) {
    showToast("error", "Failed to set configuration limits!")
  } finally {
    setLoading(false)
  }
}


  // Visual state to indicate this form is disabled until org is created
  const isEnabled = !!orgData

  return (
    <Card className={`lg:col-span-2 flex flex-col transition-opacity duration-200 ${isEnabled ? 'opacity-100' : 'opacity-50 grayscale'}`}>
      <CardHeader className="flex items-center gap-2 h-5">
        <Bolt className="w-4 h-4" />
        <CardTitle>
          Configuration Limits 
          {!isEnabled && <span className="ml-2 text-xs font-normal text-muted-foreground">(Create Org first)</span>}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 relative">
        {/* Blocking overlay if disabled */}
        {!isEnabled && <div className="absolute inset-0 z-10 bg-transparent cursor-not-allowed" />}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ValueField
            label="Max Users"
            value={limits.maxUsers}
            onChange={(v) => setLimits({ ...limits, maxUsers: v })}
          />
          <ValueField
            label="Max Agents"
            value={limits.maxAgents}
            onChange={(v) => setLimits({ ...limits, maxAgents: v })}
          />
          <ValueField
            label="Max Projects"
            value={limits.maxProjects}
            onChange={(v) => setLimits({ ...limits, maxProjects: v })}
          />
          <ValueField
            label="Max Docs In Projects"
            value={limits.maxDocsProjects}
            onChange={(v) => setLimits({ ...limits, maxDocsProjects: v })}
          />
          <ValueField
            label="Max Docs In Chat"
            value={limits.maxDocsChat}
            onChange={(v) => setLimits({ ...limits, maxDocsChat: v })}
          />
          <ValueField
            label="Max Number Of Roles"
            value={limits.maxRoles}
            onChange={(v) => setLimits({ ...limits, maxRoles: v })}
          />
          <ValueField
            label="Max LLM"
            value={limits.maxLLM}
            onChange={(v) => setLimits({ ...limits, maxLLM: v })}
          />
          <ValueField
            label="Chat Limit"
            value={limits.chatLimit}
            onChange={(v) => setLimits({ ...limits, chatLimit: v })}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-auto border-t">
          <Button
            variant="outline"
            className="hover:cursor-pointer flex items-center gap-2"
            onClick={resetLimits}
            disabled={!isEnabled}
          >
            Reset
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button 
            className="hover:cursor-pointer flex items-center gap-2"
            onClick={handleSaveChanges}
            disabled={loading || !isEnabled}
          >
            {loading ? "Saving..." : "Save Limits"}
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function ValueField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (val: number) => void
}) {
  return (
    <div className="space-y-1">
      <Label className="text-gray-700">{label}</Label>

      <Input
        type="number"
        min="0" // HTML constraint
        value={value === 0 ? "" : value}
        placeholder="0"
        onFocus={(e) => {
          const input = e.target as HTMLInputElement
          if (input.value === "") return
          input.select()
        }}
        onChange={(e) => {
          const val = e.target.value
          
          if (val === "") {
            onChange(0)
            return
          }

          const numVal = Number(val)
          
          // Logic constraint: No negative numbers
          if (numVal < 0) {
            return 
          }
          
          onChange(numVal)
        }}
        // Prevent typing minus sign specifically
        onKeyDown={(e) => {
            if(e.key === '-' || e.key === 'e') {
                e.preventDefault();
            }
        }}
      />
    </div>
  )
}