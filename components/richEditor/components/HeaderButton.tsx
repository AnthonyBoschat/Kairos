"use client"

import { Editor } from "@tiptap/react"
import { EditorToolbarButton } from "./EditorToolbarButton"
import { Level, useHeading } from "@/components/tiptap-ui/heading-button"

interface HeaderButtonProps {
  editor: Editor | null
  title?: string
  level: Level
}

export function HeaderButton({
  editor,
  title,
  level
}: HeaderButtonProps) {
  const {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label,
    Icon,
  } = useHeading({
    editor,
    hideWhenUnavailable: false,
    level: level,
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