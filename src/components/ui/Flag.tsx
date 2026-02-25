import { useState } from 'react'
import { getFlagUrl, getFlagEmoji, getCountryCode } from '@/lib/utils/flags'

interface FlagProps {
  countryCodeOrName: string
  size?: 'sm' | 'md' | 'lg'
  alt?: string
  className?: string
}

const SIZE_MAP = {
  sm: { img: 20 as const, class: 'w-5 h-4' },
  md: { img: 40 as const, class: 'w-8 h-6' },
  lg: { img: 80 as const, class: 'w-10 h-8' },
}

export function Flag({ countryCodeOrName, size = 'sm', alt, className = '' }: FlagProps) {
  const [imgError, setImgError] = useState(false)
  const { img: imgSize, class: sizeClass } = SIZE_MAP[size]

  const code = countryCodeOrName.length === 2
    ? countryCodeOrName
    : getCountryCode(countryCodeOrName)

  const flagUrl = getFlagUrl(countryCodeOrName, imgSize)
  const flagEmoji = code ? getFlagEmoji(code) : '🏐'
  const altText = alt ?? `Bandeira de ${countryCodeOrName}`

  if (imgError || !flagUrl) {
    return (
      <span
        className={`inline-flex items-center justify-center text-base leading-none ${className}`}
        role="img"
        aria-label={altText}
        title={altText}
      >
        {flagEmoji}
      </span>
    )
  }

  return (
    <img
      src={flagUrl}
      alt={altText}
      title={altText}
      className={`${sizeClass} object-cover rounded-sm shadow-sm flex-shrink-0 ${className}`}
      onError={() => setImgError(true)}
      loading="lazy"
    />
  )
}
