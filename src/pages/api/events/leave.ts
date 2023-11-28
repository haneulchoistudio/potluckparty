import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { Event, User } from "~/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PUT") {
    res.status(400).end();
    return;
  }

  const body = req.body as { _id: string; userId: string };

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
          ids: event.data.ids.filter((each) => each !== body.userId),
        },
      },
    }
  );

  const usersDocs = await db("users");

  const user = (await usersDocs.findOne({ _id: body.userId })) as User;

  await usersDocs.updateOne(
    { _id: body.userId },
    {
      $set: {
        data: {
          ...user.data,
          events: user.data.events.filter((each) => each !== body._id),
        },
      },
    }
  );

  res.status(200).end();
}
