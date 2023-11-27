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
  const [phone, setPhone] = useState<string>("7146167205");
  const [code, setCode] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function send() {
    setError("");
    const response = await fetch("/api/users/verify/phone/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone }),
    });
    if (!response.ok) {
      setError("Error while sending verificaiton code.");
      return;
    }
    const data = (await response.json()) as { status: string };
    setStatus(data.status);
    return;
  }

  async function confirm() {
    setError("");
    const response = await fetch("/api/users/verify/phone/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: phone, code }),
    });
    if (!response.ok) {
      setError("Error while confirming verification code.");
      return;
    }
    const data = (await response.json()) as { status: string };
    setStatus(data.status);
    return;
  }

  async function update() {
    setError("");
    const response = await fetch("/api/users/verify/phone/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, _id: user._id }),
    });
    if (!response.ok) {
      setError("Error while updating verification status to the user.");
      return;
    }

    setStatus("updated");
  }

  return (
    user && (
      <div>
        <div>
          <p>My Phone : {phone}</p>
          {user.data.phoneVerified ? (
            <p className="text-sm text-emerald-500">Your phone is verified!</p>
          ) : (
            <>
              {!status && (
                <div>
                  <p>Your phone is not verified.</p>
                  <div>
                    <button
                      className="px-5 py-2.5 rounded-md border bg-neutral-900 text-white lg:hover:bg-neutral-700"
                      type="button"
                      onClick={send}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
              {status === "pending" && (
                <div>
                  <p>Enter the code to confirm</p>
                  <div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Verification Code"
                    />
                  </div>
                  <div>
                    <button
                      className="px-5 py-2.5 rounded-md border bg-neutral-900 text-white lg:hover:bg-neutral-700"
                      type="button"
                      onClick={confirm}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
              {status === "approved" && (
                <div>
                  <p>Approved! Update now.</p>
                  <div>
                    <button
                      className="px-5 py-2.5 rounded-md border bg-neutral-900 text-white lg:hover:bg-neutral-700"
                      type="button"
                      onClick={update}
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}
              {status === "updated" && (
                <div>
                  <p>Finally completed the verification process!</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSession(ctx);

  console.log("___USER___", user);

  return {
    props: {
      user,
    },
  };
};
