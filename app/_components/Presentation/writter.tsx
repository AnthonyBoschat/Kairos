"use client"
import { useEffect, useState } from "react"

interface WriterProps {
  sentence: string
  speed?: number
}

export default function Writer({ sentence, speed = 60 }: WriterProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= sentence.length) return

    const timer = setTimeout(() => {
      setIndex(i => i + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [index, sentence.length, speed])

  // Reset si la phrase change
  useEffect(() => {
    setIndex(0)
  }, [sentence])

  return <>{sentence.slice(0, index)}</>
}