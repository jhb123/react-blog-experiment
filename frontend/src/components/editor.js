import "./styles.css"
import { useEffect, useState, useCallback} from 'react';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import {
    $isRangeSelection, 
    $getSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $createParagraphNode,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import { HeadingNode } from '@lexical/rich-text';
import { TreeView } from "@lexical/react/LexicalTreeView";


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatSize from '@mui/icons-material/FormatSize';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { ButtonGroup } from "@mui/material";

const theme = {
    heading: {
        h1: 'blog-editor-h1',
        h2: 'blog-editor-h2',
        h3: 'blog-editor-h3',
        h4: 'blog-editor-h4'
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
        nodes: [HeadingNode]
    };

    return (
        <div className="editorWrapper">
            <LexicalComposer initialConfig={initialConfig}>
                <EditorToolbarPlugin />
                <RichTextPlugin
                    contentEditable={<ContentEditable className="contentEditable" onBlur={e => e.target.focus()}/>}
                    placeholder={<div className="placeHolder">Enter some text...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <TreeViewPlugin/>
            </LexicalComposer>
        </div>
    );
}

function EditorToolbarPlugin() {
    
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderlined, setIsUnderlined] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsUnderlined(selection.hasFormat('underline'));

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
            </ButtonGroup>
        </Box>
    );
}

/*--------------------------- simple toggles ---------------------------*/

function UnderlineToggle ({active}) {
    const [editor] = useLexicalComposerContext();
    const onClick = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
    }
    return (
        <Button onClick={onClick} color={ active ? "toolVariant" : "tool"}>
            <FormatUnderlinedIcon/>
        </Button>
    )
}

function BoldToggle ({active}) {
    const [editor] = useLexicalComposerContext();
    const onClick = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    }
    return (
        <Button onClick={onClick} color={ active ? "toolVariant" : "tool"}>
            <FormatBoldIcon/>
        </Button>
    )
}

function ItalicToggle ({active}) {
    const [editor] = useLexicalComposerContext();
    const onClick = () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    }
    
    return (
        <Button onClick={onClick} color={ active ? "toolVariant" : "tool"}>
            <FormatItalicIcon/>
        </Button>
    )
}

/*--------------------------- fancy menus ---------------------------*/


function FontSizeEditorToolbarMenu() {

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
                aria-haspopup="true"
                onClick={handleMenu}
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