import { Container, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import cv from '../static/cv.json'
import { Box } from '@mui/system';
import Stack from '@mui/material/Stack';
import "../styles.css"


const Home = () => {

  return (<>
    <Container maxWidth="sm">
      <h1>Welcome!</h1>
      <p>This is a place for me to write about what interests me and this includes technical challenges I face while programming, cryptic crosswords and the outdoors. But who knows, maybe I'll have a go at creative writing.</p>
      <p>
        Here are my various links
      </p>
      <ul>
        <li>
          Check out my programming projects at <a href="https://github.com/jhb123">https://github.com/jhb123</a>
        </li>
        <li>
          Email me at <Link onClick={() => window.location = 'mailto:jhbriggs23@gmail.com'}>jhbriggs23@gmail.com</Link>
        </li>
        <li>
          Connect with me on <a href="https://www.linkedin.com/in/joseph-briggs-123abc">https://www.linkedin.com/in/joseph-briggs-123abc</a>
        </li>
      </ul>
    </Container>
    <Container maxWidth="md">
      <CV />
    </Container>
  </>);
};

const CV = () => {
  return (

    <Stack spacing={4} sx={{ pb: 12 }}>
      <Typography variant="h2">CV</Typography>
      <Typography variant="body1" textAlign="justify">{cv["intro"]}</Typography>
      <Typography variant="h4">Skills</Typography>
      <CVSkillsGrid skills={flattenMap(cv['skills'])} />
      <Typography variant="h4">Experience</Typography>
      <CVJob item={cv['jobs']['evertz']}></CVJob>
      <CVJob item={cv['jobs']['motorola']}></CVJob>
      <CVJob item={cv['jobs']['ouster']}></CVJob>
      <CVJob item={cv['jobs']['caltech']}></CVJob>
      <Typography variant="h4">Education</Typography>
      <CVEducation item={cv['education']['phd']}></CVEducation>
      <CVEducation item={cv['education']['undergrad']}></CVEducation>
      <Typography variant="h4">Projects</Typography>
      <CVProgrammingProject item={cv['programming projects']['CrosswordScan']} />
      <CVProgrammingProject item={cv['programming projects']['enhance_greyscale']} />
      <Typography variant="h4">Interests</Typography>
      <Typography variant="body1" textAlign="justify">{cv['interests']}</Typography>
    </Stack>
  )
}

const CVSkillsGrid = ({ skills }) => {
  return (
    <Grid container spacing={2}>
      {skills.map((item, index) => <CVSkillsGridItem key={item} item={item} />)}
    </Grid>);
}

const CVSkillsGridItem = ({ item }) => {
  return <Grid item xs={3}>
    <Paper sx={{ p: 1, height: "100%" }}>
      <Typography variant="body2" align='center' sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "2em", justifyContent: "center" }}>{item}</Typography>
    </Paper>
  </Grid>
}

const CVProgrammingProject = ({ item }) => {
  return (
    <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography variant='subtitle1' className='cvLeft'>{item["name"]}</Typography>
        <div className='cvRight'>
          <Typography variant='body1'>{item["blurb"]}</Typography>
          <ul>
            {item["links"].map((val, index) => <li key={index}><Link href={val}variant='body2'>{val}</Link></li>)}
          </ul>
        </div>
      </div>
    </>
  )
}

const CVJob = ({ item }) => {
  return (
    <>
      <Typography variant="h5">{item["company"]}</Typography>
      {item["roles"].map((val, index) => <CVRole item={val} key={index} />)}
    </>
  )
}

const CVRole = ({ item }) => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography variant='subtitle1' className='cvLeft'>{item["title"]}</Typography>
        <div className='cvRight'>
          <Typography variant='body1'>{item["dates"]}</Typography>
          <Typography variant='body1'>{item["blurb"]}</Typography>
          <ul>
            {item["highlights"].map((val, index) => <li key={index}><Typography variant='body2'>{val}</Typography></li>)}
          </ul>
        </div>
      </div>
    </>)
}
const CVEducation = ({ item }) => {
  return (
    <>
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Typography variant='subtitle1' sx={{display: "block", width: "30%", pl: 8, pr: 2}}>{item["degree"]}</Typography>
        <div style={{ padding: "0px 0px 0px 16px", width: "70%" ,display: "inline", textAlign:"justify" }}>
          <Typography variant='body1' display="inline">{item["dates"]}</Typography>
          <Typography variant='body1'>{item["university"]}</Typography>
          <Typography variant='body1'>{item["grade"]}</Typography>
          <ul>
            {item["highlights"].map((val, index) => <li key={index}><Typography variant='body2'>{val}</Typography></li>)}
          </ul>
        </div>
      </div>
    </>
  )
}


function flattenMap(input_data) {
  if (Array.isArray(input_data)) {
    return input_data
  } else {
    let output = []
    let sub_map = Array.from(Object.values(input_data));
    for (const val of sub_map) {
      output = output.concat(flattenMap(val))
    }
    return output
  }
}


export default Home;