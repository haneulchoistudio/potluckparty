import type { NextApiRequest, NextApiResponse } from "next";
import { sendToVerify } from "~/server/twilio";

type BodyJson = {
  to: string;
};

export type ReturnJson = {
  status: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnJson>
) {
  const body = req.body as BodyJson;

  const sentData = await sendToVerify(body.to);

  res.status(200).json({ status: sentData.status });
}
