import http from 'http';
import path from 'path';
import express from 'express';
import needle from 'needle';
import * as socketio from 'socket.io';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();
const TOKEN = process.env.TWITTER_BEARER_TOKEN;
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client/public', 'index.html'))
});

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id';

const rules = [{ value: 'ETH' }];

const getRules = async () => {
    const response = await needle('get', rulesURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    // console.log(response.body);
    return response.body;
};

const setRules = async () => {
    const data = {
        add: rules,
    };
    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    return response.body;
};

const deleteRules = async (rules) => {
    if (!Array.isArray(rules.data)) return null;
    const ids = rules.data.map((rule) => rule.id);
    const data = {
        delete: {
            ids: ids,
        },
    };
    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    return response.body;
};

const streamTweets = () => {
    const stream = needle.get(streamURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    stream.on('data', (data) => {
        try {
            const json = JSON.parse(data);
            // console.log(json);
            socket.emit('tweet', json);
        } catch (error) {};
    });
    return stream;
};

io.on('connection', async () => {
  let currentRules;
  try {
    //   Get all stream rules
    currentRules = await getRules()
    // Delete all stream rules
    await deleteRules(currentRules)
    // Set rules based on array above
    await setRules()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
  streamTweets(io);
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`.yellow);
});