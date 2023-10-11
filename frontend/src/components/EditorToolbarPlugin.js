import { useEffect, useState, useCallback} from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $isRangeSelection, 
    $getSelection,
    $createParagraphNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { mergeRegister } from '@lexical/utils';



import Box from '@mui/material/Box';
import { ButtonGroup } from "@mui/material";
import Button from '@mui/material/Button';
import LinkIcon from '@mui/icons-material/Link';

import { BoldToggle, CodeToggle, ItalicToggle, UnderlineToggle } from "./editor-toggles"
import { InsertImageTest } from './ImagePlugin';
import { FontSizeEditorToolbarMenu, FontAlignmentEditorToolbarMenu } from './editor-menus';

function EditorToolbarPlugin() {
    
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);
    const [isCode, setIsCode] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsUnderlined(selection.hasFormat('underline'));
          setIsCode(selection.hasFormat('code'));
        }
      }, [editor]);

    useEffect(() => {
        return mergeRegister(
        editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
            updateToolbar();
            });
        })
        );
    }, [updateToolbar, editor]);

    return (
        <Box
            display="flex" 
            alignItems="center"
            justifyContent="center" sx={{ p: 1 }}>
            <ButtonGroup variant="contained" size ="medium" color="tool">
                <FontSizeEditorToolbarMenu />
                <FontAlignmentEditorToolbarMenu />
                <BoldToggle active={isBold}/>
                <ItalicToggle active={isItalic}/>
                <UnderlineToggle active={isUnderlined}/>
                <CodeToggle active={isCode}/>
                <InsertImageTest />
            </ButtonGroup>
        </Box>
    );
}

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

export default EditorToolbarPlugin