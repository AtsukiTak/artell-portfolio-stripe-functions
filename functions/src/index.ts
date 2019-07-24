import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
admin.initializeApp();
import express = require('express');
import cors = require('cors');

import {create as createCustomer} from './customer';
import {create as createCharge, get as getCharges} from './charge';

const app = express();
app.use(cors());
app.use(express.json());
app.post('/customers', createCustomer);
app.post('/customers/:customerId/charges', createCharge);
app.get('/customers/:customerId/charges', getCharges);

export const stripe = functions.https.onRequest(app);
