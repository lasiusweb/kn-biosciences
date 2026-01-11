import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CommonPageLevelErrorMessageProps {
  title?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function CommonPageLevelErrorMessage({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: CommonPageLevelErrorMessageProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 space-y-4", className)}>
      <div className="text-destructive mb-2">
        {icon || <AlertCircle className="w-12 h-12" />}
      </div>
      {title && (
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      )}
      {description && (
        <div className="text-muted-foreground max-w-md">
          {description}
        </div>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
