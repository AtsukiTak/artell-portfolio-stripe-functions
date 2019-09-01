## Commands

### Deploy
- `firebase deploy --only functions`

### Get config
- `firebase functions:config:get`

### Set config
- `firebase functions:config:set stripe.sk="[Stripe secret key]"`
- `firebase functions:config:set stripe.test.sk="[Stripe test secret key]"`

### Others
See `package.json` in `functions` directory


## Notes

### Permission
firebase functions から google cloud storage を操作するとき、特に getSignedUrl を実行するとき、適切な権限が必要になる。
この権限は gcp の IAM API を使用することで付与できる。
詳しい解説はこのリンクを参考のこと。
https://stackoverflow.com/a/53196428/7679205
