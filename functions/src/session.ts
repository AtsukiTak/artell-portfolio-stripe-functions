import { Request, Response } from "express";
import * as D from "@mojotech/json-type-validation";
import * as firebase from "firebase-admin";

import { getStripe } from "./stripe";

const firestore = firebase.firestore();
const storage = firebase.storage();

/*
 * POST /session
 */
export function createInLive(req: Request, res: Response): Promise<void> {
  return create(req, res, "live");
}

export function createInTest(req: Request, res: Response): Promise<void> {
  return create(req, res, "test");
}

function create(
  req: Request,
  res: Response,
  mode: "live" | "test"
): Promise<void> {
  return ReqBodyDecoder.runPromise(req.body)
    .then(({ artistUid, artId }) =>
      Promise.all([
        Promise.resolve({ artistUid, artId }),
        fetchArtData(artistUid, artId),
        fetchArtSumbnailUrl(artistUid, artId)
      ])
    )
    .then(([{ artistUid, artId }, art, thumbnailUrl]) =>
      getStripe(mode).checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "required",
        success_url: "https://portfolio.artell.life/_thanks",
        cancel_url: `https://portfolio.artell.life/${artistUid}/${artId}`,
        line_items: [
          {
            name: art.title,
            images: [thumbnailUrl],
            amount: art.salesPriceYen,
            currency: "jpy",
            quantity: 1
          }
        ]
      })
    )
    .then(session => {
      res.json({ id: session.id });
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({ msg: "Invalid Request" });
    });
}

interface ReqBody {
  artistUid: string;
  artId: string;
}

const ReqBodyDecoder: D.Decoder<ReqBody> = D.object({
  artistUid: D.string(),
  artId: D.string()
});

function fetchArtData(artistUid: string, artId: string): Promise<ArtData> {
  return firestore
    .doc(`artists/${artistUid}/arts/${artId}`)
    .get()
    .then(doc => doc.data())
    .then(data => ArtDataDecoder.runPromise(data));
}

interface ArtData {
  title: string;
  salesPriceYen: number;
}

const ArtDataDecoder: D.Decoder<ArtData> = D.object({
  title: D.string(),
  salesPriceYen: D.number()
});

const SumbnailExpireMilliSec: number = 1000 * 60 * 60;

function fetchArtSumbnailUrl(
  artistUid: string,
  artId: string
): Promise<string> {
  return storage
    .bucket()
    .file(`artists/${artistUid}/arts/${artId}/sumbnail.jpg`)
    .getSignedUrl({
      action: "read",
      expires: Date.now() + SumbnailExpireMilliSec
    })
    .then(data => data[0]);
}
