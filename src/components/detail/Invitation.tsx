import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EventProps, User } from "~/types";

type InvitationProps = Pick<EventProps, "name"> & { _id: string; user: User };

const Invitation: React.FC<InvitationProps> = ({ _id, name, user }) => {
  const router = useRouter();

  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function accept() {
    setError("");
    setStatus("Updating...");

    const response = await fetch("/api/events/accept", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id, user }),
    });

    if (!response.ok) {
      setError("Failed to accept the invitation. Try again.");
      setStatus("");
      return;
    }

    setStatus("Reloading the page...");
    router.reload();
  }

  async function decline() {
    setError("");
    setStatus("Updating...");

    const response = await fetch("/api/events/decline", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id, email: user.data.email }),
    });

    if (!response.ok) {
      setError("Failed to decline the invitation. Try again.");
      setStatus("");
      return;
    }

    setStatus("Redirecting...");
    await router.push("/dashboard");
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
    <div className="lg:col-span-12 flex flex-col justify-center items-center gap-y-2.5 lg:gap-y-4 max-w-[500px] mx-auto">
      <h3 className="text-emerald-500 text-xl lg:text-2xl">
        You&apos;re Invited To
      </h3>
      <h5 className="font-medium text-lg lg:text-xl 2xl:text-2xl px-8 text-center mb-2.5 lg:mb-3.5">
        {name}
      </h5>
      <div className="mb-5 lg:mb-8">
        <p className="px-20 text-neutral-600 text-sm lg:text-base leading-[1.67] text-center lg:leading-[1.67]">
          To join the event, simply click on &apos;Accept&apos;. If you decline,
          you won&apos;t be able to see the event info.
        </p>
      </div>
      {status ? (
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
        <ul className="w-full px-16 flex flex-col gap-y-3.5">
          <button
            disabled={status ? true : false}
            onClick={accept}
            type="button"
            className="block px-8 py-3.5 rounded bg-neutral-900 border border-neutral-900 lg:hover:bg-neutral-700 font-medium text-white text-lg w-full"
          >
            Accept
          </button>
          <button
            disabled={status ? true : false}
            onClick={decline}
            type="button"
            className="block px-8 py-3.5 rounded bg-red-500 border border-red-500 lg:hover:bg-red-400 font-medium text-white text-lg w-full"
          >
            Decline
          </button>
        </ul>
      )}
    </div>
  );
};

export default Invitation;
