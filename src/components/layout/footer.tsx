"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { NAV_LINKS } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="px-4 md:px-8 lg:px-16 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                 <span className="relative z-10">KN</span>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none tracking-tight text-white">K N BIO</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Sciences</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
              Pioneering bio-science solutions for sustainable agriculture since 1997. 
              Empowering farmers with innovation, biological inputs, and technical expertise.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4">
              {NAV_LINKS.map(link => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Segments */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Segments</h4>
            <ul className="space-y-4">
              <li><Link href="/segments/crop-farmers" className="text-sm hover:text-primary transition-colors">Crop Farmers</Link></li>
              <li><Link href="/segments/pond-champions" className="text-sm hover:text-primary transition-colors">Pond Champions</Link></li>
              <li><Link href="/segments/poultry-pro" className="text-sm hover:text-primary transition-colors">Poultry Pro</Link></li>
              <li><Link href="/segments/organic-newbees" className="text-sm hover:text-primary transition-colors">Organic Newbees</Link></li>
              <li><Link href="/segments/home-gardeners" className="text-sm hover:text-primary transition-colors">Home Gardeners</Link></li>
            </ul>
          </div>

          {/* Contact & Address */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Company</h4>
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="text-sm leading-relaxed text-stone-400">
                  <span className="text-white block font-medium mb-1 uppercase text-xs tracking-widest">Head Office</span>
                  KN Bio Sciences Tower, 
                  Plot No. 4, Madhapur, 
                  Hyderabad, Telangana - 500081.
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <span className="hover:text-primary transition-colors cursor-pointer">+91 99999 99999</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span className="hover:text-primary transition-colors cursor-pointer">info@knbiosciences.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-stone-500">
          <p>© 2026 K N Bio Sciences Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
