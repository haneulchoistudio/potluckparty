import { signOut } from "next-auth/react";
import Link from "next/link";

interface AccountHeaderProps {
  pageName: string;
  pageLinks: {
    name: string;
    href: string;
  }[];
}

const AccountHeader: React.FC<AccountHeaderProps> = ({
  pageLinks,
  pageName,
}) => {
  async function signout() {
    const confirmSignOut = confirm(
      "Are you sure you want to sign out of Potluck Party?"
    );
    if (confirmSignOut) {
      await signOut();
    }
  }

  return (
    <>
      <header className="lg:col-span-12 flex justify-between md:justify-start md:gap-x-5 items-center w-full bg-white px-8 py-5 lg:py-6 sticky top-0 z-40">
        <h1 className="font-bold text-xl lg:text-2xl uppercase tracking-[0.1rem]">
          Account
        </h1>

        <ul className="flex items-center gap-x-2.5 lg:gap-x-3.5">
          <Link
            href={"/dashboard"}
            className="hidden md:flex font-medium rounded-full px-5 py-2.5  bg-neutral-900 lg:hover:bg-neutral-600 text-white"
          >
            Dashboard
          </Link>
          {pageLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="text-neutral-700 lg:hover:text-neutral-500 lg:hover:underline lg:text-lg"
            >
              {link.name}
            </Link>
          ))}
          <button
            type="button"
            onClick={signout}
            className="font-medium text-red-500 lg:hover:text-red-400 lg:hover:underline lg:text-lg"
          >
            Sign out
          </button>
        </ul>
      </header>
      <div className="lg:col-span-12 bg-neutral-100 text-neutral-500">
        <p className="max-w-[1080px] mx-auto px-8 py-2 lg:py-3 flex items-center gap-x-1">
          <span className="text-sm lg:text-base">Account</span>
          <span>/</span>
          <span className="text-sm lg:text-base text-neutral-900 font-medium">
            {pageName}
          </span>
        </p>
      </div>
    </>
  );
};

export default AccountHeader;
