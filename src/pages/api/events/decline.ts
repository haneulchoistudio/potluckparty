import type { NextApiRequest, NextApiResponse } from "next";
import type { Event, User } from "~/types";
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

  const body = req.body as { _id: string; email: string };

  if (!body) {
    res.status(400).end();
    return;
  }

  const eventsDocs = await db("events");

  const event = (await eventsDocs.findOne({ _id: body._id })) as Event;

  await eventsDocs.updateOne(
    { _id: body._id },
    {
      $set: {
        data: {
          ...event.data,
          emails: event.data.emails.filter((each) => each !== body.email),
        },
      },
    }
  );

  res.status(200).end();
}
