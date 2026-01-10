import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Eye } from "lucide-react"

import { FEATURED_PRODUCTS } from "@/lib/constants"
import { Button } from "@/components/ui/button"

export function FeaturedProducts() {
  const products = FEATURED_PRODUCTS.slice(0, 4);

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-3">
            Top Picks
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-stone-900">
            Featured Products
          </h3>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-64 overflow-hidden bg-stone-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Quick Action Overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                  <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-10 w-10">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="icon" className="rounded-full shadow-lg h-10 w-10">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">
                  {product.category}
                </p>
                <Link href={product.href} className="flex-1">
                  <h4 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h4>
                </Link>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                   <p className="text-xl font-bold text-stone-900">
                     ₹{product.price}
                   </p>
                   <Link href={product.href} className="text-xs font-bold text-stone-400 hover:text-primary transition-colors">
                     View Details
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Button asChild variant="outline" className="rounded-full px-8 border-stone-300 hover:bg-stone-900 hover:text-white transition-all">
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
