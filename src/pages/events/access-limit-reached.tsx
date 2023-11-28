import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function EventAccessNotAllowed() {
  return (
    <div className="p-8 h-screen flex flex-col justify-center items-center">
      <article className="flex flex-col items-center mb-5 lg:mb-8">
        <h2 className="text-red-500 font-medium text-xl lg:text-2xl mb-2.5 lg:mb-3.5">
          Maximum Limit
        </h2>
        <p className="text-neutral-600 text-base lg:text-lg mb-5 lg:mb-7 px-16 text-center">
          You have met the maximum number of events you can create.
        </p>
      </article>
      <article className="flex flex-col gap-y-2.5 w-max">
        <Link
          href={"/dashboard"}
          className="flex items-center gap-x-2.5 lg:gap-x-3.5 font-medium lg:hover:text-neutral-500 justify-between"
        >
          <FiArrowLeft className="text-lg lg:text-xl" />
          <span>Back to dashboard</span>
        </Link>
        <Link
          href={"/account/subscription"}
          className="flex items-center gap-x-2.5 lg:gap-x-3.5 font-medium lg:hover:text-emerald-700 text-emerald-500 justify-between"
        >
          <span>Upgrade to pro</span>
          <FiArrowRight className="text-lg lg:text-xl" />
        </Link>
      </article>
    </div>
  );
}
