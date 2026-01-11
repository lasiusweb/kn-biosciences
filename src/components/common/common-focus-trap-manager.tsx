import React from 'react';
import FocusTrap from 'focus-trap-react';

interface CommonFocusTrapManagerProps {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  onDeactivate?: () => void;
}

export function CommonFocusTrapManager({
  active = true,
  children,
  className,
  onDeactivate,
}: CommonFocusTrapManagerProps) {
  return (
    <FocusTrap active={active} focusTrapOptions={{ onDeactivate, fallbackFocus: 'body' }}>
      <div className={className}>{children}</div>
    </FocusTrap>
  );
}
