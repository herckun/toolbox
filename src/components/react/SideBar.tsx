import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { APP_PATH, APP_URL, PASTE_PATH } from "../../consts/paths";
import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { theme } from "../stores/theme";

export const SideBar = () => {
  const features = [
    {
      title: "Paste tool",
      icon: "mdi:content-paste",
      link: `${PASTE_PATH}`,
    },
  ];

  return (
    <div className="border-r flex flex-col border-base-content/15 justify-between backdrop-blur-sm p-2 z-30 w-16 md:w-20 ">
      <div className="flex flex-col items-center md:w-full place-items-center place-content-center  justify-between">
        {features.map((feature) => (
          <a
            key={new Date().getTime()}
            href={feature.link}
            className="tooltip  tooltip-right"
            data-tip={feature.title}
          >
            <button className="btn btn-ghost btn-sm md:btn-md rounded-md bg-base-100">
              <Icon icon={feature.icon} width={`1.2rem`} />
            </button>
          </a>
        ))}
      </div>
    </div>
  );
};
