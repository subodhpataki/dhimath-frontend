
import { Button } from "@/components/greywiz-ui/button"
import { UserPlus } from "lucide-react"

export default function CreateOrgAdmin() {
  return (
    <Button variant="outline">
      Create Org Admin
      <UserPlus className="ml-1 h-4 w-4" />
    </Button>
  );
}
