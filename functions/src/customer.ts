import {Request, Response} from 'express';
import * as D from '@mojotech/json-type-validation';
import {stripe} from './stripe';

export function create(
  req: Request,
  res: Response,
): Promise<void> {
  return CreateCustomerArgsDecoder.runPromise(req.body)
    .then(args => stripe.customers.create(args))
    .then(customer => {
      res.json({customerId: customer.id});
    })
    .catch(err => {
      console.error(err);
      res
        .status(400)
        .json({msg: 'Invalid payload or failed to call stripe api'});
    });
}

interface CreateCustomerArgs {
  name: string;
  email: string;
  source: string;
  address: {
    postal_code: string;
    state: string;
    city: string;
    line1: string;
    line2: string;
  };
}

const CreateCustomerArgsDecoder: D.Decoder<CreateCustomerArgs> = D.object({
  name: D.string(),
  email: D.string(),
  source: D.string(),
  address: D.object({
    postal_code: D.string(),
    state: D.string(),
    city: D.string(),
    line1: D.string(),
    line2: D.string(),
  }),
});
