import type { NextApiRequest, NextApiResponse } from "next";
import type { Event } from "~/types";
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

  const body = req.body as Event;

  if (!body) {
    res.status(400).end();
    return;
  }

  const eventsDocs = await db("events");

  await eventsDocs.updateOne({ _id: body._id }, { $set: { data: body.data } });

  res.status(200).end();
}
