import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

import { LATEST_NEWS } from "@/lib/constants"
import { Button } from "@/components/ui/button"

export function LatestNews() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-3">
              Blog & Updates
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-stone-900">
              Latest News
            </h3>
            <div className="w-20 h-1 bg-primary mt-6 rounded-full" />
          </div>
          <Button asChild variant="ghost" className="text-stone-900 font-bold hover:text-primary hover:bg-transparent p-0 group">
             <Link href="/news" className="flex items-center gap-2">
               View All News
               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
             </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {LATEST_NEWS.map((news) => (
            <div key={news.id} className="group flex flex-col lg:flex-row gap-6 lg:items-center">
              <div className="relative w-full lg:w-48 h-48 shrink-0 rounded-3xl overflow-hidden border border-stone-100">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 text-stone-400 text-xs font-bold uppercase tracking-widest mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(news.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <Link href={news.href}>
                  <h4 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 group-hover:text-primary transition-colors">
                    {news.title}
                  </h4>
                </Link>
                <p className="text-stone-600 mb-4 line-clamp-2 leading-relaxed">
                  {news.excerpt}
                </p>
                <Button asChild variant="link" className="w-fit p-0 h-auto font-bold text-primary hover:no-underline group/btn">
                  <Link href={news.href} className="flex items-center gap-2">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
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
