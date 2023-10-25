import Editor from "../components/editor";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import placeHolder from "../images/large.jpeg"
import placeHolder2 from "../images/test.png"

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const Blogs = () => {

    const cardData1 = [placeHolder,"Loch Lomond", "blurb"]
    const cardData2 = [placeHolder,"Bonnie Bonnie banks of Loch Lomond", "blurb"]
    const cardData3 = [placeHolder2,"Loch Lomond", "\
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
    "]

    return (
    <>
      <h1>Blog Articles</h1>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={4}>
          <Button variant="contained">Create</Button>
        </Grid>
        <Grid item xs={4}>
          <BlogCard image={cardData1[0]} title = {cardData1[1]} blurb={cardData1[2]}></BlogCard>
        </Grid>
        <Grid item xs={4}>
          <BlogCard image={cardData2[0]} title = {cardData2[1]} blurb={cardData2[2]}></BlogCard>
        </Grid>
        <Grid item xs={4}>
          <BlogCard image={cardData3[0]} title = {cardData2[1]} blurb={cardData3[2]}></BlogCard>
        </Grid>
        <Grid item xs={4}>
          <BlogCard image={cardData1[0]} title = {cardData1[1]} blurb={cardData1[2]}></BlogCard>
        </Grid>
      </Grid>

      <Editor/>
    </>
    )
  };
  

  const BlogCard = ({image, title, blurb}) => {

    return(
      <Card sx={{ maxWidth: 345, height:"100%", display:"flex", flexDirection: "column", justifyContent: "space-around"}}>
        <CardMedia
        sx={{ height: 140 }}
        image={image}
        title="Loch Lomond"
      />
        <CardContent sx={{flexGrow: 1}}>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,}}>
          {blurb}
        </Typography>
      </CardContent>
      <CardActions sx={{justifySelf: "flex-end"}}>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>
    )

  }

  export default Blogs;