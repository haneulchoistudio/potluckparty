import { GetServerSideProps } from "next";
import {
  getProviders,
  getSession,
  getCsrfToken,
  signIn,
} from "next-auth/react";

type Props = {
  providerKeys: string[];
  providers: Record<string, { id: string; name: string }>;
  csrfToken: string;
};

export default function Login({ csrfToken, providerKeys, providers }: Props) {
  return (
    <div className="px-8 py-5 lg:py-6 grid lg:grid-cols-12 gap-8 lg:gap-12 relative">
      <header className="lg:col-span-12 flex justify-between md:justify-start md:gap-x-5 items-center w-full">
        <h1 className="font-bold text-xl lg:text-2xl uppercase tracking-[0.1rem]">
          Login
        </h1>
      </header>

      <div className="lg:col-span-12 max-w-[500px] mx-auto p-8">
        <ul className="flex flex-col gap-y-4">
          {providerKeys.map((key, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                signIn(providers[key].id);
              }}
              className="font-medium px-8 py-3 rounded border border-neutral-600 lg:hover:opacity-50"
            >
              Login with {providers[key].name}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getSession(ctx);

  if (user) {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(ctx);

  return {
    props: {
      providerKeys: Object.keys(providers as object),
      providers,
      csrfToken,
    },
  };
};
