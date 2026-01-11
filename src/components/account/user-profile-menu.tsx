"use client"

import React from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfileMenuProps {
  isAuthenticated: boolean;
  userName?: string;
  userEmail?: string;
  className?: string;
  onLogout?: () => void;
}

export function UserProfileMenu({
  isAuthenticated,
  userName,
  userEmail,
  className,
  onLogout,
}: UserProfileMenuProps) {
  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-sm transition-colors",
          className
        )}
      >
        <User className="w-4 h-4" />
        Login
      </Link>
    );
  }

  return (
    <div className={cn("w-full max-w-[280px] bg-white rounded-3xl border border-stone-100 shadow-xl overflow-hidden", className)}>
      {/* Header */}
      <div className="p-6 border-b border-stone-50 bg-stone-50/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="font-bold text-stone-900 truncate">{userName || 'User'}</p>
            <p className="text-[10px] text-stone-400 truncate">{userEmail || 'user@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <nav className="p-2">
        <Link 
          href="/profile" 
          className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-stone-600 group-hover:text-primary">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Profile</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-300" />
        </Link>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-stone-600 group-hover:text-destructive">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </div>
        </button>
      </nav>
    </div>
  );
}
