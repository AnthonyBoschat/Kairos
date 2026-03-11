"use client"

import { Editor } from "@tiptap/react"
import { useList } from "@/components/tiptap-ui/list-button"
import { EditorToolbarButton } from "./EditorToolbarButton"

type ListType = "bulletList" | "orderedList" | "taskList"

interface ListButtonProps {
  editor: Editor | null
  type: ListType
  title?: string
}

export function ListButton({
  editor,
  type,
  title,
}: ListButtonProps) {
  const {
    isVisible,
    isActive,
    canToggle,
    handleToggle,
    label,
    Icon,
  } = useList({
    editor,
    type,
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