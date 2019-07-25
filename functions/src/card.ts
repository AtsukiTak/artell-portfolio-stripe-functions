import {Request, Response} from 'express';
import * as D from '@mojotech/json-type-validation';
import stripe from './stripe';

/*
 * POST /customers/:customerId/cards
 */
export function create(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;

  return CreateCardReqBodyDecoder.runPromise(req.body)
    .then(args => stripe.customers.createSource(customerId, args))
    .then(card => {
      res.json({id: card.id});
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({msg: 'Invalid source or customer id'});
    });
}

interface CreateCardReqBody {
  source: string;
}

const CreateCardReqBodyDecoder: D.Decoder<CreateCardReqBody> = D.object({
  source: D.string(),
});

/*
 * GET /customers/:customerId/cards
 */
export function get(req: Request, res: Response): Promise<void> {
  const customerId = req.params.customerId as string;

  return stripe.customers
    .listSources(customerId, {object: 'card'})
    .then(cards => {
      res.json(cards.data);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({msg: 'Invalid customer id'});
    });
}
