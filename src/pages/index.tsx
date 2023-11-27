import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "~/types";

type Props = {
  user: User;
};

export default function Home({ user }: Props) {
  const router = useRouter();
  const [redirectStatus, setRedirectStatus] = useState<string>("Preparing...");

  async function toDashboard() {
    setRedirectStatus("Redirecting...");
    await router.push("/dashboard");
  }

  useEffect(() => {
    toDashboard().then(() => {
      setRedirectStatus("Redirecting to dashboard...");
    });
  }, []);

  return (
    <div className="h-screen flex flex-col gap-y-5 justify-center items-center p-8">
      <div>
        <span className="w-[65px] h-[65px] rounded-full bg-gradient-to-br from-emerald-500 flex justify-center items-center animate-spin">
          <span className="w-[90%] h-[90%] bg-white rounded-full" />
        </span>
      </div>
      <div>
        <p className="text-center font-light text-lg lg:text-xl">
          {redirectStatus}
        </p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = (await getSession(ctx)) as unknown as User;

  if (!user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: { user } };
};
