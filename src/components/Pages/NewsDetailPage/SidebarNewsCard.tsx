import Link from "next/link"
import Image from "next/image"

export function SidebarNewsCard({ item }) {

    const websiteId = localStorage.getItem("websiteId");
    const sectionId = localStorage.getItem("news-section-id") ;
    return (
        <Link href={`/Pages/NewsDetailPage/${item.id}?sectionId=${sectionId}&websiteId=${websiteId}`} 
        className="flex items-start gap-3 group">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            fill
            priority={true}
            className="object-cover"
            />
        </div>
        <div>
            <h4 className="text-sm font-medium group-hover:text-wtheme-hover transition-colors line-clamp-2">
            {item.title}
            </h4>
            
        </div>
        </Link>
    )
}