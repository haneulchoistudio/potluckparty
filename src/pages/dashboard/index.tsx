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
  inbox: any[];
};

export default function Dashboard({ user, events, inbox }: Props) {
  return (
    <div className="p-8 grid lg:grid-cols-12 gap-8 lg:gap-12 relative">
      <header className="lg:col-span-12 flex justify-between md:justify-start md:gap-x-5 items-center w-full">
        <h1 className="font-bold text-xl lg:text-2xl uppercase tracking-[0.1rem]">
          Dashboard
        </h1>
        <nav className="flex items-center gap-x-2.5 md:w-full md:justify-between">
          <Link
            href={"/events/create"}
            className="flex items-center gap-x-1.5 text-emerald-500 lg:hover:text-emerald-700 font-medium"
          >
            <span> Create New</span>
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
          <ul></ul>
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

  if (user.data.events.length >= 1) {
    const eventsDocs = await db("events");

    events = await Promise.all(
      user.data.events.map(async (event) => {
        return (await eventsDocs.findOne({ _id: event })) as Event;
      })
    );
  }

  return { props: { user, events, inbox: [] } };
};
