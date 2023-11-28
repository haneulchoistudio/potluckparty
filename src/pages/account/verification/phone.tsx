import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { AccountHeader } from "~/components/account";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function AccountVerificationPhone({ user }: Props) {
  const [o, setO] = useState(user);
  const [n, setN] = useState(user);
  const [diff, setDiff] = useState<boolean>(false);

  return (
    <div className="grid lg:grid-cols-12 relative">
      <AccountHeader
        pageName="Verification / Phone"
        pageLinks={[
          { href: "/account/profile", name: "Profile" },
          { href: "/account/subscription", name: "Upgrade" },
        ]}
      />
      <div className="lg:col-span-12 w-full max-w-[1080px] mx-auto p-8">
        <h3 className="font-medium text-xl lg:text-2xl mb-2.5 lg:mb-4">
          Phone Verification
        </h3>
        {user.data.phone && user.data.phoneVerified && (
          <p className="text-neutral-600 lg:text-lg leading-[1.67] lg:leading-[1.67]">
            <span className="text-emerald-700">
              Your phone has successfully been verified.
            </span>{" "}
            <span>
              To update your phone number, go to{" "}
              <Link
                href={"/account/profile"}
                className="text-neutral-900 inline-block lg:hover:text-emerald-700"
              >
                <strong>Account / Profile.</strong>
              </Link>{" "}
              If you want to verify the updated phone number, visit this page
              after updating your new phone number.
            </span>
          </p>
        )}
        {user.data.phone && !user.data.phoneVerified && (
          <div>
            <p className="text-neutral-600 lg:text-lg leading-[1.67] lg:leading-[1.67] mb-2.5 lg:mb-4">
              Please verify your phone number. We will send you a verification
              code via the phone number that ends in{" "}
              <strong>{user.data.phone.slice(-4)}.</strong>
            </p>
            <button
              type="button"
              className="font-medium px-5 py-3 rounded bg-emerald-500 lg:hover:bg-emerald-900 text-white"
            >
              Send Verification Code
            </button>
          </div>
        )}
      </div>
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
