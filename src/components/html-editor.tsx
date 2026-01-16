"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ isActive, onClick, icon: Icon, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-colors ${
        isActive
          ? "bg-brand-500 text-white"
          : "hover:bg-gray-200 darkx:hover:bg-gray-700 text-gray-700 darkx:text-gray-300"
      }`}
    >
      <Icon size={18} />
    </button>
  )

  return (
    <div className="border border-gray-200 darkx:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 bg-gray-50 darkx:bg-gray-900 border-b border-gray-200 darkx:border-gray-700">
        <ToolbarButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
          title="Bold"
        />
        <ToolbarButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
          title="Italic"
        />
        <div className="w-px bg-gray-300 darkx:bg-gray-600" />
        <ToolbarButton
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={Heading2}
          title="Heading 2"
        />
        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
          title="Ordered List"
        />
        <div className="w-px bg-gray-300 darkx:bg-gray-600" />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          icon={AlignCenter}
          title="Align Center"
        />
        <ToolbarButton
          isActive={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          icon={AlignRight}
          title="Align Right"
        />
        <div className="w-px bg-gray-300 darkx:bg-gray-600" />
        <ToolbarButton
          isActive={editor.isActive("link")}
          onClick={() => {
            const url = prompt("Enter URL:")
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
          icon={Link2}
          title="Add Link"
        />
        <ToolbarButton isActive={false} onClick={() => editor.chain().focus().undo().run()} icon={Undo2} title="Undo" />
        <ToolbarButton isActive={false} onClick={() => editor.chain().focus().redo().run()} icon={Redo2} title="Redo" />
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose darkx:prose-invert prose-sm max-w-none p-4 bg-white darkx:bg-gray-900 text-gray-900 darkx:text-white min-h-64 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:p-0"
      />
    </div>
  )
}
