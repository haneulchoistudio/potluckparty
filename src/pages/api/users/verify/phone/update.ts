import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "~/types";
import { db } from "~/server/mongo";

type BodyJson = {
  phone: string;
  _id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body as BodyJson;

  const usersDocs = await db("users");

  const user = (await usersDocs.findOne({ _id: body._id })) as User;

  await usersDocs.updateOne(
    { _id: body._id },
    {
      $set: {
        data: {
          ...user.data,
          phone: body.phone,
          phoneVerified: true,
        },
      },
    }
  );

  res.status(200).end();
}
