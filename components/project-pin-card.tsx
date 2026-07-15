"use client";

import Image from "next/image";
import { PinContainer } from "@/components/ui/3d-pin";

type ProjectPinCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  href: string;
  label?: string;
};

export default function ProjectPinCard({
  title,
  description,
  imageSrc,
  href,
  label = "View project",
}: ProjectPinCardProps) {
  return (
    <PinContainer title={label} href={href}>
      <article className="flex h-[20rem] w-[20rem] flex-col p-4 tracking-tight">
        <h3 className="m-0 pb-2 text-base font-bold text-slate-100">
          {title}
        </h3>

        <p className="m-0 text-base font-normal text-slate-400">
          {description}
        </p>

        <div className="relative mt-4 flex-1 overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="320px"
          />
        </div>
      </article>
    </PinContainer>
  );
}