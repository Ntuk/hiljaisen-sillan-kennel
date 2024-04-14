import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useEffect, useRef, useState } from "react";

interface TextEditorProps {
  onSubmit: (content: string) => void;
  value?: string;
}

export interface TextEditorRef {
  getText: () => string;
}

interface EditorRef {
  getContent: () => string;
}

const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(function TextEditorComponent({ onSubmit, value }, _) {
  const [editorContent, setEditorContent] = useState<string>("");
  const editorRef = useRef<EditorRef | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getText();
  }, []);

  useEffect(() => {
    setEditorContent(value);
  }, [value]);

  const getText = () => {
    return editorRef.current?.getContent() || "";
  };

  const handleDivRef = (element: HTMLDivElement) => {
    if (element) {
      divRef.current = element;
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    onSubmit(content);
  };

  return (
    <div ref={handleDivRef}>
      <Editor
        apiKey={'0y32rjmb103dwot3dabu5jel3e31rklvv6s6en847pfxv0lr'}
        tinymceScriptSrc="https://cdn.tiny.cloud/1/0y32rjmb103dwot3dabu5jel3e31rklvv6s6en847pfxv0lr/tinymce/5/tinymce.min.js"
        onInit={(_, editor) => editorRef.current = editor}
        value={editorContent}
        init={{
          height: 500,
          directionality: 'ltr',
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
});

export default TextEditor;
