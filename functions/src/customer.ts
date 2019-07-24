import {Request, Response} from 'express';
import * as D from '@mojotech/json-type-validation';
import {stripe} from './stripe';

/*
 * POST /customers
 */
export function create(req: Request, res: Response): Promise<void> {
  return CreateCustomerReqBodyDecoder.runPromise(req.body)
    .then(args => stripe.customers.create(args))
    .then(customer => {
      res.json({customerId: customer.id});
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({msg: 'Invalid payload'});
    });
}

interface CreateCustomerReqBody {
  name: string;
  email: string;
  source: string;
}

const CreateCustomerReqBodyDecoder: D.Decoder<CreateCustomerReqBody> = D.object(
  {
    name: D.string(),
    email: D.string(),
    source: D.string(),
  },
);

/*
 * GET /customers/:customerId
 */
export function get(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;

  return stripe.customers
    .retrieve(customerId)
    .then(customer => {
      res.json(customer);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({msg: 'Invalid customer id'});
    });
}
