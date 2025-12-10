import { RefObject, useEffect } from "react"

export default function useCallbackOnClickOutside<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  callback: () => void | Promise<void>
) {

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)

  }, [elementRef, callback])
}