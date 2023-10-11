import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
} from 'lexical';


import Button from '@mui/material/Button';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatCodeIcon from '@mui/icons-material/Code';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';


export function CodeToggle ({active}) {
    const [editor] = useLexicalComposerContext();
    const onClick = () => {
        editor.update(() => {
            // const onClick = () => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            // }
          });
    }
    return (
        <Button onClick={onClick} color={ active ? "toolVariant" : "tool"}>
            <FormatCodeIcon/>
        </Button>
    )
}

export function UnderlineToggle ({active}) {
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

export function BoldToggle ({active}) {
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

export function ItalicToggle ({active}) {
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