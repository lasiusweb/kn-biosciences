"use client"

import React, { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface MediaItem {
  url: string;
  alt: string;
  type?: 'image' | 'video';
}

interface ProductMediaGalleryProps {
  media: MediaItem[];
  showThumbnails?: boolean;
  thumbnailPlacement?: 'left' | 'bottom' | 'right';
  imageBorderColor?: string;
  mobileIndicatorColor?: string;
  className?: string;
}

export function ProductMediaGallery({
  media,
  showThumbnails = true,
  thumbnailPlacement = 'bottom',
  imageBorderColor = 'border-stone-200',
  mobileIndicatorColor = 'bg-primary',
  className,
}: ProductMediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-stone-100 rounded-3xl aspect-square", className)}>
        <p className="text-stone-400 font-medium">No images available</p>
      </div>
    );
  }

  const mainMedia = media[activeIndex];

  return (
    <div className={cn("flex flex-col gap-4", 
      thumbnailPlacement === 'left' && "md:flex-row-reverse",
      thumbnailPlacement === 'right' && "md:flex-row",
      className
    )}>
      {/* Main Slider / Display */}
      <div className="flex-1">
        <div className="relative group overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:shadow-md">
           {/* On mobile we use a real carousel, on desktop we might just show the active image for better performance if not many items */}
           <div className="md:hidden">
              <Carousel className="w-full" setApi={(api) => {
                api?.on('select', () => setActiveIndex(api.selectedScrollSnap()))
              }}>
                <CarouselContent className="-ml-0">
                  {media.map((item, index) => (
                    <CarouselItem key={index} className="pl-0 aspect-square relative">
                      <Image
                        src={item.url}
                        alt={item.alt}
                        fill
                        className="object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                   {media.map((_, index) => (
                     <div 
                       key={index} 
                       className={cn("h-1.5 w-1.5 rounded-full transition-all", 
                         index === activeIndex ? mobileIndicatorColor : "bg-white/50"
                       )} 
                     />
                   ))}
                </div>
              </Carousel>
           </div>

           {/* Desktop static display (driven by thumbnails) */}
           <div className="hidden md:block aspect-square relative">
              <Image
                src={mainMedia.url}
                alt={mainMedia.alt}
                fill
                className={cn("object-cover transition-opacity duration-300", imageBorderColor)}
              />
           </div>
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && media.length > 1 && (
        <div className={cn("flex gap-2", 
          thumbnailPlacement === 'bottom' ? "flex-row justify-center" : "flex-col w-24 shrink-0"
        )}>
          {media.map((item, index) => (
            <button
              key={index}
              aria-label={`Thumbnail ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative overflow-hidden rounded-xl border-2 transition-all hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary",
                thumbnailPlacement === 'bottom' ? "w-20 h-20" : "w-full aspect-square",
                index === activeIndex ? "border-primary shadow-sm" : "border-transparent"
              )}
            >
              <Image
                src={item.url}
                alt={item.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
