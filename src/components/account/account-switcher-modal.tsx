"use client"

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: (role: string) => void;
  currentRole?: string;
}

const ROLES = [
  { id: 'farmer', name: 'Farmer', description: 'Standard consumer pricing', icon: User },
  { id: 'dealer', name: 'Dealer', description: 'Bulk discounts and distributor pricing', icon: Briefcase },
  { id: 'white-label', name: 'White Label', description: 'Custom branding and B2B services', icon: Building },
];

export function AccountSwitcherModal({
  isOpen,
  onClose,
  onSwitch,
  currentRole = 'farmer',
}: AccountSwitcherModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Switch Account</DialogTitle>
          <DialogDescription>
            Choose a profile to view tailored pricing and product catalog.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => {
                onSwitch(role.id);
                onClose();
              }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:bg-stone-50 active:scale-[0.98]",
                currentRole === role.id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary" 
                  : "border-stone-100"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                currentRole === role.id ? "bg-primary text-white" : "bg-stone-100 text-stone-500"
              )}>
                <role.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-stone-900">{role.name}</p>
                <p className="text-xs text-stone-500">{role.description}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-center">
           <Button variant="ghost" onClick={onClose} className="text-stone-400">
             Cancel
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
