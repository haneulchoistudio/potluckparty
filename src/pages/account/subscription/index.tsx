import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { AccountHeader } from "~/components/account";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function AccountSubscription({ user }: Props) {
  const [o, setO] = useState(user);
  const [n, setN] = useState(user);
  const [diff, setDiff] = useState<boolean>(false);

  return (
    <div className="grid lg:grid-cols-12 relative">
      <AccountHeader
        pageName="Subscription"
        pageLinks={[
          { href: "/account/profile", name: "Profile" },
          { href: "/account/verification", name: "Verify" },
        ]}
      />
    </div>
  );
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
