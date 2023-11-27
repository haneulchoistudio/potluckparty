import { v2 as cloudinary } from "cloudinary";
import { abc } from "../dotenv";

cloudinary.config({
  cloud_name: abc("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
  api_key: abc("CLOUDINARY_API_KEY"),
  api_secret: abc("CLOUDINARY_API_SECRET"),
});

export type CloudinaryStaticImage = {
  public_id: string;
  format: string;
  src: string;
};

export async function getStaticImages() {
  const results = await cloudinary.search.expression().execute();
  const resources = results.resources;
  const images = resources.map(
    (src: any) =>
      ({
        public_id: src.public_id,
        format: src.format,
        src: [src.public_id, src.format].join("."),
      } as CloudinaryStaticImage)
  ) as CloudinaryStaticImage[];

  return images;
}

export type CloudinaryDynamicImage = {
  href: string;
  src: string;
};

export async function getDynamicImages(option: CloudinaryDynamicImage) {
  return {
    public_id: "",
    format: "",
    src: option.src,
    href: option.href,
  } as CloudinaryStaticImage & { href: CloudinaryDynamicImage["href"] };
}
