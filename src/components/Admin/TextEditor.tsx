import { Editor } from "@tinymce/tinymce-react";
import { forwardRef, useEffect, useRef } from "react";

interface TextEditorProps {
  onSubmit: (content: string) => void;
}

export interface TextEditorRef {
  getText: () => string;
}

interface EditorRef {
  getContent: () => string;
}

const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(function TextEditorComponent({ onSubmit }, _) {
  const editorRef = useRef<EditorRef | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const getText = () => {
    return editorRef.current?.getContent() || "";
  };

  useEffect(() => {
    getText();
  }, []);


  const handleDivRef = (element: HTMLDivElement) => {
    if (element) {
      divRef.current = element;
    }
  };

  const handleEditorChange = (content: string) => {
    onSubmit(content);
  };

  return (
    <div ref={handleDivRef}>
      <Editor
        apiKey={'0y32rjmb103dwot3dabu5jel3e31rklvv6s6en847pfxv0lr'}
        tinymceScriptSrc="https://cdn.tiny.cloud/1/0y32rjmb103dwot3dabu5jel3e31rklvv6s6en847pfxv0lr/tinymce/5/tinymce.min.js"
        onInit={(_, editor) => editorRef.current = editor}
        initialValue="<p>Uusi Seat Cordoba TDI Diesel!</p>"
        init={{
          height: 500,
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
