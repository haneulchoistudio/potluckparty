import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PiSignOutFill } from "react-icons/pi";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMail,
  FiMap,
  FiMapPin,
  FiPlus,
  FiWatch,
} from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { ProfileImage } from "~/components/core";
import { Guests, Invitation, Menus } from "~/components/detail";
import { db } from "~/server/mongo";
import { Event, Menu, User } from "~/types";

type Props = {
  user: User;
  host: User;
  menu: Menu;
  event: Event;
  guests: User[];
};

export default function EventDetail({
  user,
  host,
  event,
  menu,
  guests,
}: Props) {
  const router = useRouter();

  const [isHost, setIsHost] = useState<boolean>(user._id === event.data.host);

  async function leave() {
    if (!isHost) {
      const confirmLeave = confirm(
        `Are you sure you want to leave ${event.data.name}?`
      );

      const response = await fetch("/api/events/leave", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: event._id, userId: user._id }),
      });

      if (!response.ok) {
        return;
      }

      await router.push("/dashboard");
      return;
    }
  }

  return (
    <div className="grid lg:grid-cols-12 relative">
      <header className="lg:col-span-12 flex justify-between md:justify-start md:gap-x-5 items-center w-full bg-white px-8 py-5 lg:py-6">
        <h1 className="lg:text-lg">
          <Link
            href={"/dashboard"}
            className="flex items-center gap-x-1.5 lg:gap-x-2.5 font-medium lg:hover:text-neutral-500"
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
            className="text-emerald-500 lg:hover:text-emerald-700 lg:hover:underline lg:text-lg"
          >
            Edit
          </Link>
        )}
        {!isHost && (
          <button
            type="button"
            onClick={leave}
            className="font-medium text-red-500 lg:hover:text-red-400 lg:hover:underline lg:text-lg flex items-center gap-x-2.5"
          >
            <span>Leave the group</span>
            <PiSignOutFill />
          </button>
        )}
      </header>
      <>
        {![event.data.host, ...event.data.ids].includes(user._id as string) &&
        event.data.emails.includes(user.data.email) ? (
          <Invitation
            _id={event._id as string}
            name={event.data.name}
            user={user}
          />
        ) : (
          <>
            <main className="lg:col-span-12 bg-neutral-900 text-white p-8 py-16 lg:py-24 text-center">
              <h3 className="font-bold text-xl md:text-2xl lg:text-3xl 2xl:text-4xl mb-1.5 lg:mb-2.5 max-w-[1080px] mx-auto text-center">
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
            <main className="lg:col-span-12 w-full max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-8 flex flex-col gap-y-8 lg:gap-y-12">
                <Guests
                  _id={event._id as string}
                  guests={guests}
                  emails={[
                    host.data.email,
                    ...guests.map((each) => each.data.email),
                    ...event.data.emails,
                  ]}
                />
                <Menus menu={menu} />
                {/* <section>
            <div className="mb-2.5 lg:mb-4">
              <div className="flex justify-between items-center mb-1 lg:mb-2">
                <h4 className="font-medium text-xl lg:text-2xl">
                  Potluck Menu
                </h4>
                <Link
                  href={"/events/create"}
                  className="flex items-center gap-x-1.5 text-emerald-500 lg:hover:text-emerald-700 lg:hover:font-medium"
                >
                  <span>Add</span>
                  <FiPlus />
                </Link>
              </div>
              <ul className="flex items-center gap-x-2.5">
                <button
                  onClick={() => setMenuView("appetizers")}
                  type="button"
                  className={twMerge(
                    "text-sm py-2 rounded border",
                    menuView === "appetizers"
                      ? "px-4 border-emerald-700 text-emerald-700"
                      : "px-0 border-transparent text-emerald-500 lg:hover:text-emerald-700"
                  )}
                >
                  Appetizers
                </button>
                <button
                  onClick={() => setMenuView("mains")}
                  type="button"
                  className={twMerge(
                    "text-sm py-2 rounded border",
                    menuView === "mains"
                      ? "px-4 border-emerald-700 text-emerald-700"
                      : "px-0 border-transparent text-emerald-500 lg:hover:text-emerald-700"
                  )}
                >
                  Mains
                </button>
                <button
                  onClick={() => setMenuView("desserts")}
                  type="button"
                  className={twMerge(
                    "text-sm py-2 rounded border",
                    menuView === "desserts"
                      ? "px-4 border-emerald-700 text-emerald-700"
                      : "px-0 border-transparent text-emerald-500 lg:hover:text-emerald-700"
                  )}
                >
                  Desserts
                </button>
              </ul>
            </div>
            <p className="text-red-500">
              There is no {menuView.slice(0, -1)} in the potluck.
            </p>
          </section> */}
                <section className="p-8 rounded border">
                  <h4 className="font-medium text-xl lg:text-2xl mb-2.5 lg:mb-4">
                    Description
                  </h4>
                  <p className="text-neutral-600 leading-[1.67]">
                    {event.data.description} Lorem ipsum, dolor sit amet
                    consectetur adipisicing elit. Adipisci fugit repellat
                    exercitationem, expedita deleniti ipsam quidem nostrum dicta
                    quae dignissimos quaerat quos porro veniam impedit cumque
                    sunt vel commodi id?{" "}
                  </p>
                </section>
              </div>
              <div className="lg:col-span-5 px-8 pb-8 lg:py-8 flex flex-col gap-y-8">
                <section className="p-8 rounded border">
                  <div className="flex justify-between items-center mb-2.5 lg:mb-4">
                    <h4 className="font-medium text-xl lg:text-2xl">
                      Event Address
                    </h4>
                    <button
                      type="button"
                      className="w-[37.5px] h-[37.5px] rounded-full border bg-emerald-500/5 border-emerald-500/25 text-emerald-500 flex justify-center items-center lg:hover:bg-emerald-700 lg:hover:border-emerald-700 lg:hover:text-white"
                    >
                      <FiMapPin className="text-lg lg:text-xl" />
                    </button>
                  </div>
                  <p className="text-neutral-600">{event.data.address}</p>
                </section>
                <section className="p-8 rounded border">
                  <div className="flex justify-between items-center mb-2.5 lg:mb-4">
                    <h4 className="font-medium text-xl lg:text-2xl">
                      About Host
                    </h4>
                    <button
                      type="button"
                      className="w-[37.5px] h-[37.5px] rounded-full border bg-emerald-500/5 border-emerald-500/25 text-emerald-500 flex justify-center items-center lg:hover:bg-emerald-700 lg:hover:border-emerald-700 lg:hover:text-white"
                    >
                      <FiMail className="text-lg lg:text-xl" />
                    </button>
                  </div>
                  <div className="flex items-center justify-start gap-x-2.5">
                    <ProfileImage image={host.data.image} />
                    <h5 className="font-medium">{host.data.name}</h5>
                  </div>
                </section>
              </div>
            </main>
          </>
        )}
      </>
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

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const eventsDocs = await db("events");

  const event = (await eventsDocs.findOne({ _id })) as Event;

  let guests: User[] = [];

  const usersDocs = await db("users");
  if (event.data.ids.length >= 1) {
    guests = await Promise.all(
      event.data.ids.map(async (guest) => {
        return (await usersDocs.findOne({ _id: guest })) as User;
      })
    );
  }

  let host: User;

  if (user._id === event.data.host) {
    host = user;
  } else {
    host = (await usersDocs.findOne({ _id: event.data.host })) as User;
  }

  const menusDocs = await db("menus");

  const menu = (await menusDocs.findOne({ _id: event.data.menu })) as Menu;

  return { props: { user, event, guests, host, menu } };
};
