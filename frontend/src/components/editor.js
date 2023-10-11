import "./styles.css"
import { useEffect, useState, useCallback, useRef} from 'react';
import Image from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';

import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {
    $isRangeSelection, 
    $getSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $createParagraphNode,
    $createTextNode,
    $insertNodes,
    createCommand,
    DecoratorNode,
    COMMAND_PRIORITY_LOW,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { HeadingNode } from '@lexical/rich-text';
import { TreeView } from "@lexical/react/LexicalTreeView";
import { AutoLinkNode, LinkNode } from "@lexical/link"


import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatSize from '@mui/icons-material/FormatSize';
import FormatCodeIcon from '@mui/icons-material/Code';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import LinkIcon from '@mui/icons-material/Link';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { ButtonGroup } from "@mui/material";

import { BoldToggle, CodeToggle, ItalicToggle, UnderlineToggle } from "./editor-toggles"
import EditorToolbarPlugin from "./EditorToolbarPlugin";
import { ImageNode } from "./ImagePlugin";

import landscape from "../images/large.jpeg"

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
        nodes: [HeadingNode, ImageNode, LinkNode, AutoLinkNode]
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

                {/* <AutoLinkPlugin /> */}
                <TabIndentationPlugin/>
            </LexicalComposer>
        </div>
    );
}

/*--------------------------- Image test ---------------------------*/


/* -------------------------- link ----------------------------------*/

function LinkButton() {
    const [editor] = useLexicalComposerContext();
    const applyAction = (item) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if(item === 'p'){
                $setBlocksType(selection, () => $createParagraphNode(item));
            }
            else {
                $setBlocksType(selection, () => $createHeadingNode(item));
            }
          }
        });
      };

      return (
        <Button >
            <LinkIcon />
        </Button>
      )
}

/*--------------------------- fancy menus ---------------------------*/




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

/*--------------------------- image node ---------------------------*/





export default Editor