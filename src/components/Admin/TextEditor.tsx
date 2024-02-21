import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";

interface TinyMCEEditor {
  getContent: () => string;
}

function TextEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  return (
    <Editor
      apiKey={'0y32rjmb103dwot3dabu5jel3e31rklvv6s6en847pfxv0lr'}
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
    />
  )
}

export default TextEditor
