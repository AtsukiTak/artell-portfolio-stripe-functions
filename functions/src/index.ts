import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
admin.initializeApp();
import express = require('express');
import cors = require('cors');

import {create as createCustomer, get as getCustomer} from './customer';
import {create as createCard} from './card';
import {create as createCharge, get as getCharges} from './charge';

const app = express();
app.use(cors());
app.use(express.json());
app.post('/customers', createCustomer);
app.get('/customers/:customerId', getCustomer);
app.post('/customers/:customerId/cards', createCard);
app.post('/customers/:customerId/charges', createCharge);
app.get('/customers/:customerId/charges', getCharges);

export const stripe = functions.https.onRequest(app);
