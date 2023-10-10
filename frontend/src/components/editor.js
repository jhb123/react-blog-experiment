import "./styles.css"
import { useEffect, useState, useCallback} from 'react';
import Image from 'react'
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
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { ButtonGroup } from "@mui/material";

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
        nodes: [HeadingNode, ImageNode]
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

/*--------------------------- Image test ---------------------------*/

function InsertImageTest () {
    
    const INSERT_IMAGE_COMMAND = createCommand();

    const [editor] = useLexicalComposerContext();

    editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          console.log(payload);
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      );

    
    const onClick = () => {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND,"test payload");
        
    }
    return (
        <Button onClick={onClick} color={"tool"}>
            <Typography>Insert Image</Typography>
        </Button>
    )
}


/*--------------------------- simple toggles ---------------------------*/

function CodeToggle ({active}) {
    const [editor] = useLexicalComposerContext();
    const onClick = () => {
        editor.update(() => {
            const onClick = () => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }
          });
    }
    return (
        <Button onClick={onClick} color={ active ? "toolVariant" : "tool"}>
            <FormatCodeIcon/>
        </Button>
    )
}

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
        ['Medium heading', 'h2'], 
        ['Small heading', 'h3'], 
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
        <EditorToolbarMenu options={supportedTextFormats} applyAction={applyAction} ></EditorToolbarMenu>
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

/*--------------------------- image node ---------------------------*/

export class ImageNode extends DecoratorNode {
    // essentially copied from the documentation

    __id;
  
    static getType() {
      return 'image';
    }
  
    static clone(node) {
      return new ImageNode(node.__id, node.__key);
    }
  
    constructor(id, key) {
      super(key);
      this.__id = id;
    }
  
    createDOM() {
        // this puts the image in a span. This feels like a nicer way to edit the document
        return document.createElement('span');
    }
  
    updateDOM() {
      return false;
    }
  
    decorate() {
        // temporary image to test the editor. 
        return <img className="editor-image" src={landscape} alt="Loch Lomond"/>;
    }
  }
  
  // these probably dont need exporting
  export function $createImageNode(id) {
    return new ImageNode(id);
  }
  export function $isImageNode(node) {
    return node instanceof ImageNode;
  }




export default Editor