import "./styles.css"
import {  useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $isRangeSelection, 
    $getSelection,
    FORMAT_ELEMENT_COMMAND,
    $createParagraphNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createListNode } from '@lexical/list';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormatSize from '@mui/icons-material/FormatSize';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';


export function FontSizeEditorToolbarMenu() {

    const [editor] = useLexicalComposerContext();
    const applyAction = (item) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            switch(item){
                case 'p': $setBlocksType(selection, () => $createParagraphNode(item));
                case 'h1': $setBlocksType(selection, () => $createHeadingNode(item));
                case 'h2': $setBlocksType(selection, () => $createHeadingNode(item));
                case 'h3': $setBlocksType(selection, () => $createHeadingNode(item));
                case 'h4': $setBlocksType(selection, () => $createHeadingNode(item));
                case 'bullet' : $setBlocksType(selection, () => $createListNode(item));
                case 'number' : $setBlocksType(selection, () => $createListNode(item));
                // default: $setBlocksType(selection, () => $createParagraphNode(item));
            }
          }
        });
      };

    const supportedTextFormats = [ 
        ['Paragraph', 'p'], 
        ['Large heading', 'h1'], 
        ['Medium heading', 'h2'], 
        ['Small heading', 'h3'],
        ['Bulleted List', 'bullet'],
        ['Numbered List', 'number'],

    ];

    const icon = <FormatSize />
    return (
        <EditorToolbarMenu options={supportedTextFormats} applyAction={applyAction} icon={icon} ></EditorToolbarMenu>
    )
}

export function FontAlignmentEditorToolbarMenu() {

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