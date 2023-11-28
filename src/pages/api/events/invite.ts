import type { NextApiRequest, NextApiResponse } from "next";
import type { Event, User } from "~/types";
import { db } from "~/server/mongo";
import { formatPhone, processSms } from "~/server/twilio";
import { getEmailUser, sendEmail } from "~/server/nodemailer";
import { abc } from "~/server/dotenv";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method !== "PUT") {
    res.status(400).end();
    return;
  }

  const body = req.body as { _id: string; email: string; canSms: boolean };

  if (!body) {
    res.status(400).end();
    return;
  }

  const eventsDocs = await db("events");

  const event = (await eventsDocs.findOne({ _id: body._id })) as Event;

  const usersDocs = await db("users");

  const isExistingUser = (await usersDocs.findOne({
    "data.email": body.email,
  })) as User;

  const inviteLink = [req.headers.origin, `events`, body._id].join("/");

  if (isExistingUser) {
    const verifiedPhone =
      (isExistingUser.data.phone as string) &&
      isExistingUser.data.phoneVerified;

    if (verifiedPhone /**&& body.canSms */) {
      // send SMS invitation
      const option = {
        body: `You are invited to the Potluck Party event '${event.data.name}'. To view the event, please go to ${inviteLink}`,
        to: formatPhone(isExistingUser.data.phone as string),
        // from: formatPhone(abc("TWILIO_MESSAGING_SERVICE_PHONE")),
        messagingServiceSid: abc("TWILIO_MESSAGING_SERVICE_SID"),
      };

      let sms = { status: "" };

      try {
        sms = await processSms(option);
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }

      //   if (sms.status !== "sent") {
      //     res.status(500).end();
      //     return;
      //   }
    }
  }

  // send email invitation

  const sent = await sendEmail({
    from: getEmailUser(),
    replyTo: getEmailUser(),
    to: body.email,
    subject: `Email Arrived From ${getEmailUser()}`,
    text: `You are invited to the Potluck Party event '${event.data.name}'.`,
    html: `
    <div>
    <p>
    You are invited to the Potluck Party event '${event.data.name}'. To view the event, please go to <a href='${inviteLink}'>Potluck Party - '${event.data.name}'</a>
    </p>
    </div>
    `,
    attachments: [],
  });

  if (!sent) {
    res.status(500).end();
    return;
  }

  await eventsDocs.updateOne(
    { _id: body._id },
    {
      $set: {
        data: {
          ...event.data,
          emails:
            event.data.emails.length >= 1
              ? [body.email, ...event.data.emails]
              : [body.email],
        },
      },
    }
  );

  res.status(200).end();
}
