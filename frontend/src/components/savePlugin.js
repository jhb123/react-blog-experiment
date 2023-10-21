import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState, useEffect } from "react";
import { put_article } from "../requests/articles";

export function SavePlugin() {

    const [callNum, setCallNum] = useState(0)
    const [editor] = useLexicalComposerContext();

    useEffect(() => { 

        const saveDocument = setTimeout(() => {
            editor.update(() => {
                console.log(callNum)
                const editorState = editor.getEditorState();
                const json = editorState.toJSON();
                console.log(json)
                put_article("test",json)

                })
        }, 1000)
        return () => clearTimeout(saveDocument)
        
    }, [callNum])

    const onChange = () => {
        setCallNum(callNum+1)
    }

    return(
        <OnChangePlugin onChange={onChange}/>
    )

}