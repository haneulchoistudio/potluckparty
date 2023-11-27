import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { db } from "~/server/mongo";
import { Event, User } from "~/types";

type Props = {
  user: User;
  event: Event;
  _id: string;
};

export default function EventEdit({ user, event, _id }: Props) {
  return (
    <div className="grid lg:grid-cols-12 relative">
      <header className="lg:col-span-12 flex justify-between md:justify-start md:gap-x-5 items-center w-full bg-white px-8 py-8">
        <h1>
          <Link
            href={{
              pathname: `/events/${_id}`,
              query: { _id },
            }}
            as={`/events/${_id}`}
            className="flex items-center gap-x-1.5 lg:gap-x-2 font-medium lg:hover:text-neutral-500"
          >
            <FiArrowLeft className="text-lg lg:text-xl" />
            <span>Event Detail</span>
          </Link>
        </h1>
        <ul className="flex items-center gap-x-2.5 lg:gap-x-3.5">
          <button
            type="button"
            className="font-medium text-red-500 lg:hover:text-red-400 lg:hover:underline lg:text-lg"
          >
            Reset
          </button>
          <button
            type="button"
            className="font-medium text-emerald-500 lg:hover:text-emerald-700 lg:hover:underline lg:text-lg"
          >
            Save
          </button>
        </ul>
      </header>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const _id = ctx.query._id as string;

  if (!_id || !ObjectId.isValid(_id)) {
    return {
      redirect: {
        destination: "/events/not-found",
        permanent: false,
      },
    };
  }

  const user = (await getSession(ctx)) as unknown as User;

  if (!user.data.events.includes(_id)) {
    return {
      redirect: {
        destination: `/events/${_id}`,
        permanent: false,
      },
    };
  }

  const eventsDocs = await db("events");

  const event = (await eventsDocs.findOne({ _id })) as Event;

  if (user._id !== event.data.host) {
    return {
      redirect: {
        destination: `/events/access-not-allowed`,
        permanent: false,
      },
    };
  }

  return { props: { user, event, _id } };
};
