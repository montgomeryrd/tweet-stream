import openSocket from 'socket.io-client';
import './App.css';

function App() {
  const tweetStream = document.getElementById('tweetStream');
  const ENDPOINT = 'http://localhost:5000';

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
    tweetElement.className = 'card';
    tweetElement.innerHTML = `
      <div className="card-body">
        <h5 className="card-title">${tweetData.text}</h5>
        <h6 className="card-subtitle">${tweetData.username}</h6>
      
        <a className="btn" href="https://twitter.com/${tweetData.username}/status/${tweetData.id}">
          View Tweet    
        </a>
      </div>
    `;

    tweetStream.appendChild(tweetElement);
  });

  return (
    <div className="App">

      <header className="header-container">
        <h1 className="header-title">Tweet Stream</h1>
      </header>

      <div className="tweets-container">
        <div id="tweetStream"></div>
      </div>

    </div>
  );
}

export default App;