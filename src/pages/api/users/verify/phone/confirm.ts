import type { NextApiRequest, NextApiResponse } from "next";
import { sendToCheckVerification } from "~/server/twilio";

type BodyJson = {
  to: string;
  code: string;
};

export type ReturnJson = {
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnJson>
) {
  const body = req.body as BodyJson;

  const sentData = await sendToCheckVerification(body.to, body.code);

  res.status(200).json({ status: sentData.status });
}
