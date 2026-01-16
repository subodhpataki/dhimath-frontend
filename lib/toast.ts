import { toast } from "@/components/greywiz-ui/sonner"

type ToastType = "success" | "error" | "warning"

const TOAST_STYLES: Record<
  ToastType,
  {
    toast: string
    title: string
    description: string
  }
> = {
  success: {
    toast: "bg-[#ECFDF3]",
    title: "text-[#018B2F]",
    description: "text-[#018B2F]/80",
  },
  error: {
    toast: "bg-[#FFF0F0]",
    title: "text-[#E70A0A]",
    description: "text-[#E70A0A]/80",
  },
  warning: {
    toast: "bg-[#FFFBEB]",
    title: "text-[#B45309]",
    description: "text-[#B45309]/80",
  },
}

export const showToast = (
  type: ToastType,
  message: string,
  description?: string
) => {
  const styles =
    type === "success"
      ? {
          "--normal-bg": "#ECFDF3",
          "--normal-text": "#018B2F",
          "--normal-border": "#018B2F33",
        }
      : type === "error"
      ? {
          "--normal-bg": "#FFF0F0",
          "--normal-text": "#E70A0A",
          "--normal-border": "#E70A0A33",
        }
      : {
          "--normal-bg": "#FFFBEB",
          "--normal-text": "#B45309",
          "--normal-border": "#B4530933",
        }

  toast[type](message, {
    description,
    style: styles as React.CSSProperties,
  })
}

