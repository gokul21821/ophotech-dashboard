'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Check,
  X,
  Undo2,
  Redo2,
  RemoveFormatting,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

interface EditorState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  currentHeading: number;
  isBulletList: boolean;
  isOrderedList: boolean;
  isLink: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  disabled,
}: RichTextEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [linkDialogPosition, setLinkDialogPosition] = useState({ top: 0, left: 0 });
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState('16');
  const [editorState, setEditorState] = useState<EditorState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    currentHeading: 0,
    isBulletList: false,
    isOrderedList: false,
    isLink: false,
  });

  const linkInputRef = useRef<HTMLInputElement>(null);
  const fontSizeRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#D9751E] hover:text-[#c1651a] underline font-medium',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      updateStats(editor);
      updateEditorState(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateEditorState(editor);
    },
    editable: !disabled,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
      updateStats(editor);
      updateEditorState(editor);
    }
  }, [content, editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Close font size dropdown
      if (
        fontSizeRef.current &&
        !fontSizeRef.current.contains(target) &&
        !(event.target as HTMLElement).closest('[data-fontsize-trigger]')
      ) {
        setFontSizeOpen(false);
      }

      // Close link dialog if clicking outside
      if (
        showLinkDialog &&
        linkInputRef.current &&
        !linkInputRef.current.closest('.fixed')?.contains(target)
      ) {
        setShowLinkDialog(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLinkDialog]);

  const updateStats = (ed: any) => {
    const text = ed.getText();
    const words = text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
    const chars = text.length;
    setWordCount(words);
    setCharCount(chars);
  };

  const updateEditorState = (ed: any) => {
    setEditorState({
      isBold: ed.isActive('bold'),
      isItalic: ed.isActive('italic'),
      isUnderline: ed.isActive('underline'),
      currentHeading: ed.getAttributes('heading').level || 0,
      isBulletList: ed.isActive('bulletList'),
      isOrderedList: ed.isActive('orderedList'),
      isLink: ed.isActive('link'),
    });
  };

  const handleLinkClick = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href || '';
    setLinkUrl(previousUrl);
    setLinkInput(previousUrl);

    // Get the current selection position
    const { from } = editor.state.selection;
    const coords = editor.view.coordsAtPos(from);

    // Calculate popup position with viewport constraints
    const popupWidth = 320; // w-80 = 320px
    const popupHeight = 140; // Approximate height
    const margin = 10;

    let left = coords.left - 100; // Center roughly on the selection
    let top = coords.bottom + 8; // Below the selection

    // Constrain to viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + popupWidth > viewportWidth - margin) {
      left = viewportWidth - popupWidth - margin;
    }
    if (left < margin) {
      left = margin;
    }

    if (top + popupHeight > viewportHeight - margin) {
      top = coords.top - popupHeight - 8; // Above the selection if below doesn't fit
    }

    setLinkDialogPosition({ top, left });
    setShowLinkDialog(true);
    setTimeout(() => linkInputRef.current?.focus(), 0);
  };

  const handleSaveLink = () => {
    if (!editor) return;

    if (linkInput.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setShowLinkDialog(false);
      return;
    }

    let url = linkInput.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setShowLinkDialog(false);
  };

  const handleRemoveLink = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setShowLinkDialog(false);
  };


  if (!editor) {
    return null;
  }

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled: isDisabled,
    children,
    title,
    label,
  }: {
    onClick: () => void;
    isActive: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
    label?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`px-3 py-2.5 rounded-lg transition-all duration-100 flex items-center justify-center gap-1.5 text-sm font-medium hover:shadow-sm hover:bg-[#FFF6EB] text-[#3A4A5F] hover:text-[#D9751E] ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
      {label && <span className="hidden sm:inline text-xs">{label}</span>}
    </button>
  );


  const Separator = () => <div className="w-px h-7 bg-[#fcd5ac] mx-1" />;


  return (
    <div className="flex flex-col bg-white">
      {/* Main Editor Area */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-[1200px] border border-[#fcd5ac] rounded-2xl bg-white shadow-lg flex flex-col">
          {/* Sticky Toolbar */}
          <div className="sticky top-22 z-1 bg-gradient-to-r from-white to-[#FFF6EB] border-b border-[#fcd5ac] p-4 flex flex-wrap gap-2 shadow-sm">
            {/* Text Formatting */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editorState.isBold}
                disabled={disabled}
                title="Bold (Ctrl+B)"
                label="Bold"
              >
                <Bold size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editorState.isItalic}
                disabled={disabled}
                title="Italic (Ctrl+I)"
                label="Italic"
              >
                <Italic size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editorState.isUnderline}
                disabled={disabled}
                title="Underline (Ctrl+U)"
                label="Underline"
              >
                <UnderlineIcon size={18} />
              </ToolbarButton>
            </div>

            <Separator />

            {/* Headings */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editorState.currentHeading === 1}
                disabled={disabled}
                title="Heading 1"
                label="Heading 1"
              >
                <Heading1 size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editorState.currentHeading === 2}
                disabled={disabled}
                title="Heading 2"
                label="Heading 2"
              >
                <Heading2 size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editorState.currentHeading === 3}
                disabled={disabled}
                title="Heading 3"
                label="Heading 3"
              >
                <Heading3 size={18} />
              </ToolbarButton>
            </div>

            <Separator />

            {/* Lists */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editorState.isBulletList}
                disabled={disabled}
                title="Bullet List"
                label="List"
              >
                <List size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editorState.isOrderedList}
                disabled={disabled}
                title="Ordered List"
                label="Ordered"
              >
                <ListOrdered size={18} />
              </ToolbarButton>
            </div>

            <Separator />

            {/* Link */}
            <div className="relative">
              <ToolbarButton
                onClick={handleLinkClick}
                isActive={editorState.isLink}
                disabled={disabled}
                title="Link (Ctrl+K)"
              >
                <LinkIcon size={18} />
              </ToolbarButton>

            </div>


            {/* Undo/Redo */}
            <div className="flex gap-1">
              <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                isActive={false}
                disabled={disabled || !editor.can().undo()}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </ToolbarButton>

              <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                isActive={false}
                disabled={disabled || !editor.can().redo()}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </ToolbarButton>
            </div>

            <Separator />

            {/* Clear Formatting */}
            <div className="flex gap-1">

              <ToolbarButton
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                isActive={false}
                disabled={disabled}
                title="Clear Formatting"
              >
                <RemoveFormatting size={18} />
              </ToolbarButton>
            </div>
          </div>

          {/* Editor Container */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {/* Link Dialog - Popup */}
            {showLinkDialog && (
              <div
                className="fixed z-30 bg-white border border-[#fcd5ac] rounded-lg shadow-lg p-4 w-80"
                style={{
                  top: `${linkDialogPosition.top}px`,
                  left: `${linkDialogPosition.left}px`,
                }}
              >
                <label className="block text-sm font-medium text-[#0B1B2B] mb-2">
                  URL
                </label>
                <input
                  ref={linkInputRef}
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveLink();
                    if (e.key === 'Escape') setShowLinkDialog(false);
                  }}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-[#fcd5ac] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9751E] text-[#0B1B2B] mb-3"
                />
                <div className="flex gap-2 justify-end">
                  {linkUrl && (
                    <button
                      onClick={handleRemoveLink}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    onClick={() => setShowLinkDialog(false)}
                    className="px-3 py-2 text-[#3A4A5F] hover:bg-[#FFF6EB] rounded-lg transition-colors text-sm font-medium"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={handleSaveLink}
                    className="px-3 py-2 bg-[#D9751E] text-white rounded-lg hover:bg-[#c1651a] transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    <Check size={16} />
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Placeholder */}
            {wordCount === 0 && (
              <div className="absolute top-12 left-6 text-[#9CA3AF] pointer-events-none text-base z-0">
                Click here to start
              </div>
            )}

            {/* Editor */}
            <EditorContent
              editor={editor}
              className={`flex-1 p-6 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:ring-inset transition-all
                ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
                
                /* Base Typography Class */
                prose max-w-none
                
                /* Remove default focus outlines */
                [&_.ProseMirror]:outline-none 
                
                /* Match your specific colors */
                prose-headings:text-[#0B1B2B]
                prose-h1:text-3xl prose-h1:font-bold
                prose-h2:text-2xl prose-h2:font-bold
                prose-h3:text-xl prose-h3:font-bold
                prose-p:text-[#3A4A5F] prose-p:leading-relaxed
                prose-li:text-[#3A4A5F]
                prose-strong:text-[#0B1B2B] prose-strong:font-bold
                prose-em:italic
                prose-u:underline
                
                /* Custom Link Styling */
                prose-a:text-[#D9751E] 
                prose-a:font-medium 
                prose-a:underline
                hover:prose-a:text-[#c1651a]
                
                /* List Styling */
                prose-ul:list-disc prose-ul:pl-6
                prose-ol:list-decimal prose-ol:pl-6
                
                
                /* Focus State */
                [&_.ProseMirror:focus]:outline-none
              `}
            />
          </div>

          {/* Footer Stats */}
          <div className="border-t border-[#fcd5ac] bg-gradient-to-r from-[#FFF6EB] to-white p-4 flex items-center justify-between text-sm text-[#6B7280]">
            <div className="flex gap-6">
              <span className="font-medium">{wordCount} words</span>
              <span>•</span>
              <span className="font-medium">{charCount} characters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}