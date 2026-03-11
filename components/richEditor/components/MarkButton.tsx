"use client"

import { Editor } from "@tiptap/react"
import { EditorToolbarButton } from "./EditorToolbarButton"
import { Mark, useMark } from "@/components/tiptap-ui/mark-button"

interface MarkButtonProps {
  editor: Editor | null
  title?: string
  type: Mark
}

export function MarkButton({
  editor,
  title,
  type
}: MarkButtonProps) {
  const {
    isVisible,
    isActive,
    canToggle,
    handleMark,
    label,
    Icon,
  } = useMark({
    editor,
    hideWhenUnavailable: false,
    type: type
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
      onClick={handleMark}
      Icon={Icon}
    />
  )
}