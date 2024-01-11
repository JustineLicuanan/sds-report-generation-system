import { type OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Textarea } from '~/components/ui/textarea';

// This is how you import Editor.js Component
const EditorBlock = dynamic(() => import('~/components/editor'), { ssr: false });

export default function EditorPlayground() {
  const [content, setContent] = useState<OutputData>();

  return (
    <>
      <div className="container flex max-w-screen-lg flex-col justify-center gap-4 pb-24 pt-4">
        <div className="rounded border p-2">
          {/* `holder` prop must be a unique ID for each EditorBlock instance */}
          <EditorBlock data={content} onChange={setContent} holder="editor-playground" />
        </div>

        <Textarea
          className="font-mono"
          cols={30}
          rows={10}
          value={JSON.stringify(content, undefined, 2)}
        ></Textarea>
      </div>
    </>
  );
}
