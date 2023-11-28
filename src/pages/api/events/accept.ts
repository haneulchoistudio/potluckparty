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

  const body = req.body as { _id: string; user: User };

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
          emails: event.data.emails.filter(
            (each) => each !== body.user.data.email
          ),
          ids:
            event.data.ids.length >= 1
              ? ([body.user._id, ...event.data.ids] as string[])
              : ([body.user._id] as string[]),
        },
      },
    }
  );

  const usersDocs = await db("users");

  await usersDocs.updateOne(
    { _id: body.user._id },
    {
      $set: {
        data: {
          ...body.user.data,
          events:
            body.user.data.events.length >= 1
              ? [body._id, ...body.user.data.events]
              : [body._id],
        },
      },
    }
  );

  res.status(200).end();
}
