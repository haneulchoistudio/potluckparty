import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiCheck, FiX } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { AccountHeader } from "~/components/account";
import type { User } from "~/types";

type Props = {
  user: User;
};

export default function AccountProfile({ user }: Props) {
  const router = useRouter();

  const [o, setO] = useState(user.data);
  const [n, setN] = useState(user.data);
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
    setStatus("Saving changes...");
    if (!diff) {
      setN(o);
    } else {
      setStatus("Awaiting...");
      const response = await fetch("/api/users/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: user._id,
          provider: user.provider,
          data: {
            ...n,
            phoneVerified: n.phone !== o.phone ? false : true,
          },
        }),
      });

      if (!response.ok) {
        setError("Failed to edit the profile. Try again.");
        setStatus("");
        return;
      }
    }
    router.reload();
  }

  useEffect(() => {
    setDiff(o.name !== n.name || o.bio !== n.bio || o.phone !== n.phone);
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
      <AccountHeader
        pageName="Profile"
        pageLinks={[
          { href: "/account/subscription", name: "Upgrade" },
          { href: "/account/verification", name: "Verify" },
        ]}
      />
      {status ? (
        <div className="lg:col-span-12 flex flex-col justify-center items-center p-8 gap-y-2.5 lg:gap-y-4 mx-auto w-max">
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
              Email
            </h4>
            <input
              disabled={true}
              autoFocus
              value={n.email}
              onChange={(e) => setN({ ...n, email: e.target.value })}
              type="text"
              className="px-4 py-3 rounded border w-full text-neutral-500 lg:hover:text-neutral-600 focus:text-neutral-900"
            />
          </section>
          <section>
            <h4 className="font-medium text-lg lg:text-xl mb-1.5 lg:mb-2.5">
              Bio
            </h4>
            <textarea
              autoFocus
              value={n.bio}
              onChange={(e) => setN({ ...n, bio: e.target.value })}
              rows={3}
              className="px-4 py-3 rounded border w-full text-neutral-600 focus:text-neutral-900"
            />
          </section>
          <section>
            <div className="flex justify-between items-center md:gap-x-5 md:justify-start mb-1.5 lg:mb-2.5">
              <h4 className="font-medium text-lg lg:text-xl">Phone</h4>
              {n.phone === o.phone && n.phoneVerified ? (
                <p className="text-sm text-emerald-700 flex items-center gap-x-1">
                  <FiCheck className="text-base lg:text-lg" />
                  <span>Verified</span>
                </p>
              ) : (
                <p className="text-sm text-red-500 flex items-center gap-x-1">
                  <FiX className="text-base lg:text-lg" />
                  <Link
                    href={"/account/verification"}
                    className="underline lg:no-underline lg:hover:underline lg:hover:text-red-400"
                  >
                    Not verified
                  </Link>
                </p>
              )}
            </div>
            <input
              autoFocus
              value={n.phone}
              onChange={(e) => setN({ ...n, phone: e.target.value })}
              type="text"
              className="px-4 py-3 rounded border w-full text-neutral-600 focus:text-neutral-900"
            />
          </section>
          {diff && (
            <section className="flex flex-col gap-y-2.5 lg:gap-y-4">
              <button
                disabled={!diff}
                onClick={save}
                type="submit"
                className="w-full sm:max-w-[325px] mx-auto px-8 py-3.5 rounded bg-neutral-900 text-white font-medium text-lg lg:hover:bg-neutral-700"
              >
                Save Profile
              </button>
              <button
                disabled={!diff}
                onClick={reset}
                type="submit"
                className="w-full sm:max-w-[325px] mx-auto px-8 py-3.5 rounded bg-red-500 text-white font-medium text-lg lg:hover:bg-red-400"
              >
                Reset Changes
              </button>
            </section>
          )}
        </div>
      )}
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
