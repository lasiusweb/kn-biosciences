"use client"

import React, { useState } from 'react';
import { FEATURED_PRODUCTS } from '@/lib/constants';
import { ProductPricing } from '@/components/product/product-pricing';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Filter, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cart-context';
import { CommonToast } from '@/components/common/common-toast';
import { useToast } from '@/components/ui/use-toast';

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem } = useCart();
  const { toast } = useToast();

  const filteredProducts = FEATURED_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuickAdd = (product: any) => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category
    } as any);
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Section */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Our Catalog</h1>
          <p className="text-stone-500 max-w-2xl">
            Explore our range of bio-science solutions, premium seeds, and agricultural tools designed for sustainable growth.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-64 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
              <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input 
                    placeholder="Search products..." 
                    className="pl-9 rounded-full border-stone-100"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {/* Category Placeholders */}
                <div className="space-y-2 pt-4">
                  <p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Categories</p>
                  {['All Products', 'Seeds', 'Bio-Fertilizer', 'Probiotics', 'Equipments'].map(cat => (
                    <button key={cat} className="block text-sm font-medium text-stone-600 hover:text-primary transition-colors">
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-100">
                <p className="text-stone-500">No products found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-100 hover:shadow-xl transition-all duration-300 flex flex-col">
                    <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-stone-100">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                    </Link>

                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">
                        {product.category}
                      </p>
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <h4 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {product.title}
                        </h4>
                      </Link>
                      
                      <div className="mt-4 pt-4 border-t border-stone-50 flex items-center justify-between">
                        <ProductPricing basePrice={product.price} className="scale-90 origin-left" />
                        <Button 
                          size="icon" 
                          onClick={() => handleQuickAdd(product)}
                          className="rounded-full h-10 w-10 shadow-md active:scale-90 transition-all"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
