import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useState, useEffect } from "react";

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