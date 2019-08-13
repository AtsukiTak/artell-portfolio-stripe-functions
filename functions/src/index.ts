import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
admin.initializeApp();
import express = require('express');
import cors = require('cors');

import * as session from './session';

const app = express();
app.use(cors());
app.use(express.json());
app.post('/session', session.createInLive);
app.post('/test/session', session.createInTest);

export const stripe = functions.https.onRequest(app);
