import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiCalendar, FiClock, FiWatch } from "react-icons/fi";
import { db } from "~/server/mongo";
import { Event, User } from "~/types";

type Props = {
  user: User;
  event: Event;
};

export default function EventDetail({ user, event }: Props) {
  const router = useRouter();

  const [isHost, setIsHost] = useState<boolean>(user._id === event.data.host);

  useEffect(() => {
    router.replace(
      {
        pathname: `/events/${router.query._id as string}`,
        query: { _id: router.query._id as string },
      },
      `/events/${router.query._id as string}`
    );
  }, []);

  return (
    <div className="grid lg:grid-cols-12 relative">
      <header className="lg:col-span-12 flex justify-between md:justify-start md:gap-x-5 items-center w-full bg-white px-8 py-8">
        <h1>
          <Link
            href={"/dashboard"}
            className="flex items-center gap-x-1.5 lg:gap-x-2 font-medium lg:hover:text-neutral-500"
          >
            <FiArrowLeft className="text-lg lg:text-xl" />
            <span>Dashboard</span>
          </Link>
        </h1>
        {isHost && (
          <Link
            href={{
              pathname: `/events/edit`,
              query: {
                _id: event._id as string,
              },
            }}
            as={`/events/edit`}
            className="font-medium text-emerald-500 lg:hover:text-emerald-700 lg:hover:underline lg:text-lg"
          >
            Edit
          </Link>
        )}
      </header>
      <main className="lg:col-span-12 bg-neutral-900 text-white p-8 text-center">
        <h3 className="font-bold text-xl lg:text-2xl mb-1.5 lg:mb-2.5">
          {event.data.name}
        </h3>
        <div className="flex justify-center items-center gap-x-2.5">
          <span className="flex items-center gap-x-1.5">
            <FiCalendar />
            <span>{event.data.date}</span>
          </span>
          <span className="flex items-center gap-x-1.5">
            <FiClock />
            <span>{event.data.time}</span>
          </span>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const _id = ctx.query._id as string;

  if (!_id || !ObjectId.isValid(_id)) {
    return {
      redirect: { destination: "/events/not-found", permanent: false },
    };
  }

  const user = (await getSession(ctx)) as unknown as User;

  const eventsDocs = await db("events");

  const event = (await eventsDocs.findOne({ _id })) as Event;

  return { props: { user, event } };
};
