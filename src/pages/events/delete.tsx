import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { db } from "~/server/mongo";
import { Event, User } from "~/types";

type Props = {
  user: User;
  event: Event;
};

export default function EventDelete({ user, event }: Props) {
  const router = useRouter();

  async function deleteEvent() {
    const canDelete = confirm(
      `You cannot reverse this action once completed. Are you sure you want to delete?`
    );

    if (canDelete) {
      // delete here
      return;
    }

    // no delete here
  }

  async function goBack() {
    await router.push("/dashboard");
  }

  return (
    <div className="p-8 h-screen flex flex-col justify-center items-center">
      <article className="max-w-[500px] mx-auto flex flex-col items-center gap-y-2.5 lg:gap-y-3.5">
        <h3 className="text-lg lg:text-xl text-neutral-600">
          Are you sure you want to delete?
        </h3>
        <h4 className="font-medium text-xl lg:text-2xl mb-2.5 lg:mb-3.5">
          {event.data.name}
        </h4>
        <ul className="flex flex-col w-max gap-y-2.5">
          <button
            type="button"
            onClick={deleteEvent}
            className="px-6 py-3 lg:px-8 lg:py-4 rounded bg-emerald-500 lg:hover:bg-emerald-700 text-white font-medium lg:text-lg w-auto"
          >
            Yes, delete it.
          </button>
          <button
            onClick={goBack}
            type="button"
            className="px-6 py-3 lg:px-8 lg:py-4 rounded bg-red-500 lg:hover:bg-red-400 text-white font-medium lg:text-lg w-auto"
          >
            No, go back.
          </button>
        </ul>
      </article>
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

  return { props: { user, event } };
};
