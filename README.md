## Deploy

- `firebase functions:config:set stripe.sk="[Stripe live secret key]"`
- `firebase functions:config:set stripe.test.sk="[Stripe test secret key]"`
- `firebase deploy --only functions`
