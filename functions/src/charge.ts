import {Request, Response} from 'express';
import * as D from '@mojotech/json-type-validation';
import stripe from './stripe';

/*
 * POST /customers/:customerId/charges
 */
export function create(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;

  return CreateChargeReqBodyDecoder.runPromise(req.body)
    .then(({amount, description}) =>
      stripe.charges.create({
        amount: amount,
        description: description,
        currency: 'jpy',
        customer: customerId,
      }),
    )
    .then(carge => {
      res.json({id: carge.id});
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({msg: 'Invalid payload or customer id'});
    });
}

interface CreateChargeReqBody {
  amount: number;
  description: string;
}

const CreateChargeReqBodyDecoder: D.Decoder<CreateChargeReqBody> = D.object({
  amount: D.number(),
  description: D.string(),
});

/*
 * GET /customers/:customerId/charges
 */
export function get(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;

  return stripe.charges
    .list({customer: customerId})
    .then(charges => {
      res.json(charges.data);
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({msg: 'Invalid customer id'});
    });
}
