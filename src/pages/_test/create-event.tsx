import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { EventProps, User } from "~/types";

type Props = {
  user: User;
};

export default function Home({ user }: Props) {
  const router = useRouter();

  async function createEvent() {
    const response = await fetch("/api/events/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: user._id,
        name: "Test Event",
        description: "This is test event.",
        address: "405 Example Avenue, CA 90630",
        date: "11/20/23",
        time: "11:50 AM",
        emails: [],
        ids: [],
        theme: "default",
        menu: "",
      } as EventProps),
    });

    if (!response.ok) {
      return;
    }

    const { _id } = (await response.json()) as { _id: string };

    console.log(_id);

    await router.push(
      {
        pathname: `/events/${_id}`,
        query: { _id },
      },
      `/events/${_id}`
    );
  }

  return (
    <div>
      <div>
        <button
          onClick={createEvent}
          type="button"
          className="p-5 bg-neutral-500 text-white font-medium"
        >
          Create Event
        </button>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSession(ctx);

  return {
    props: {
      user,
    },
  };
};
