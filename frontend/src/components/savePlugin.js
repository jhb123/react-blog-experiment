import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {CLICK_COMMAND,COMMAND_PRIORITY_LOW} from 'lexical'
import { useState, useEffect } from "react";
import { put_article } from "../requests/articles";

export function SavePlugin() {

    const [callNum, setCallNum] = useState(0)
    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        editor.registerCommand(
            CLICK_COMMAND,
            () => setCallNum(callNum+1),
            COMMAND_PRIORITY_LOW,
        );
    })

    useEffect(() => { 

        const saveDocument = setTimeout(() => {
            editor.update(() => {
                const editorState = editor.getEditorState();
                const json = editorState.toJSON();
                put_article("test",json).then(res => {
                    // Work with the response...
                }).catch( error => {
                    console.log(error)
                })

                })
        }, 1000)
        return () => clearTimeout(saveDocument)
        
    }, [callNum,editor])

    const onChange = () => {
        setCallNum(callNum+1)
    }

    return(
        <OnChangePlugin onChange={onChange}/>
    )

}