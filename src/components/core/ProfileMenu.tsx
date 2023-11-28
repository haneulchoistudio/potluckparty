import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FiAirplay,
  FiHash,
  FiPaperclip,
  FiPlus,
  FiUpload,
  FiUploadCloud,
} from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import ProfileImage from "./ProfileImage";

interface ProfileMenuProps {
  image: string;
  isOnFreePlan: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ image, isOnFreePlan }) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  return (
    <div className="relative z-20">
      <button type="button" onClick={() => setOpenMenu(!openMenu)}>
        <ProfileImage image={image} asModal={openMenu} />
      </button>
      {openMenu && (
        <aside className="px-2 py-3 rounded border shadow-xl absolute z-10 top-12 bg-white right-0">
          <ul className="flex flex-col items-start w-max">
            {isOnFreePlan && (
              <Link
                href={"/account/subscription/plan"}
                className="text-base lg:text-lg px-3 py-2 rounded-full flex items-center justify-between w-full text-emerald-500 lg:hover:text-emerald-700 font-medium"
              >
                <span>Upgrade</span>
                <FiHash />
              </Link>
            )}
            <Link
              href={"/account/profile"}
              className="px-3 py-0.5 text-neutral-600 lg:hover:text-neutral-400"
            >
              Profile
            </Link>
            <Link
              href={"/account/subscription"}
              className="px-3 py-0.5 text-neutral-600 lg:hover:text-neutral-400"
            >
              Subscription
            </Link>
            <Link
              href={"/account/verification"}
              className="px-3 py-0.5 text-neutral-600 lg:hover:text-neutral-400"
            >
              Verifications
            </Link>
            <button
              type="button"
              onClick={() => {
                signOut();
              }}
              className="font-medium px-3 py-0.5 text-red-500 lg:hover:text-red-400"
            >
              Sign Out
            </button>
          </ul>
        </aside>
      )}
    </div>
  );
};

export default ProfileMenu;
