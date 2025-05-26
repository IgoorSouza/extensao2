import { ImgHTMLAttributes, useState } from "react";

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallback: string;
}

export default function ImageFallback({ src, fallback, ...rest }: Props) {
  const [imgSrc, setImgSrc] = useState<string>(src);
  return <img src={imgSrc} onError={() => setImgSrc(fallback)} {...rest} />;
}
