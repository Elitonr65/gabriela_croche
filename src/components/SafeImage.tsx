"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null
  fallbackSrc?: string
}

const BROKEN_IMAGE_URLS = new Set([
  "https://images.unsplash.com/photo-1520975958225",
])

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  onError,
  ...props
}: SafeImageProps) {
  const candidateSrc = src?.trim()
  const normalizedSrc = candidateSrc && !BROKEN_IMAGE_URLS.has(candidateSrc)
    ? candidateSrc
    : fallbackSrc
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const imageSrc = failedSrc === normalizedSrc ? fallbackSrc : normalizedSrc

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={(event) => {
        onError?.(event)

        if (imageSrc !== fallbackSrc) {
          setFailedSrc(normalizedSrc)
        }
      }}
    />
  )
}
