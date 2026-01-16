"use client"

import * as React from "react"
import CreateOrgAdmin from "@/components/registry/greywiz-admin/create-org-admin"
import LicenseGenerator from "@/components/registry/greywiz-admin/license-generator"
import LimitsConfig from "@/components/registry/greywiz-admin/limits-config"
import OrgDetails from "@/components/registry/greywiz-admin/org-details"

export default function GryAdminPage() {
  const [createdOrg, setCreatedOrg] =
    React.useState<{ id: string | number; name: string } | null>(null)

  const [orgResetKey, setOrgResetKey] = React.useState(0)

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-semibold">Greywiz Admin</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Step 1: Create Org */}
        <OrgDetails
          key={orgResetKey}
          onOrgCreated={(id, name) => setCreatedOrg({ id, name })}
        />

        {/* Step 2: Configure Limits */}
        <LimitsConfig
          orgData={createdOrg}
          onLimitsSaved={() => {
            setCreatedOrg(null)         
            setOrgResetKey(prev => prev + 1) 
          }}
        />
      </div>

      <div className="flex gap-4 justify-end mt-4">
        <CreateOrgAdmin />
        <LicenseGenerator />
      </div>
    </div>
  )
}
