// components/ui/input-currency.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface InputWithCurrencyProps
  extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
}

export const InputWithCurrency = ({
  value,
  onChange,
  ...props
}: InputWithCurrencyProps) => {
  const [displayValue, setDisplayValue] = useState<string>(value.toString());

  useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numValue = rawValue === "" ? 0 : parseInt(rawValue);
    setDisplayValue(rawValue);
    onChange(numValue);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        ₦
      </span>
      <Input
        {...props}
        value={displayValue}
        onChange={handleChange}
        className="pl-8"
      />
    </div>
  );
};
