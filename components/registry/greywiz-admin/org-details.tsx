"use client"

import * as React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/greywiz-ui/card"
import { Label } from "@/components/greywiz-ui/label"
import { Input } from "@/components/greywiz-ui/input"
import { Button } from "@/components/greywiz-ui/button"
import { NotebookText, Image as ImageIcon, X, RotateCcw, Save } from "lucide-react"
import { createOrg } from "@/lib/services/api"
import { showToast } from "@/lib/toast"

const MAX_LOGO_SIZE_MB = 2
const MAX_BANNER_SIZE_MB = 5

interface OrgDetailsProps {
  // Callback to parent with the new ID and Name
  onOrgCreated: (id: string | number, name: string) => void
}

export default function OrgDetails({ onOrgCreated }: OrgDetailsProps) {
  const [orgName, setOrgName] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  const [logoPreview, setLogoPreview] = React.useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = React.useState<string | null>(null)
  const [logoFile, setLogoFile] = React.useState<File | null>(null)
  const [bannerFile, setBannerFile] = React.useState<File | null>(null)
  const logoInputRef = React.useRef<HTMLInputElement>(null)
  const bannerInputRef = React.useRef<HTMLInputElement>(null)
  
  const isOrgNameValid = orgName.trim().length > 0
  const isLogoValid = !!logoFile
  const isFormValid = isOrgNameValid && isLogoValid

  const resetForm = () => {
    setOrgName("")
    clearLogo()
    clearBanner()
  }

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    maxSizeMB: number,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      alert(`File size should not exceed ${maxSizeMB}MB`)
      e.target.value = ""
      return
    }

    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("org_name", orgName)
      // Hardcoded User ID for creation payload
      formData.append("org_user_id", "1") 
      formData.append("org_user_name", "Prasanna Chandran")

      if (logoFile) {
        formData.append("org_logo", logoFile)
        formData.append("org_logo_filename", logoFile.name)
      }

      if (bannerFile) {
        formData.append("org_banner", bannerFile)
        formData.append("org_banner_filename", bannerFile.name)
      }

      // 1. Call API
      await createOrg(formData)

      // 2. HARDCODE ID to 1 as requested
      const newOrgId = 1 

      showToast("success", "Organization created successfully!")
      
      // 3. Pass Hardcoded ID and Name to parent to unlock LimitsConfig
      onOrgCreated(newOrgId, orgName)

    } catch (error: any) {
      console.error(error)
      showToast("error", "Failed to create organization!")
    } finally {
      setLoading(false)
    }
  }

  const clearLogo = () => {
    setLogoPreview(null)
    setLogoFile(null)
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  const clearBanner = () => {
    setBannerPreview(null)
    setBannerFile(null)
    if (bannerInputRef.current) bannerInputRef.current.value = ""
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex items-center gap-2">
        <NotebookText className="w-4 h-4" />
        <CardTitle>Organization Details</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1 overflow-hidden">
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="space-y-1">
            <Label className="text-gray-700 gap-1">Org Name<span className="text-red-500">*</span></Label>
            <Input
              placeholder="Enter organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 gap-1">Org Logo<span className="text-red-500">*</span></Label>
                <Button variant="ghost" size="icon" onClick={clearLogo} className={`h-6 w-6 ${logoPreview ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input ref={logoInputRef} type="file" accept="image/png,image/jpeg" onChange={(e) => handleImageUpload(e, MAX_LOGO_SIZE_MB, setLogoPreview, setLogoFile)} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700">Org Banner</Label>
                <Button variant="ghost" size="icon" onClick={clearBanner} className={`h-6 w-6 ${bannerPreview ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input ref={bannerInputRef} type="file" accept="image/png,image/jpeg" onChange={(e) => handleImageUpload(e, MAX_BANNER_SIZE_MB, setBannerPreview, setBannerFile)} />
            </div>
          </div>
        </div>

        <Label className="text-gray-700">Preview</Label>
        <div className="border rounded-lg overflow-hidden bg-muted h-30">
          <div className="h-6 w-full bg-gray-200 overflow-hidden">
            {bannerPreview && <img src={bannerPreview} alt="Banner" className="h-full w-full object-cover" />}
          </div>
          <div className="flex items-center gap-3 px-4 h-23.5">
            <div className="h-16 w-16 rounded-md border bg-white flex items-center justify-center overflow-hidden shrink-0">
              {logoPreview ? <img src={logoPreview} alt="Logo" className="h-full w-full object-contain" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="flex flex-col justify-center overflow-hidden">
              <p className="text-sm font-medium truncate">{orgName || "Organization Name"}</p>
              <p className="text-xs text-muted-foreground">Organization</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-auto border-t">
          <Button variant="outline" className="flex items-center gap-2" onClick={resetForm}>
            Reset <RotateCcw className="h-4 w-4" />
          </Button>
          <Button className="flex items-center gap-2" onClick={handleSaveChanges} disabled={loading || !isFormValid}>
            {loading ? "Saving..." : "Create Org"} <Save className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}