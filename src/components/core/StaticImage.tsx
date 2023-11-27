import { CldImage } from "next-cloudinary";
import type { ImageProps } from "next/image";
import { twMerge } from "tailwind-merge";

type StaticImageProps = ImageProps & {
  classNames?: {
    picture?: string;
    image?: string;
  };
};

const StaticImage: React.FC<StaticImageProps> = ({
  classNames = { picture: "", image: "" },
  ...props
}) => {
  return (
    <picture className={twMerge("block", classNames.picture)}>
      <CldImage
        width={props.width}
        height={props.height}
        src={props.src as string}
        alt={props.alt}
        className={twMerge("", classNames.image)}
      />
    </picture>
  );
};

export default StaticImage;
