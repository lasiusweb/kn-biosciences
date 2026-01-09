import Link from 'next/link';
import { Phone, Mail, User, ShoppingCart } from 'lucide-react';

export function TopBar() {
  return (
    <div className="w-full bg-primary text-primary-foreground py-2 px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center text-xs font-medium">
      {/* Contact Info */}
      <div className="flex items-center gap-6 mb-2 md:mb-0">
        <div className="flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer">
          <Phone className="w-3.5 h-3.5" />
          <span>Phone: +91 99999 99999</span>
        </div>
        <div className="flex items-center gap-2 hover:text-white/80 transition-colors cursor-pointer">
          <Mail className="w-3.5 h-3.5" />
          <span>Email: info@kn-biosciences.com</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex items-center gap-6">
        <Link href="/login" className="flex items-center gap-2 hover:text-white/80 transition-colors">
          <User className="w-3.5 h-3.5" />
          <span>Login</span>
        </Link>
        <Link href="/cart" aria-label="cart" className="flex items-center gap-2 hover:text-white/80 transition-colors">
          <div className="relative">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
          </div>
          <span>Cart</span>
        </Link>
      </div>
    </div>
  );
}
