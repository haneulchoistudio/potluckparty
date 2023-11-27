import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/mongo";
import { EventProps, User } from "~/types";

type ReturnJson = {
  _id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnJson>
) {
  const event = req.body as EventProps;

  const eventsDocs = await db("events");

  const { insertedId } = await eventsDocs.insertOne({
    _id: new ObjectId().toString(),
    data: event,
  });

  const usersDocs = await db("users");

  const host = (await usersDocs.findOne({ _id: event.host })) as User;

  await usersDocs.updateOne(
    { _id: event.host },
    {
      $set: {
        data: {
          ...host.data,
          events:
            host.data.events.length >= 1
              ? ([insertedId, ...host.data.events] as string[])
              : ([insertedId] as string[]),
        },
      },
    }
  );

  res.status(200).json({
    _id: insertedId as string,
  });
}
