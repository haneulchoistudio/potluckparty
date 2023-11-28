import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { db } from "~/server/mongo";
import { Event, EventProps, User } from "~/types";

type Props = {
  user: User;
  event: Event;
  _id: string;
};

export default function EventEdit({ user, event, _id }: Props) {
  const router = useRouter();

  const [o, setO] = useState<EventProps>(event.data);
  const [n, setN] = useState<EventProps>(event.data);
  const [diff, setDiff] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function reset() {
    if (diff) {
      setN(o);
    }
  }

  async function save() {
    setError("");
    setStatus("Saving...");
    if (!diff) {
      setN(o);
    } else {
      setStatus("Awaiting...");
      const response = await fetch("/api/events/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id, data: n }),
      });

      if (!response.ok) {
        setError("Failed to edit the event. Try again.");
        setStatus("");
        return;
      }
    }
    await router.push(
      {
        pathname: `/events/${_id}`,
        query: { _id },
      },
      `/events/${_id}`
    );
    setStatus("Redirecting...");
  }

  useEffect(() => {
    setDiff(
      o.name !== n.name ||
        o.description !== n.description ||
        o.theme !== n.theme ||
        o.date !== n.date ||
        o.time !== n.time ||
        o.address !== n.address
    );
  }, [n]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="grid lg:grid-cols-12 relative">
      <header className="lg:col-span-12 flex justify-between md:justify-start md:gap-x-5 items-center w-full bg-white px-8 py-5 lg:py-6 sticky top-0 z-40">
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
            <span>Edit Event</span>
          </Link>
        </h1>
        <ul className="flex items-center gap-x-2.5 lg:gap-x-3.5">
          <button
            disabled={!diff}
            onClick={reset}
            type="button"
            className={twMerge(
              "font-medium text-red-500 lg:text-lg",
              diff ? "lg:hover:text-red-400 lg:hover:underline" : "opacity-50"
            )}
          >
            Reset
          </button>
          <button
            onClick={save}
            type="button"
            className="font-medium text-emerald-500 lg:hover:text-emerald-700 lg:hover:underline lg:text-lg"
          >
            Save
          </button>
        </ul>
      </header>
      {status ? (
        <div className="lg:grid-cols-12 flex flex-col justify-center items-center p-8 gap-y-2.5 lg:gap-y-4">
          <article>
            <span className="w-[37.5px] h-[37.5px] rounded-full bg-gradient-to-r from-emerald-500 via-emerald-500 flex justify-center items-center animate-spin">
              <span className="w-[90%] h-[90%] bg-white rounded-full" />
            </span>
          </article>
          <article>
            <p className="text-center font-light text-base lg:text-lg">
              {status}
            </p>
          </article>
        </div>
      ) : error ? (
        <div className="w-full max-w-[1080px] mx-auto lg:col-span-12 px-8 flex flex-col justify-center items-center">
          <p className="text-center font-light text-lg lg:text-xl text-red-500 mb-2.5 lg:mb-4">
            {error}
          </p>
        </div>
      ) : (
        <div className="w-full max-w-[1080px] mx-auto lg:col-span-12 p-8 flex flex-col gap-y-4 lg:gap-y-6">
          <section>
            <h4 className="font-medium text-lg lg:text-xl mb-1.5 lg:mb-2.5">
              Name
            </h4>
            <input
              autoFocus
              value={n.name}
              onChange={(e) => setN({ ...n, name: e.target.value })}
              type="text"
              className="px-4 py-3 rounded border w-full text-neutral-600 focus:text-neutral-900"
            />
          </section>
          <section>
            <h4 className="font-medium text-lg lg:text-xl mb-1.5 lg:mb-2.5">
              Description
            </h4>
            <textarea
              autoFocus
              value={n.description}
              onChange={(e) => setN({ ...n, description: e.target.value })}
              rows={6}
              className="px-4 py-3 rounded border w-full text-neutral-600 focus:text-neutral-900"
            />
          </section>
          <section>
            <h4 className="font-medium text-lg lg:text-xl mb-1.5 lg:mb-2.5">
              Date
            </h4>
            <input
              autoFocus
              value={n.date}
              onChange={(e) => setN({ ...n, date: e.target.value })}
              type="text"
              className="px-4 py-3 rounded border w-full text-neutral-600 focus:text-neutral-900"
            />
          </section>
          <section>
            <h4 className="font-medium text-lg lg:text-xl mb-1.5 lg:mb-2.5">
              Time
            </h4>
            <input
              autoFocus
              value={n.time}
              onChange={(e) => setN({ ...n, time: e.target.value })}
              type="text"
              className="px-4 py-3 rounded border w-full text-neutral-600 focus:text-neutral-900"
            />
          </section>
          <section>
            <h4 className="font-medium text-lg lg:text-xl mb-1.5 lg:mb-2.5">
              Address
            </h4>
            <input
              autoFocus
              value={n.address}
              onChange={(e) => setN({ ...n, address: e.target.value })}
              type="text"
              className="px-4 py-3 rounded border w-full text-neutral-600 focus:text-neutral-900"
            />
          </section>
        </div>
      )}
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
