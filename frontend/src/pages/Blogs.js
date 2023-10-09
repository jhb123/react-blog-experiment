import { useRef, useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import placeHolder from "../images/large.jpeg"
import placeHolder2 from "../images/test.png"

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

    const testCards = [cardData1,cardData2, cardData3]

    const [cards, setCards] = useState(testCards );

    const addCard = () => {
      var item = testCards[Math.floor(Math.random()*testCards.length)];
      setCards(cards => [item,...cards] );
    }

    return (
    <>
      <h1>Blog Articles</h1>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={4}>
          <AdminControlPanel addCard={addCard}>
          </AdminControlPanel>
        </Grid>
        {cards.map((item,index) =>
          <Grid item xs={4}>
            <BlogCard image={item[0]} title = {item[1]} blurb={item[2]}></BlogCard>
          </Grid>
        )}
      </Grid>

    </>
    )
  };
  
  const AdminControlPanel = ({addCard}) => {
    return(
      <Paper sx={{
        background: "#aaaaaa",
        display: "flex", 
        flexDirection:"column", 
        alignItems: "center",
        justifyContent: "space-around",
        maxWidth: 345, 
        height:"100%", 
        p:2 
        }}>
        <Typography color="tool" variant='h5'>Admin Controls</Typography>
        <Button color="tool" variant="contained" onClick={addCard}>Create</Button>
      </Paper>
    )
  }

  const BlogCard = ({image, title, blurb}) => {

    return(
      <Card sx={{ 
          maxWidth: 345, 
          minHeight: 345, 
          height:"100%", 
          display:"flex", 
          flexDirection: "column", 
          justifyContent: "space-around",
          ':hover': {
            boxShadow: 10, // theme.shadows[20]
          },
          }}>
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