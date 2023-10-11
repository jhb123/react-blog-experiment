import { useEffect, useState, useCallback} from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $isRangeSelection, 
    $getSelection,

} from 'lexical';
import { mergeRegister } from '@lexical/utils';



import Box from '@mui/material/Box';
import { ButtonGroup } from "@mui/material";

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

export default EditorToolbarPlugin