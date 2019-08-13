import * as functions from 'firebase-functions';
import Stripe = require('stripe');

const liveSecretKey = functions.config().stripe.sk as string;
const testSecretKey = functions.config().stripe.test.sk as string;

const liveStripe = new Stripe(liveSecretKey);
const testStripe = new Stripe(testSecretKey);

export function getStripe(mode: 'live' | 'test'): Stripe {
  if (mode === 'live') {
    return liveStripe;
  } else {
    return testStripe;
  }
}
