import {useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import placeHolder from "../images/large.jpeg"
import { useNavigate } from "react-router-dom";

import { sumbitArticleForm, getArticleList, instance } from "../requests/admin"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import {ImpenetrableButton} from "../components/ImpenetrableButton";
// import TextField from '@mui/material/TextField';


const Blogs = () => {

  const cardData1 =
  {
    "article_id": 2, "title": "Loch Lomond", blurb: "blurb txt",
    "creation_date": "2023-11-07T21:31:43", "published_date": "2023-11-07T21:31:43", "is_published": true

  }
  const cardData2 = { "title": "Bonnie Bonnie banks of Loch Lomond", blurb: "blurb txt" }
  const cardData3 = {
    "title": "Loch Lomond", blurb: "\
      By yon bonnie banks and by yon bonnie braes,\
  Where the sun shines bright on Loch Lomond,\
Where me and my true love were ever wont to gae,\
  On the bonnie, bonnie banks o' Loch Lomond.\
  \
  Chorus:\
  O ye'll tak' the high road, and I'll tak' the low road,\
  And I'll be in Scotland afore ye,\
  But me and my true love will never meet again,\
  On the bonnie, bonnie banks o' Loch Lomond.\
  \
      "}

  const testCards = [cardData1, cardData2, cardData3]
  const [cards, setCards] = useState([]);

  const deleteArticle = (article_id) => instance.delete("articles/delete", { params: { article_id: article_id } })
  const publishArticle = (article_id, is_published) => instance.get("articles/publish", { params: { article_id: article_id, is_published: is_published } })

  const handleDelete = async (article_id) => {
    try {
      await deleteArticle(article_id)
      refreshCards()
    } catch (error) {
      console.error(error);
    };

  }
  const refreshCards = async () => {
    try {
      const response = await getArticleList();
      setCards(response.data.concat(testCards))
    } catch (error) {
      console.error(error);
      setCards(testCards)
    }
  };

  // const [data, setData] = 

  useEffect(() => {
    refreshCards()
  }, [])


  const handlePublish = async (article_id, publishState) => {
    try {
      await publishArticle(article_id, publishState)
      refreshCards()
    } catch (error) {
      console.error(error);
    };
  }

  return (
    <>
      <h1>Blog Articles</h1>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={4}>
          <AdminControlPanel onSubmitArticle={() => refreshCards()}>
          </AdminControlPanel>
        </Grid>
        {cards.map((item, index) =>
          <Grid key={index} item xs={4}>
            <BlogCard
              image={item["title_image"]}
              title={item["title"]}
              blurb={item["blurb"]}
              creation_date={item["creation_date"]}
              published_date={item["published_date"]}
              is_published={item["is_published"]}
              article_id={item["article_id"]}
              handleDelete={() => handleDelete(item["article_id"])}
              handlePublish={handlePublish}
            ></BlogCard>
          </Grid>
        )}
      </Grid>

    </>
  )
};

const AdminControlPanel = ({ onSubmitArticle }) => {


  const [canSubmit, setCanSubmit] = useState(false)

  const [fileInputText, setFileInputText] = useState("Choose Files")

  const onFieldChange = () => {
    let elements = document.getElementById("articleForm").getElementsByTagName("input")
    let values = [];
    let fileCount = 0;

    for (const element of elements) {
      if (element.type !== "button") {
        if (element.value) {
          values.push(`${element.id}, ${element.value}`)
        }
        if (element.files) {
          fileCount = element.files.length
        }
      }
    };

    setCanSubmit(values.length > 0)

    fileCount === 0 ? setFileInputText("Choose Files") : setFileInputText(`Upload ${fileCount} Files `)
    setCanSubmit(values.length > 0)
  }

  const onSubmit = async (event) => {
    try {
      await sumbitArticleForm(event);
    } catch (error) {
      console.log(error)
    } finally {
      document.getElementById("articleForm").reset();
      setCanSubmit(false)
      setFileInputText("Choose files")
      await onSubmitArticle()
    }
  }

  return (
    <Paper sx={{ background: "#aaaaaa", display: "flex", flexDirection: "column", maxWidth: 345, height: "100%", p: 2 }}>
      <form id="articleForm" onSubmit={onSubmit}>
        <Box sx={{ display: "flex", flexWrap: 'wrap', flexDirection: "column", alignItems: "left", justifyContent: "space-around", gap: 1, width: "100%" }}>
          <Typography color="tool" variant='h5'>Article Manager</Typography>
          <ArticleFormControl field_name="article_id" onChange={onFieldChange} type="number"></ArticleFormControl>
          <ArticleFormControl field_name="title" onChange={onFieldChange}></ArticleFormControl>
          <ArticleFormControl field_name="title_image" onChange={onFieldChange}></ArticleFormControl>
          <TextField field_name="blurb" fullWidth id="blurb" aria-describedby="blurb" label="blurb" onChange={onFieldChange} multiline rows={5}></TextField>
          <Button color="tool" variant="contained" component="label" startIcon={<CloudUploadIcon />}>
            {fileInputText}
            <input onChange={onFieldChange} id="articleFiles" type="file" accept="text/markdown, .md, .markdown, image/png, image/jpeg" multiple hidden />
          </Button>
          <Button color="tool" variant="contained" component="label" disabled={!canSubmit}>
            Submit
            <input type="submit" hidden></input>
          </Button>
        </Box>
      </form>
    </Paper>
  )
}


const ArticleFormControl = ({ field_name, onChange, type = "" }) => {
  return (
    <>
      <FormControl fullWidth sx={{ width: '100%' }}>
        <InputLabel size="small" htmlFor={field_name}>{field_name}</InputLabel>
        <OutlinedInput
          id={field_name}
          aria-describedby={field_name}
          label={field_name}
          size="small"
          onChange={onChange}
          type={type}
        />
      </FormControl>
    </>
  )
  // return (
  //   <TextField id={field_name}
  //       aria-describedby={field_name}
  //       label={field_name}
  //       size="small"
  //       onChange={onChange}
  //       type={type}></TextField>
  // )
}

const BlogCard = ({ image, title, blurb, creation_date, published_date, article_id, is_published, handleDelete, handlePublish }) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const published_date_friendly = (new Date(published_date)).toLocaleString('en-UK', options);
  const theme = useTheme();

  const navigate = useNavigate();
  const navigateTo = () => navigate(`/Article/${article_id}`);//eg.history.push('/login');

  return (
    <Card

      sx={{
        maxWidth: 345,
        minHeight: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        ':hover': {
          boxShadow: 10, // theme.shadows[20]
        },
        backgroundColor: is_published ? "" : theme.palette.warning.light
      }}
      onClick={navigateTo}
    >
      <CardMedia
        sx={{ height: 140 }}
        image={image ? `/articles/${article_id}/image/${image}` : placeHolder}
        title={image}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5">
          {title}
        </Typography>
        <Typography gutterBottom variant="body1">
          {published_date_friendly}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
        }}>
          {blurb}
        </Typography>
        <Typography gutterBottom variant="body2" component="div" color="common.white" sx={{ backgroundColor: theme.palette.tool.main }}>
          Article: #{article_id} | Created: {creation_date} | Image {`/articles/${article_id}/images/${image}`}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifySelf: "flex-end" }}>
        <ImpenetrableButton size="small">Share</ImpenetrableButton>
        <ImpenetrableButton onClick={() => {
          handlePublish(article_id, !is_published)
        }} size="small" color="tool" variant="contained">{is_published ? "Unpublish" : "Publish"}</ImpenetrableButton>
        <ImpenetrableButton size="small" color="tool" variant="contained" onClick={handleDelete}>Delete</ImpenetrableButton>
      </CardActions>
    </Card>
  )

}



export default Blogs;