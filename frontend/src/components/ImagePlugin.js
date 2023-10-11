import "./styles.css"
import { useRef} from 'react';


import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $insertNodes,
    createCommand,
    DecoratorNode,
    COMMAND_PRIORITY_LOW,
} from 'lexical';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export function InsertImageTest () {
    
    const INSERT_IMAGE_COMMAND = createCommand();

    const [editor] = useLexicalComposerContext();

    editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode("image", payload);
          $insertNodes([imageNode]);
          return false;
        },
        COMMAND_PRIORITY_LOW,
      );

    const selectImage = () => {
        // return( <Button>New</Button>);
    }
    const inputFile = useRef(null) 

    const onClick = () => {
        // selectImage()
        inputFile.current.click();
        // editor.dispatchCommand(INSERT_IMAGE_COMMAND,"test payload");
    }

    const handleFileChange = event => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) {
          return;
        }
        
        event.target.value = null;
            
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            // convert image file to base64 string and save to localStorage
            localStorage.setItem(fileObj.name,reader.result);
            editor.dispatchCommand(INSERT_IMAGE_COMMAND,fileObj.name);

        }, false);

        reader.readAsDataURL(fileObj);
        

      };

    return (
        <Button onClick={onClick} color={"tool"}>
            <Typography>Insert Image</Typography>
            <input 
                type='file' 
                id='file' 
                ref={inputFile} 
                style={{display: 'none'}}
                onChange={handleFileChange}
                accept="image/png, image/jpeg"/>
        </Button>
    )
}

export class ImageNode extends DecoratorNode {
    // essentially copied from the documentation

    __id;
  
    static getType() {
      return 'image';
    }
  
    static clone(node) {
      return new ImageNode(node.__id, node.__fname , node.__key);
    }
  
    constructor(id, imgData, key) {
      super(key);
      this.__id = id;
      this.__fname = imgData;
      this.__imgData = localStorage.getItem(imgData);
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
        console.log("drawing " + this.__fname)
        return <img className="editor-image" src={this.__imgData} alt="Loch Lomond"/>;
    }
  }
  
  // these probably dont need exporting
  export function $createImageNode(id, imgData) {
    return new ImageNode(id, imgData);
  }
  export function $isImageNode(node) {
    return node instanceof ImageNode;
  }
