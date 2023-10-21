import { useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $isRangeSelection, 
    $getSelection,
    COMMAND_PRIORITY_EDITOR,
    FORMAT_TEXT_COMMAND,
} from 'lexical';

import {$findMatchingParent } from '@lexical/utils';
import {toggleLink, TOGGLE_LINK_COMMAND, $isLinkNode} from "@lexical/link"

import Button from '@mui/material/Button';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatCodeIcon from '@mui/icons-material/Code';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LinkIcon from '@mui/icons-material/Link';
import ConstructionIcon from '@mui/icons-material/Construction';
import {get_article} from "../requests/articles"
import {INSTANCE} from "../requests/common"


export function DeserialiseTest () {
    const [editor] = useLexicalComposerContext();
    const onClick = () => {
        // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        INSTANCE.get(`/articles/post/a_test.json`).then( (response) => {
            console.log(response.data)
            editor.update(() => {
                const editorState = editor.parseEditorState(response.data)
                editor.setEditorState(editorState);
              })
        })
        .catch(function (error) {
            console.log(error)
        });

    }
    return (
        <Button onClick={onClick} color="tool">
            <ConstructionIcon/>
        </Button>
    )
}

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

export function LinkToggle() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
          TOGGLE_LINK_COMMAND,
          (payload) => {
            const url = payload;
            toggleLink(url);
            return true;
          },
          COMMAND_PRIORITY_EDITOR,
        );
      }, [editor]);

    const onClick = () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            var nodes = selection.getNodes()
            nodes.length === 1 ? toggleSingleLink(nodes[0]) : removeMultipleLinks(nodes)
          }
        });
      };


      const toggleSingleLink = node => {
        editor.update(() => {
            var link_node = $findMatchingParent(node, $isLinkNode)
            if (link_node){
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            }
            else{
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, node.getTextContent())
            }
        })
      }

      const removeMultipleLinks = (nodes) => {
        editor.update(() => {
            var links = nodes.filter($isLinkNode)
            links.forEach(_ => {editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)})

        })
      }

      return (
        <Button onClick={onClick}>
            <LinkIcon />
        </Button>
      )
}