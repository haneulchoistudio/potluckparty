import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function AccountPhoneVerification({ user }: Props) {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  return { props: { user } };
};
