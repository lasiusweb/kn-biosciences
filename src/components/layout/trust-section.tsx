import Image from "next/image"
import { Quote } from "lucide-react"

import { TESTIMONIALS, TRUST_INDICATORS } from "@/lib/constants"

export function TrustSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Trust Indicators / Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 md:mb-24">
          {TRUST_INDICATORS.map((indicator) => (
            <div key={indicator.label} className="text-center p-6 rounded-3xl bg-stone-50 border border-stone-100">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">{indicator.value}</p>
              <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">{indicator.label}</p>
            </div>
          ))}
        </div>

        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-3">
            Testimonials
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-stone-900">
            Why Choose Us
          </h3>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={index}
              className="bg-stone-50 p-8 md:p-10 rounded-[2.5rem] border border-stone-100 flex flex-col relative"
            >
              <Quote className="w-10 h-10 text-primary/20 absolute top-8 right-8" />
              
              <p className="text-stone-700 italic mb-8 relative z-10 leading-relaxed">
                "{t.quote}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">{t.author}</h4>
                  <p className="text-xs text-stone-500 font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
