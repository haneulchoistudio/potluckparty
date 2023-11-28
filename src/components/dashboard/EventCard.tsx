import Link from "next/link";
import { Event } from "~/types";
import { FiArrowRight, FiMapPin, FiSettings } from "react-icons/fi";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/router";

type EventCardProps = Pick<Event, "_id"> &
  Pick<Event["data"], "name"> &
  Pick<Event["data"], "date"> &
  Pick<Event["data"], "time"> &
  Pick<Event["data"], "address"> & {
    amIHost: boolean;
  };

const EventCard: React.FC<EventCardProps> = ({
  _id,
  amIHost,
  name,
  date,
  time,
  address,
}) => {
  const router = useRouter();

  const [openSetting, setOpenSetting] = useState<boolean>(false);

  async function editEvent() {
    await router.push(
      {
        pathname: `/events/edit`,
        query: { _id: _id as string },
      },
      `/events/edit`
    );
  }

  async function deleteEvent() {
    await router.push(
      {
        pathname: `/events/delete`,
        query: { _id: _id as string },
      },
      `/events/delete`
    );
  }

  return (
    <div onClick={openSetting ? () => setOpenSetting(false) : undefined}>
      <div className="flex justify-between items-center gap-x-3.5 lg:gap-x-5">
        <h4 className="font-medium text-xl lg:text-2xl truncate">{name}</h4>
        {amIHost && (
          <div className="relative">
            <button
              disabled={!amIHost}
              onClick={() => setOpenSetting(!openSetting)}
              type="button"
              className={twMerge(
                "w-[35px] h-[35px] lg:w-[37.5px] lg:h-[37.5px] rounded flex justify-center items-center border ",
                openSetting
                  ? "bg-neutral-50 text-neutral-600 lg:hover:bg-white lg:hover:text-neutral-900"
                  : "lg:hover:border-neutral-400"
              )}
            >
              <FiSettings className="text-lg lg:text-xl" />
              {openSetting && (
                <aside className="p-3 lg:p-2 rounded shadow-xl border flex flex-col items-start absolute top-12 z-10 bg-white right-0">
                  <button
                    disabled={!openSetting}
                    onClick={editEvent}
                    type="button"
                    className="font-medium text-sm lg:text-base px-3 py-0.5 lg:py-1 lg:px-4 rounded text-emerald-500"
                  >
                    Edit
                  </button>
                  <button
                    disabled={!openSetting}
                    onClick={deleteEvent}
                    type="button"
                    className="font-medium text-sm lg:text-base px-3 py-0.5 lg:py-1 lg:px-4 rounded text-red-500"
                  >
                    Delete
                  </button>
                </aside>
              )}
            </button>
          </div>
        )}
      </div>
      <div className="mb-2.5 lg:mb-3.5">
        <p className="flex items-center gap-x-1.5 text-neutral-600 text-sm lg:text-base">
          <FiMapPin />
          <span className="inline-block truncate">{address}</span>
        </p>
      </div>
      <div>
        <Link
          href={{ pathname: `/events/${_id}`, query: { _id: _id as string } }}
          as={`/events/${_id}`}
          className="flex justify-between items-center gap-x-5 px-6 py-3 lg:px-8 lg:py-4 lg:text-lg rounded bg-neutral-900 lg:hover:bg-neutral-700 text-white font-medium"
        >
          <span>View Event</span>
          <FiArrowRight className="text-lg lg:text-xl" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
