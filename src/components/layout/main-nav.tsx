"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { NAV_LINKS } from "@/lib/constants"
import { SearchBar } from "./search-bar"

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 md:px-8 lg:px-16 flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl overflow-hidden">
             <span className="relative z-10">KN</span>
             <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-bold leading-none tracking-tight text-stone-900">K N BIO</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Sciences</span>
          </div>
          {/* Placeholder for real img */}
          <span className="sr-only">Brand Logo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center px-8">
          <NavigationMenu>
            <NavigationMenuList>
              {NAV_LINKS.map((link) => (
                <NavigationMenuItem key={link.title}>
                  {link.megamenu ? (
                    <>
                      <NavigationMenuTrigger>{link.title}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[600px] gap-3 p-6 md:grid-cols-2 lg:grid-cols-3">
                          {link.megamenu.map((section) => (
                            <li key={section.title} className="space-y-3">
                              <h4 className="text-sm font-bold leading-none text-primary uppercase tracking-wider">{section.title}</h4>
                              <ul className="space-y-2">
                                {section.items.map((item) => (
                                  <li key={item.title}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={item.href}
                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                                      >
                                        <div className="text-xs font-medium leading-none">{item.title}</div>
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {link.title}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
           <SearchBar className="hidden xl:flex" />
           
           {/* Mobile Menu */}
           <div className="lg:hidden">
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-stone-600">
                   <Menu className="h-6 w-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                 <SheetHeader>
                   <SheetTitle className="text-left text-primary font-bold">Menu</SheetTitle>
                 </SheetHeader>
                 <nav className="flex flex-col gap-4 mt-8">
                   {NAV_LINKS.map((link) => (
                     <div key={link.title} className="space-y-3">
                        <Link href={link.href} className="text-lg font-semibold text-stone-900 hover:text-primary transition-colors">
                          {link.title}
                        </Link>
                        {link.megamenu && (
                          <div className="pl-4 border-l border-stone-100 space-y-4">
                            {link.megamenu.map(section => (
                              <div key={section.title} className="space-y-2">
                                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{section.title}</p>
                                <div className="flex flex-col gap-2">
                                  {section.items.map(item => (
                                    <Link key={item.title} href={item.href} className="text-sm text-stone-600 hover:text-primary">
                                      {item.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                     </div>
                   ))}
                 </nav>
               </SheetContent>
             </Sheet>
           </div>
        </div>
      </div>
    </header>
  )
}
