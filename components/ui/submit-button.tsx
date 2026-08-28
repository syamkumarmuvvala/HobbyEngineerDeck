"use client";

import type { VariantProps } from "class-variance-authority";
import { useFormStatus } from "react-dom";
import { Button, buttonVariants } from "@/components/ui/button";

type SubmitButtonProps = React.ComponentProps<typeof Button> &
  VariantProps<typeof buttonVariants> & {
    pendingLabel?: string;
  };

export function SubmitButton({
  children,
  pendingLabel,
  disabled,
  loading: loadingProp,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const loading = loadingProp ?? pending;

  return (
    <Button type="submit" loading={loading} disabled={disabled || loading} {...props}>
      {loading && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
