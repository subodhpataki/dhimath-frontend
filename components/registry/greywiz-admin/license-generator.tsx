import { Button } from "@/components/greywiz-ui/button"
import { BadgePlus, UserPlus } from "lucide-react"

export default function LicenseGenerator() {
  return (
    <Button>
      Create License File
      <BadgePlus className="ml-1 h-4 w-4" />
    </Button>
  );
}
