import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { ProfileImage } from "../core";
import type { User } from "~/types";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface GuestsProps {
  _id: string;
  guests: User[];
  emails: string[];
}

const Guests: React.FC<GuestsProps> = ({ guests, emails: es, _id }) => {
  const { data: user } = useSession() as unknown as { data: User };
  const router = useRouter();

  const [openInvite, setOpenInvite] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [emails, setEmails] = useState<string[]>(es);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function invite() {
    setError("");
    setStatus("Inviting...");

    let response = await fetch("/api/events/invite", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        _id,
        canSms: user.data.subscription === "paid" ? true : false,
      }),
    });

    if (!response.ok) {
      setError(`Failed to invite '${email}'. Try again.`);
      setStatus("");
      return;
    }

    setStatus("Successfully invited!");

    await router.replace(
      {
        pathname: `/events/${_id}`,
        query: { _id },
      },
      `/events/${_id}`
    );

    setEmails((emails) => [email, ...emails]);
    setEmail("");
    setStatus("");
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <section className="overflow-hidden relative">
      <div className="flex justify-between items-center mb-2.5 lg:mb-4">
        <h4 className="font-medium text-xl lg:text-2xl">Event Guests</h4>
        {openInvite ? (
          <ul className="flex items-center gap-x-2.5">
            <button
              disabled={!openInvite}
              onClick={() => setOpenInvite(false)}
              type="button"
              className={twMerge(
                "lg:hover:font-medium text-red-500 lg:hover:text-red-400",
                !openInvite
                  ? "translate-x-full -right-full"
                  : "translate-x-0 -right-0"
              )}
            >
              Close
            </button>
            {email && !emails.includes(email) && (
              <button
                disabled={!openInvite && !(email && !emails.includes(email))}
                onClick={invite}
                type="button"
                className={twMerge(
                  "font-medium text-emerald-500 lg:hover:text-emerald-700",
                  !openInvite
                    ? "translate-x-full -right-full"
                    : "translate-x-0 -right-0"
                )}
              >
                Invite
              </button>
            )}
          </ul>
        ) : (
          <button
            disabled={openInvite}
            onClick={() => setOpenInvite(true)}
            type="button"
            className={twMerge(
              "flex items-center gap-x-1.5 text-emerald-500 lg:hover:text-emerald-700 lg:hover:font-medium relative"
            )}
          >
            <span>Invite</span>
            <FiPlus />
          </button>
        )}
      </div>
      {openInvite ? (
        status ? (
          <div className="flex flex-col items-center justify-center gap-y-2.5 lg:gap-y-4">
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
            <p className="text-center font-light text-sm lg:text-base text-red-500 mb-2.5 lg:mb-4">
              {error}
            </p>
          </div>
        ) : (
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded border text-sm lg:text-base"
              placeholder="Enter the email to invite."
            />
            {emails.includes(email) && (
              <p className="text-sm text-red-500 font-light mt-1">
                *<span className="font-medium">{email}</span> already exists.
              </p>
            )}
          </div>
        )
      ) : (
        <>
          {guests.length >= 1 ? (
            <ul>
              {guests.map((guest, idx) => (
                <ProfileImage image={guest.data.image} key={idx} />
              ))}
            </ul>
          ) : (
            <p className="text-red-500">Event does not have any guest.</p>
          )}
        </>
      )}
    </section>
  );
};

export default Guests;
