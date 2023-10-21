import "./styles.css"


import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode } from '@lexical/rich-text';
import { TreeView } from "@lexical/react/LexicalTreeView";
import { LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import Paper from '@mui/material/Paper';

import EditorToolbarPlugin from "./EditorToolbarPlugin";
import { ImageNode } from "./ImagePlugin";
import { SavePlugin } from "./savePlugin";


const theme = {
    heading: {
        h1: 'editor-h1',
        h2: 'editor-h2',
        h3: 'editor-h3',
        h4: 'editor-h4'
      },
    text: {
        bold: 'editor-textBold',
        code: 'editor-textCode',
        italic: 'editor-textItalic',
        strikethrough: 'editor-textStrikethrough',
        subscript: 'editor-textSubscript',
        superscript: 'editor-textSuperscript',
        underline: 'editor-textUnderline',
        underlineStrikethrough: 'editor-textUnderlineStrikethrough',
    },
    link: 'editor-link',

}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
    console.error(error);
}

function Editor() {
    const initialConfig = {
        namespace: 'MyEditor',
        theme,
        onError,
        nodes: [HeadingNode, ImageNode, LinkNode, ListNode, ListItemNode]
    };



    return (
        <div className="editorWrapper">
            <LexicalComposer initialConfig={initialConfig}>
                <EditorToolbarPlugin />
                <RichTextPlugin
                    contentEditable={
                        <Paper elevation={3}>
                            <ContentEditable className="contentEditable" />
                        </Paper>
                    }
                    placeholder={<div className="placeHolder">Enter some text...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <LinkPlugin />
                <TreeViewPlugin />
                <TabIndentationPlugin/>
                <ListPlugin />
                <SavePlugin />
            </LexicalComposer>
        </div>
    );
}


function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();
  return (
    <TreeView
      viewClassName="tree-view-output"
      timeTravelPanelClassName="debug-timetravel-panel"
      timeTravelButtonClassName="debug-timetravel-button"
      timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
      timeTravelPanelButtonClassName="debug-timetravel-panel-button"
      editor={editor}
    />
  );
}


export default Editor