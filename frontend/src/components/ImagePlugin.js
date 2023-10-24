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

        let imageNode = $createImageNode("image", null, null, null);
        $insertNodes([imageNode]);

        put_article_image(fileObj).then(function (response){
          let url = `${BASE_URL}/articles/image/${fileObj.name}`
          imageNode.setUrl(url)
          editor.update(() => {})

        }).catch(function (error) {
          console.log(error)
      });

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  
  const inputFile = useRef(null)

  const onClick = () => {
    inputFile.current.click();
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
    return new ImageNode(node.__id, node.__url, node.__key, node.__scale);
  }

  constructor(id, url, key, scale) {
    super(key);
    this.__id = id;
    this.__url = url;
    this.__scale = scale ?? 1; // a number between 0 and 1, hopefully.

  }

  setUrl = (url) => this.__url = url
  getUrl = () => this.__url

  setScale = (scale) => this.__scale = scale
  getScale = () => this.__scale
  

  createDOM() {
    // this puts the image in a span. This feels like a nicer way to edit the document
    return document.createElement('span');
  }

  updateDOM() {
    return true;
  }

  decorate() {
    return <ResizableImage className="editor-image" node={this} alt="Loch Lomond" />
  }

  exportJSON()  {
    const jsonObject = {
      type: this.__type,
      id: this.__id,
      url: this.__url,
      scale: this.__scale,
      key: this.__key,
      version: 1,
  };

    console.log('Trying to export json')
    return jsonObject
  }

  static importJSON(serializedNode) {
    console.log(serializedNode)
    return $createImageNode(serializedNode.id, serializedNode.url, null, serializedNode.scale)
  }


}

export function updateImageNodeScale(imageNode, scale) {
  imageNode.setScale(scale)
  imageNode.updateDOM()
}

export function $createImageNode(id, imgData, key, scale) {
  return new ImageNode(id, imgData, key, scale);
}
export function $isImageNode(node) {
  return node instanceof ImageNode;
}

function ResizableImage({isEditable = true, node, alt}) {

  // this represents how many possible widths there are and its used
  // to normalise calculations and keep track of a choice.
  const maxWidth = 4

  // default to the smallest width if there is no scale provided. However,
  // image nodes have a default scale of 1 (i.e. as big as possible) so its 
  // unlikely to need the default here. 
  const [width, setWidth] = useState( node.getScale()*maxWidth ?? 1 );

  var imgSrc = node.getUrl() ?? placeHolder

  const onClick = () => {
    // I didn't think of a better way to do this. This function handles
    // updating the UI and updating the underlying data.
    if(!isEditable){
      return
    }

    var newWidth = (width+1)
    if(newWidth%(maxWidth+1) ===0){
      setWidth(1);
      updateImageNodeScale(node,1/maxWidth)
    }
    else{
      setWidth(newWidth);
      updateImageNodeScale(node,newWidth/maxWidth)
    }
  }

  const calculateWidth = () => 100*width/maxWidth+"%"

  return(
    <>
      <img width={calculateWidth()} draggable="false" src={imgSrc} alt={alt} onClick={onClick}/>
    </>
  )
  
}