"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { HERO_SLIDES } from "@/lib/constants"

export function HeroSlider() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <section className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0">
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 relative h-[400px] md:h-[600px] w-full">
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-stone-900/40" />
              </div>
              
              <div className="relative z-10 h-full flex items-center justify-center px-4 md:px-8 lg:px-16">
                <div className="max-w-3xl text-center text-white space-y-4 md:space-y-6">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-stone-100 max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                  <div className="flex justify-center pt-4">
                    <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg font-bold">
                      <Link href={slide.href}>
                        {slide.cta}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
            <CarouselPrevious className="left-8 bg-white/20 border-white/40 text-white hover:bg-white/40" />
            <CarouselNext className="right-8 bg-white/20 border-white/40 text-white hover:bg-white/40" />
        </div>
      </Carousel>
    </section>
  )
}
