"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, ChevronRight } from "lucide-react"
import { FadeIn } from "@/utils/lightweightAnimations"

export function NewsCard({ news }) {

    return (
        <FadeIn
     
        className="group relative overflow-hidden rounded-xl bg-background border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col"
        >
        <div className={`h-1 w-full bg-gradient-to-r ${news.color}`}></div>

        <div className="relative overflow-hidden aspect-video">
            <Image
            src={news.image || "/placeholder.svg"}
            alt={news.title}
            fill
            priority={true}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 z-10">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${news.color}`}>
                {news.category}
            </span>
            </div>
        </div>

        <div className="flex-grow p-5">
            <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(news.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })}
            </div>

            <h3 className="text-base font-bold mb-2 line-clamp-2 group-hover:text-wtheme-hover transition-colors">
            {news.title}
            </h3>

            <Link
            href={`/Pages/NewsDetailPage/${news.id}`}
            className="inline-flex items-center text-sm text-primary font-medium hover:underline mt-2"
            >
            {news.readMore}
            <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
        </div>
        </FadeIn>
    )
}