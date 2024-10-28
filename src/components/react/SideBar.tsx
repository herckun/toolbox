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
    <div className="border-r flex place-items-center  flex-col border-base-content/15 justify-between  backdrop-blur-sm p-2 z-30 w-16 ">
      <div className="flex items-center justify-between">
        {features.map((feature) => (
          <a
            key={new Date().getTime()}
            href={feature.link}
            className="tooltip  tooltip-right"
            data-tip={feature.title}
          >
            <button className="btn btn-ghost rounded-md bg-base-100">
              <Icon icon={feature.icon} width={`1rem`} />
            </button>
          </a>
        ))}
      </div>
      <ThemeSwitcher />
    </div>
  );
};

export const ThemeSwitcher = () => {
  const $theme = useStore(theme);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    if (["dark", "light"].includes(newTheme)) {
      theme.set(newTheme);
      window.localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem("theme");
    if (localTheme) {
      handleThemeChange(localTheme as "light" | "dark");
    }
  }, []);

  return (
    <label className="grid cursor-pointer place-items-center">
      <input
        onChange={(e) =>
          handleThemeChange(!e.target.checked ? "dark" : "light")
        }
        checked={$theme === "light"}
        type="checkbox"
        className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
      />
      <svg
        className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
      <svg
        className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  );
};
