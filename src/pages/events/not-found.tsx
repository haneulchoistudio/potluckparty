import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function EventNotFound() {
  return (
    <div className="p-8 h-screen flex flex-col justify-center items-center">
      <article className="flex flex-col items-center mb-5 lg:mb-8">
        <h2 className="text-red-500 font-medium text-xl lg:text-2xl mb-2.5 lg:mb-3.5">
          Event Not Found
        </h2>
        <p className="text-neutral-600 text-base lg:text-lg">
          The event page you requested is not found.
        </p>
      </article>
      <article>
        <Link
          href={"/dashboard"}
          className="flex items-center gap-x-2.5 lg:gap-x-3.5 font-medium lg:hover:text-neutral-500"
        >
          <FiArrowLeft className="text-lg lg:text-xl" />
          <span>Dashboard</span>
        </Link>
      </article>
    </div>
  );
}
