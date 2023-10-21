import "./styles.css"
import { useRef, useState, useEffect } from 'react';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $insertNodes,
  createCommand,
  DecoratorNode,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import SerializedLexicalNode from "lexical"
import Button from '@mui/material/Button';
import { put_article_image } from "../requests/articles";
import { BASE_URL } from "../requests/common";
import placeHolder from "../images/test.png"

export function InsertImageTest() {

  const UPLOAD_AND_INSERT_IMAGE_COMMAND = createCommand("insert image");

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerCommand(
      UPLOAD_AND_INSERT_IMAGE_COMMAND,
      (fileObj) => {

        let imageNode = $createImageNode("image", null);
        $insertNodes([imageNode]);

        put_article_image(fileObj).then(function (response){
          let url = `${BASE_URL}/articles/image/${fileObj.name}`
          imageNode.updateURL(url)
          editor.update(() => {})

        }).catch(function (error) {
          console.log(error)
      });

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  

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
      editor.dispatchCommand(UPLOAD_AND_INSERT_IMAGE_COMMAND, fileObj);
    }, false);

    reader.readAsDataURL(fileObj);


  };

  return (
    <Button onClick={onClick} color={"tool"}>
      <InsertPhotoIcon />
      <input
        type='file'
        id='file'
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/png, image/jpeg" />
    </Button>
  )
}

export class ImageNode extends DecoratorNode {
  // essentially copied from the documentation

  __id;
  static __nodeType = "image"

  static getType() {
    return this.__nodeType;
  }

  static clone(node) {
    return new ImageNode(node.__id, node.__url, node.__key);
  }

  constructor(id, url, key) {
    super(key);
    this.__id = id;
    this.__url = url;
  }

  updateURL(url) {
    this.__url = url
  }

  createDOM() {
    // this puts the image in a span. This feels like a nicer way to edit the document
    return document.createElement('span');
  }

  updateDOM() {
    return true;
  }

  decorate() {
    return <ResizableImage className="editor-image" src={this.__url} alt="Loch Lomond" />
  }

  exportJSON()  {
    const jsonObject = {
      type: this.__type,
      version: 1,
  };

    console.log('Trying to export json')
    return jsonObject
  }


}

export function $createImageNode(id, imgData) {
  return new ImageNode(id, imgData);
}
export function $isImageNode(node) {
  return node instanceof ImageNode;
}

function ResizableImage({isEditable = true, src, alt}) {
  
  const [scale, setScale] = useState(1);

  const numWidths = 4

  var imgSrc = (!src)? placeHolder : src

  const onClick = () => {
    if(!isEditable){
      return
    }

    var newScale = (scale+1)
    if(newScale%(numWidths+1) ===0){
      setScale(1);
    }
    else{
      setScale(newScale);
    }
  }

  const calculateWidth = () => {
    return 100*scale/numWidths+"%"
  }

  return(
    <>
      <img width={calculateWidth()} draggable="false" src={imgSrc} alt={alt} onClick={onClick}/>
    </>
  )
  
}