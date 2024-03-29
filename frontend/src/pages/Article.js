import {test_article, get_article} from "../requests/admin"
import { useRef, useState, useEffect } from 'react';
import {useParams } from 'react-router-dom';
import { Container } from '@mui/material';

const Article = () => {
    // return <h1>Home</h1>;
  const [html, setHTML] = useState({__html: ""});
  let params = useParams();

  useEffect(() => {
    async function createMarkup() {
      //let response;
      let response = await get_article(params.article_id)
      const backendHtmlString = response.data

      console.log(backendHtmlString)
      return {__html: backendHtmlString};
      }

      createMarkup().then(result => setHTML(result));
  }, []);
    
  
    return (
    <>
      <Container maxWidth="sm">
        <div dangerouslySetInnerHTML={html} />
      </Container>
    </>)
};

export default Article;