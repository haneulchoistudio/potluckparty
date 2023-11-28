import { twMerge } from "tailwind-merge";

interface ProfileImageProps {
  image: string;
  asModal?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  image,
  asModal = false,
}) => {
  return (
    <picture
      className={twMerge(
        "block w-[37.5px] h-[37.5px] rounded-full overflow-hidden border transition-all duration-[0.35s] ease-in-out cursor-pointer ",
        asModal ? "hover:ring hover:ring-emerald-500" : ""
      )}
    >
      <img src={image} alt="Profile Image" referrerPolicy="no-referrer" />
    </picture>
  );
};

export default ProfileImage;
