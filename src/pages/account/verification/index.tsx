import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { User } from "~/types";

export default function AccountVerification() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  return {
    redirect: { destination: "/account/verification/phone", permanent: false },
  };
};
