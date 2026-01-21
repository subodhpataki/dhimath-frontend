import { Input } from "@/components/greywiz-ui/input";
import { Label } from "@/components/greywiz-ui/label";

interface DynamicLLMFieldProps {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export default function DynamicLLMField({
  fieldKey,
  value,
  onChange,
  label,
}: DynamicLLMFieldProps) {
  if (fieldKey === "llm_api_key") {
    return (
      <div className="space-y-1">
        <Label htmlFor={fieldKey}>
          {label}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id={fieldKey}
          type="password"
          placeholder="**-***"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  if (fieldKey === "llm_logo_url") {
    return (
      <div className="space-y-1">
        <Label htmlFor={fieldKey}>
          {label}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id={fieldKey}
          placeholder="https://example.com/logo.png"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <Label htmlFor={fieldKey}>
        {label}
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id={fieldKey}
        placeholder={`e.g. ${label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
