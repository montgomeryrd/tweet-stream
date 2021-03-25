import { useEffect } from 'react';
import openSocket from 'socket.io-client';
import './App.css';

function App() {
  const ENDPOINT = 'http://localhost:5000';
  
  useEffect(() => {
    const tweetStream = document.getElementById('tweetstream');
    const socket = openSocket(ENDPOINT, { transports : ['websocket'] });

    socket.on('connect', () => {
      console.log(`Connected to server on ${ENDPOINT}`);
    });
  
    socket.on('tweet', (tweet) => {
      const tweetData = {
        id: tweet.data.id,
        text: tweet.data.text,
        username: `@${tweet.includes.users[0].username}`
      };

      const tweetElement = document.createElement('div');
      
      const body = document.createElement('div');
      body.className = 'card-body';
      body.style.fontFamily = 'Arial, Helvetica, sans-serif';
      body.style.padding = `${20}px`;
      body.style.lineHeight = `${1.6}em`;
      body.style.border = `${1}px solid rgb(${230},${230},${230})`;
      body.style.margin = `${20}px ${20}px`;
      body.style.width = `${600}px`;
            
      const username = document.createElement('h5');
      username.style.fontSize = `${1.2}em`;
      username.style.padding = `${10}px ${0}`;
      username.style.color = `rgb(${114},${114},${114})`;
      username.innerHTML = tweetData.username;
            
      const message = document.createElement('p');
      message.style.fontSize = `${1}em`;
      message.style.marginBottom = `${20}px`;
      message.innerHTML = tweetData.text;
            
      const view = document.createElement('a');
      view.className = 'view-link';
      view.style.textDecoration = 'none';
      view.style.padding = `${10}px`;
      view.style.background = `rgb(${47}, ${144}, ${255})`;
      view.style.color = '#fff';
      view.href = `https://twitter.com/${tweetData.username}/status/${tweetData.id}`;
      view.innerHTML = 'View Tweet';
      
      body.appendChild(username);
      body.appendChild(message);
      body.appendChild(view);
      tweetElement.appendChild(body);
      tweetStream.appendChild(tweetElement);
    });
  }, []);

  return (
    <div className="App">

      <header className="header-container">
        <h1 className="header-title">Tweet Stream</h1>
      </header>

      <div className="tweets-container">
        <div id="tweetstream">
        </div>
      </div>

    </div>
  );
}

export default App;