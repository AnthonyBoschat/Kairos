
"use client"
import { useEditor, EditorContent, EditorContext } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import s from './styles.module.scss'
import { createLowlight, common } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import withClass from '@/utils/class'
import { CodeBlockButton } from './components/CodeBlockButton'
import { ListButton } from './components/ListButton'
import { Blockquotebutton } from './components/BlockquoteButton'
import { HeaderButton } from './components/HeaderButton'
import { MarkButton } from './components/MarkButton'
import { HighlightColorButton } from './components/HighlightButton'
import Highlight from "@tiptap/extension-highlight"

const lowlight = createLowlight(common)

interface RichEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  color?: string
}

export default function RichEditor({ value, onChange, placeholder, color  }: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
    StarterKit.configure({ codeBlock: false }), // désactive le codeBlock de base
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({
      multicolor: true,
    }),
    CodeBlockLowlight.configure({ 
        lowlight,
        defaultLanguage: "js",
        HTMLAttributes: {
            spellcheck: "false"
        }
     }),
    Placeholder.configure({ placeholder })
  ],
    content: value || '',
    onUpdate: ({ editor }) => {
        const html = editor.isEmpty ? '' : editor.getHTML().trim()
        onChange?.(html)
    },
  })

  if (!editor) {
    return null
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <div style={{ '--editor-color': color, height: '100%' } as React.CSSProperties}>
        <div className={s.menu}>
          <div className={s.toolbar}>

            <div className={withClass(s.section)}>
              <HighlightColorButton
                color="#FFF3A3"
                title="Jaune doux"
                editor={editor}
              />
              <HighlightColorButton
                color="#FFD6A5"
                title="Pêche clair"
                editor={editor}
              />
              <HighlightColorButton
                color="#FFCAD4"
                title="Rose poudré"
                editor={editor}
              />
              <HighlightColorButton
                color="#D9F99D"
                title="Vert clair"
                editor={editor}
              />
              <HighlightColorButton
                color="#BFE3FF"
                title="Bleu ciel"
                editor={editor}
              />
              <HighlightColorButton
                color="#C7D2FE"
                title="Lavande"
                editor={editor}
              />
              <HighlightColorButton
                color="#E9D5FF"
                title="Violet pastel"
                editor={editor}
              />
            </div>
            <div className={withClass(s.section, s.lists)}>
              <MarkButton
                type={"bold"}
                title="Gras"
                editor={editor}
              />
              <MarkButton
                type={"italic"}
                title="Italique"
                editor={editor}
              />
              <MarkButton
                type={"strike"}
                title="Barré"
                editor={editor}
              />
              <MarkButton
                type={"code"}
                title="Code"
                editor={editor}
              />
              <MarkButton
                type={"underline"}
                title="Souligné"
                editor={editor}
              />
            </div>
            <div className={withClass(s.section, s.lists)}>
              <HeaderButton
                level={1}
                title="Citation"
                editor={editor}
              />
              <HeaderButton
                level={2}
                title="Citation"
                editor={editor}
              />
              <HeaderButton
                level={3}
                title="Citation"
                editor={editor}
              />
              <HeaderButton
                level={4}
                title="Citation"
                editor={editor}
              />
            </div>
            <div className={withClass(s.section, s.lists)}>
              <ListButton
                title="Cases à cocher"
                editor={editor}
                type="taskList"
              />
              <ListButton
                title="Liste à puces"
                editor={editor}
                type="bulletList"
              />
              <ListButton
                title="Liste numérotée"
                editor={editor}
                type="orderedList"
              />
            </div>
            <div className={withClass(s.section, s.lists)}>
              <Blockquotebutton
                title="Citation"
                editor={editor}
              />
              <CodeBlockButton
                title="Bloque de code"
                editor={editor}
              />
            </div>
          </div>
        </div>

        <EditorContent editor={editor} className={s.editor}  />
      </div>
    </EditorContext.Provider>

  )
}