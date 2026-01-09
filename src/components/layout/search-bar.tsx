"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function SearchBar({ className }: { className?: string }) {
  return (
    <div className={cn("relative w-full max-w-sm items-center", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products..."
        className="pl-10 rounded-full border-stone-200 focus:border-primary transition-all bg-stone-50/50"
      />
    </div>
  )
}
