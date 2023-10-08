import "./styles.css"
import { useEffect, useState } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {$isRangeSelection, $getSelection,   FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import { HeadingNode } from '@lexical/rich-text';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import FormatSize from '@mui/icons-material/FormatSize';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const theme = {
    heading: {
        h1: 'blog-editor-h1',
        h2: 'blog-editor-h2',
        h3: 'blog-editor-h3',
        h4: 'blog-editor-h4'
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
        nodes: [HeadingNode]
    };

    return (
        <div className="editorWrapper">
            <LexicalComposer initialConfig={initialConfig}>
                <EditorToolbar />
                <RichTextPlugin
                    contentEditable={<ContentEditable className="contentEditable" />}
                    placeholder={<div className="placeHolder">Enter some text...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
            </LexicalComposer>
        </div>
    );
}

function EditorToolbar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Toolbar>
                <FontSizeEditorToolbarMenu />
                <FontAlignmentEditorToolbarMenu />
            </Toolbar>
        </Box>
    );
}

function EditorToolbarMenu ({options, applyAction, icon}) {
    const [hint, setHint] = useState(options[0][0]);
    const [anchorEl, setAnchorEl] = useState(null);

    const handletHint = (item) => {
        setHint(item)
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemSelect = (item) => {
        applyAction(item[1])
        handletHint(item[0])
        handleClose()
    }

    return (
        <>
            <Button
                size="medium"
                aria-label="account of current user"
                aria-controls="heading-toolbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                startIcon={icon}
                sx={{ textTransform: 'none' }}
            >
                {hint}
            </Button>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {options.map((item) => (
                    <MenuItem key={item[1]} onClick={() => handleMenuItemSelect(item)}>
                        <Typography>{item[0]}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )

}

function FontSizeEditorToolbarMenu() {

    const [editor] = useLexicalComposerContext();
    const applyAction = (item) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(item));
          }
        });
      };

    const supportedTextFormats = [ 
        ['Paragraph', 'p'], 
        ['Large heading', 'h1'], 
        ['Big heading', 'h2'], 
        ['Medium heading', 'h3'], 
        ['Small heading', 'h4']
    ];

    const icon = <FormatSize />
    return (
        <EditorToolbarMenu options={supportedTextFormats} applyAction={applyAction} icon={icon} ></EditorToolbarMenu>
    )
}

function FontAlignmentEditorToolbarMenu() {

    const supportedTextFormats = [ 
        [<FormatAlignLeftIcon/>, 'left'], 
        [<FormatAlignCenterIcon/>, 'center'], 
        [<FormatAlignJustifyIcon/>, 'justify'],
        [<FormatAlignRightIcon/>, 'right'], 
    ];
    const [editor] = useLexicalComposerContext();
    const applyAction = (choice) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, choice);
    return (
        <EditorToolbarMenu options={supportedTextFormats} applyAction={applyAction}  ></EditorToolbarMenu>
    )
}

export default Editor