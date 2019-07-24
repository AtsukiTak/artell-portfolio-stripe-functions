import {Request, Response} from 'express';
import * as D from '@mojotech/json-type-validation';
import stripe from './stripe';

/*
 * POST /customers/:customerId/charges
 */
export function create(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;

  return CreateChargeReqBodyDecoder.runPromise(req.body)
    .then(args =>
      stripe.charges.create({
        customer: customerId,
        ...args,
      }),
    )
    .then(carge => {
      res.json({id: carge.id});
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({msg: 'Invalid payload or customer id'});
    });
}

interface CreateChargeReqBody {
  amount: number;
  currency: 'jpy';
  source: string;
  description: string;
  shipping: {
    name: string;
    address: {
      country: 'JP';
      postal_code: string;
      state: string;
      line1: string;
      line2: string;
    };
  };
}

const CreateChargeReqBodyDecoder: D.Decoder<CreateChargeReqBody> = D.object({
  amount: D.number(),
  currency: D.constant('jpy'),
  source: D.string().where(
    s => s.startsWith('card_'),
    'expected a card id, got another',
  ),
  description: D.string(),
  shipping: D.object({
    name: D.string(),
    address: D.object({
      country: D.constant('JP'),
      postal_code: D.string(),
      state: D.string(),
      line1: D.string(),
      line2: D.string(),
    }),
  }),
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
      console.log(err);
      res.status(400).json({msg: 'Invalid customer id'});
    });
}
