/* eslint-disable */
// @ts-nocheck
import NestedList from '@editorjs/nested-list';
import Table from '@editorjs/table';
import Underline from '@editorjs/underline';
import Header from 'editorjs-header-with-alignment';
import Paragraph from 'editorjs-paragraph-with-alignment';

export const EDITOR_TOOLS = {
  header: { class: Header, config: { placeholder: 'Enter a header...' } },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    config: { placeholder: 'Type something...', preserveBlank: true },
  },
  list: { class: NestedList, inlineToolbar: true, config: { defaultStyle: 'unordered' } },
  table: { class: Table, inlineToolbar: true, config: { withHeadings: true } },
  underline: Underline,
};
