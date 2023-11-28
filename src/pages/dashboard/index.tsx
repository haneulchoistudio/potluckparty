import type { Event, User } from "~/types";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { db } from "~/server/mongo";
import { EventCard } from "~/components/dashboard";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { ProfileMenu } from "~/components/core";

type Props = {
  user: User;
  events: Event[];
  inbox: {
    _id: string;
    name: string;
    pathname: string;
    date: string;
    time: string;
  }[];
};

export default function Dashboard({ user, events, inbox }: Props) {
  return (
    <div className="px-8 py-5 lg:py-6 grid lg:grid-cols-12 gap-8 lg:gap-12 relative">
      <header className="lg:col-span-12 flex justify-between md:justify-start md:gap-x-5 items-center w-full">
        <h1 className="font-bold text-xl lg:text-2xl uppercase tracking-[0.1rem]">
          Dashboard
        </h1>
        <nav className="flex items-center gap-x-3.5 md:w-full md:justify-between">
          <Link
            href={"/events/create"}
            className="text-neutral-700 lg:hover:text-neutral-500 lg:hover:underline lg:text-lg flex items-center gap-x-1.5"
          >
            <span> Create Event</span>
            <FiPlus />
          </Link>
          <ProfileMenu
            isOnFreePlan={user.data.subscription === "free"}
            image={user.data.image}
          />
        </nav>
      </header>
      <main className="col-span-1 lg:col-span-8 w-full">
        <ul className="gap-5 lg:gap-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event, idx) => (
            <EventCard
              key={idx}
              _id={event._id}
              amIHost={event.data.host === user._id}
              {...event.data}
            />
          ))}
        </ul>
      </main>
      <main className="lg:col-span-4 border w-full h-full p-8 rounded bg-neutral-50">
        <h3 className="font-medium text-xl lg:text-2xl mb-2.5 lg:mb-4">
          My Inbox
        </h3>

        {inbox.length >= 1 ? (
          <ul className="flex flex-col w-full">
            {inbox.map((each, idx) => (
              <div key={idx}>
                <h4 className="text-sm lg:text-base mb-1">{each.name}</h4>
                <div className="flex justify-between items-center gap-x-5">
                  <p className="text-xs font-light text-neutral-600">
                    <span>{each.date}</span>, <span>{each.time}</span>
                  </p>
                  <Link
                    href={{ pathname: each.pathname, query: { _id: each._id } }}
                    as={each.pathname}
                    className="text-sm font-medium text-emerald-500 underline lg:no-underline lg:hover:underline lg:hover:text-emerald-700"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">Your inbox is empty.</p>
        )}
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  let events: Event[] = [];
  const eventsDocs = await db("events");

  if (user.data.events.length >= 1) {
    events = await Promise.all(
      user.data.events.map(async (event) => {
        return (await eventsDocs.findOne({ _id: event })) as Event;
      })
    );
  }

  let inbox: any[] = [];

  inbox = await eventsDocs.find({ "data.emails": user.data.email }).toArray();

  inbox = inbox.map((each) => ({
    _id: each._id,
    pathname: `/events/${each._id}`,
    name: each.data.name,
    date: each.data.date,
    time: each.data.time,
  }));

  return { props: { user, events, inbox } };
};
