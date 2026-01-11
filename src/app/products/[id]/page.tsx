"use client"

import React, { use } from 'react';
import { FEATURED_PRODUCTS } from '@/lib/constants';
import { ProductMediaGallery } from '@/components/product/product-media-gallery';
import { ProductHeading } from '@/components/product/product-heading';
import { ProductPricing } from '@/components/product/product-pricing';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { ProductAddToCart } from '@/components/product/product-add-to-cart';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/components/ui/use-toast';
import { notFound } from 'next/navigation';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addItem } = useCart();
  const { toast } = useToast();

  const product = FEATURED_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return notFound();
  }

  // Mock data for display
  const media = [
    { url: product.image, alt: product.title },
    { url: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800", alt: "Gallery Image 1" },
    { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", alt: "Gallery Image 2" },
  ];

  const variants: any = [
    {
      id: 'weight',
      name: 'Size',
      type: 'dropdown',
      options: [
        { id: '1kg', value: '1 Kilogram' },
        { id: '5kg', value: '5 Kilograms' },
        { id: '10kg', value: '10 Kilograms' },
      ]
    }
  ];

  const handleAdd = (productId: string, quantity: number) => {
    addItem({
      id: product.id,
      name: product.title,
      price: product.price,
      quantity: quantity,
      image: product.image,
    } as any);

    toast({
      title: "Success",
      description: `Added ${quantity} units of ${product.title} to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb / Back */}
        <Link href="/shop" className="inline-flex items-center text-sm font-bold text-stone-400 hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Media */}
          <div className="space-y-6">
            <ProductMediaGallery media={media} />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <ProductHeading 
                name={product.title} 
                sku={`KN-${product.id}00${product.id}`}
                category={product.category}
              />
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full border-stone-100 shadow-sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-stone-100 shadow-sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="py-6 border-y border-stone-50">
              <ProductPricing 
                basePrice={product.price} 
                ranges={[
                  { min: 1, max: 10, price: product.price },
                  { min: 11, price: product.price * 0.9 }
                ]}
              />
            </div>

            <div className="py-8 space-y-8">
              <ProductVariantSelector 
                variants={variants}
                onSelect={(vid, opt) => console.log('Selected', vid, opt)}
              />

              <div className="pt-4">
                <ProductAddToCart 
                  productId={product.id}
                  stock={15}
                  onAdd={handleAdd}
                />
              </div>
            </div>

            {/* Description / Extra Info */}
            <div className="mt-8 space-y-6">
              <div className="bg-stone-50 p-6 rounded-3xl">
                <h3 className="font-bold text-stone-900 mb-2">Product Overview</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Our {product.title} is a premium {product.category.toLowerCase()} solution meticulously developed at K N Bio Sciences. 
                  Trusted by over 50,000 farmers across India for its consistent results and biological purity.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-stone-100 p-4 rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Form</p>
                  <p className="text-sm font-bold text-stone-900">Granules</p>
                </div>
                <div className="border border-stone-100 p-4 rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Origin</p>
                  <p className="text-sm font-bold text-stone-900">100% Organic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
