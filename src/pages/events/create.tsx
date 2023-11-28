import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { User } from "~/types";

export default function EventCreate() {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  if (user.data.subscription === "free" && user.data.events.length === 3) {
    return {
      redirect: {
        destination: "/events/access-limit-reached",
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};
