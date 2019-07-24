import * as functions from 'firebase-functions';
import Stripe = require('stripe');

const secretKey = functions.config().stripe.sk as string;

export const stripe = new Stripe(secretKey);
export default stripe;
