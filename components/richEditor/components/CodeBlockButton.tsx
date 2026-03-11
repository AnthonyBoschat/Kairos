"use client"

import { Editor } from "@tiptap/react"
import { useBlockquote } from "@/components/tiptap-ui/blockquote-button"
import { EditorToolbarButton } from "./EditorToolbarButton"
import { useCodeBlock } from "@/components/tiptap-ui/code-block-button"

interface CodeBlockButtonProps {
  editor: Editor | null
  title?: string
}

export function CodeBlockButton({
  editor,
  title,
}: CodeBlockButtonProps) {
  const {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label,
    Icon,
  } = useCodeBlock({
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