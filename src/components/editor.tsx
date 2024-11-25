import EditorJS, { type OutputData } from '@editorjs/editorjs';
import { memo, useEffect, useRef } from 'react';

import { cn } from '~/lib/utils';
import { EDITOR_TOOLS } from '~/utils/editor-tools';

type Props = {
  data?: OutputData;
  onChange(val: OutputData): void;
  setEditorInstance?(editor: () => EditorJS | undefined): void;
  holder: string;
  className?: string;
};

function EditorBlock({ data, onChange, setEditorInstance, holder, className }: Props) {
  const ref = useRef<EditorJS>();

  useEffect(() => {
    // Initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        data,
        async onChange(api) {
          const data = await api.saver.save();
          onChange(data);
        },
      });
      ref.current = editor;
    }

    // Set Editor.js instance for access in the parent component
    setEditorInstance?.(() => ref.current);

    // Add a return function handle cleanup
    return () => {
      ref.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={holder} className={cn('prose max-w-full', className)} />;
}

export default memo(EditorBlock);
