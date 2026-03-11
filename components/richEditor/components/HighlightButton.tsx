"use client"

import { Editor, useEditorState } from "@tiptap/react"
import { EditorToolbarButton } from "./EditorToolbarButton"
import s from "./styles.module.scss"

interface HighlightColorButtonProps {
  editor: Editor | null
  title?: string
  color: string
}

export function HighlightColorButton({
  editor,
  title,
  color,
}: HighlightColorButtonProps) {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          isActive: false,
          canApplyHighlight: false,
        }
      }

      return {
        isActive: editor.isActive("highlight", { color }),
        canApplyHighlight: editor
          .can()
          .chain()
          .focus()
          .setHighlight({ color })
          .run(),
      }
    },
  })

  const handleClick = () => {
    if (!editor) {
      return
    }

    if (editor.isActive("highlight", { color })) {
      editor.chain().focus().unsetHighlight().run()
      return
    }

    editor.chain().focus().setHighlight({ color }).run()
  }

  if(!editorState ) return null
  return (
    <EditorToolbarButton
      label={title || `Highlight ${color}`}
      title={title}
      isActive={editorState.isActive}
      isDisabled={!editorState.canApplyHighlight}
      onClick={handleClick}
      className={s.highlightColorButton}
      activeStyleMode="color"
    >
      <span
        className={s.highlightColorSwatch}
        style={{ backgroundColor: color }}
      />
    </EditorToolbarButton>
  )
}