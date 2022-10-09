import { gql, useQuery, useMutation } from '@apollo/client'
import { Button, Container, List, ListItem, ListItemText, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/system';

const GET_MESSAGES = gql`
  query{
    messages {
      id,
      author,
      text
      spam
    }
  }
`
const POST_MESSAGE = gql`
  mutation($author: String!, $text: String!){
    postMessage(author: $author, text: $text)
  }
`


function App() {
  var regEmail = /\S+@\S+\.\S+/;

  const [message, setMessage] = useState({author: '', text: ''})
  const [error, setError] = useState(false)
  const { data, startPolling } = useQuery(GET_MESSAGES)
  const [ postMessage ] = useMutation(POST_MESSAGE)

  useEffect(() => {
    setError(message.author.length != 0 && !regEmail.test(message.author))
  }, [message])
  

  const onSend = () => {
    if(message.author.length != 0 && message.text.trim().length != 0 && !error){
      postMessage({variables: message})
      setMessage({author: '', text: ''})
    }
  }

  useEffect(() => {
    startPolling(500)
  }, [])
  

  return (
    <Container>
      <List>
        {
          data && data.messages.map((message, idx) =>
          <ListItem key={idx}>
            <ListItemText primary={`${message.author} ${message.spam ? 'СПАМ' : ''}`} secondary={message.text}>
            </ListItemText>
          </ListItem>)
        }
      </List>
      <Stack sx={{gap: '20px'}}>
        <TextField sx={{maxWidth: '400px'}} label='E-mail' error={error} onChange={(e) => { setMessage({ ...message, author: e.target.value }) }}/>
        <TextField multiline label='Text' onChange={(e) => { setMessage({ ...message, text: e.target.value }) }}/>
        <Button variant='contained' sx={{alignSelf: 'end', width: '300px'}} onClick={()=> onSend()}>Отправить</Button>
      </Stack>
    </Container>
  );
}

export default App;
