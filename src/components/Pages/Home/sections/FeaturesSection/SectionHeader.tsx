"use client"


interface SectionHeaderProps {
  isInView: boolean
  sectionTitle: string
  mainTitle: string
  mainDescription: string
  centered?: boolean
}

export default function SectionHeader({ 
  isInView, 
  sectionTitle, 
  mainTitle, 
  mainDescription,
  centered = true
}: SectionHeaderProps) {
  return (
    <>
      <span className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase">
            {sectionTitle}
      </span>

     <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight max-w-3xl text-wtheme-text">
            {mainTitle}
      </h2>

      <p className={`mt-4 text-lg font-body text-wtheme-text ${centered ? 'max-w-2xl mx-auto' : 'max-w-[600px]'}`} >
        {mainDescription}
      </p>
    </>
  )
}