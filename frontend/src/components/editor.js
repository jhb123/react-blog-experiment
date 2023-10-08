import "./styles.css"
import { useEffect, useState } from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {$isRangeSelection, $getSelection} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import { HeadingNode } from '@lexical/rich-text';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import FormatSize from '@mui/icons-material/FormatSize';
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

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Focus the editor when the effect fires!
        editor.focus();
    }, [editor]);

    return null;
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
                <FontStyleMenu />
            </Toolbar>
        </Box>
    );
}


function FontStyleMenu() {

    const [editor] = useLexicalComposerContext();

    const chooseFontStyle = (format) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(format));
            // console.log("setting font to " + format)
          }
        });
      };

    const supportedTextFormats = ['p', 'h1', 'h2', 'h3', 'h4'];

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemSelect = (format) => {
        chooseFontStyle(format)
        handleClose()
    }

    return (
        <>
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="heading-toolbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <FormatSize />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
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
                {supportedTextFormats.map((format) => (
                    <MenuItem key={format} onClick={() => handleMenuItemSelect(format)}>{format}</MenuItem>
                ))}
                {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
            </Menu>
        </>
    )
}

export default Editor