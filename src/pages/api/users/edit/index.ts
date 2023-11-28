import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "~/types";
import { db } from "~/server/mongo";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PUT") {
    res.status(400).end();
    return;
  }

  const body = req.body as User;

  if (!body) {
    res.status(400).end();
    return;
  }

  const usersDocs = await db("users");

  await usersDocs.updateOne({ _id: body._id }, { $set: { data: body.data } });

  res.status(200).end();
}
