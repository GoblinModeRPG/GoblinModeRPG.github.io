import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import pkg from 'agora-token';
const { RtcTokenBuilder, RtcRole } = pkg;

const app = express();
const PORT = 8000;

dotenv.config();
app.use(cors());
app.use(express.json());

const appId = process.env.AGORA_APP_ID;
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

app.get('/rtc/:channelName/:role/uid/:uid/', (req, res) => {
  const channelName = req.params.channelName;
  const uid = parseInt(req.params.uid) || 0;
  const roleString = req.params.role;
  const expiry = parseInt(req.query.expiry) || 3600;

  if (!appId || !appCertificate) {
    return res.status(500).json({ 
      error: 'Server configuration error: Missing Agora credentials' 
    });
  }

  if (!channelName) {
    return res.status(400).json({ error: 'Channel name is required' });
  }

  const role = roleString === '1' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expiry;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  return res.json({ 
    rtcToken: token,
    appId: appId 
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Agora token server is running' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Agora token server listening on port ${PORT}`);
});
