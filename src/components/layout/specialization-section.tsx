import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SPECIALIZATIONS } from "@/lib/constants"
import { Button } from "@/components/ui/button"

export function SpecializationSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-3">
            What We Do
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-stone-900">
            Our Specialization
          </h3>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SPECIALIZATIONS.map((spec) => (
            <div
              key={spec.title}
              className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={spec.image}
                  alt={spec.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-8 flex flex-col flex-1">
                <h4 className="text-2xl font-bold text-stone-900 mb-4 group-hover:text-primary transition-colors">
                  {spec.title}
                </h4>
                <p className="text-stone-600 mb-8 flex-1 leading-relaxed">
                  {spec.description}
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="w-fit p-0 h-auto font-bold text-stone-900 hover:text-primary hover:bg-transparent group/btn"
                >
                  <Link href={spec.href} className="flex items-center gap-2">
                    Learn More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
