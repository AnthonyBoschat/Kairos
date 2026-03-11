"use client"

import { Editor } from "@tiptap/react"
import { useBlockquote } from "@/components/tiptap-ui/blockquote-button"
import { EditorToolbarButton } from "./EditorToolbarButton"

interface BlockquotebuttonProps {
  editor: Editor | null
  title?: string
}

export function Blockquotebutton({
  editor,
  title,
}: BlockquotebuttonProps) {
  const {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label,
    Icon,
  } = useBlockquote({
    editor,
    hideWhenUnavailable: false,
  })

  if (!isVisible) {
    return null
  }

  return (
    <EditorToolbarButton
      label={label}
      title={title}
      isActive={isActive}
      isDisabled={!canToggle}
      onClick={handleToggle}
      Icon={Icon}
    />
  )
}