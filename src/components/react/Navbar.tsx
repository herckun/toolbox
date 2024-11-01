import { APP_NAME_LOGO } from "../../consts/main";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { fetchAuthUser } from "./data/user";
import { user } from "../../../auth-schema";
import { authClient } from "../../lib/utils/react-auth-client";
import { navigate } from "astro:transitions/client";
import { APP_PATH, APP_URL, AUTH_PATH, PASTE_PATH } from "../../consts/paths";
import { toast } from "sonner";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useStore } from "@nanostores/react";
import { theme } from "../stores/theme";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [ctheme, setcTheme] = useState("dark");
  const $theme = useStore(theme);

  const { data, isFetching, error } = useQuery(
    {
      queryKey: ["authUser"],
      queryFn: fetchAuthUser,
    },
    queryClient
  );

  const handleLogout = async () => {
    toast.loading("Logging out...");
    await authClient.signOut();
    if (!error) {
      toast.info("Logged out successfully, redirecting...");
      navigate(`${APP_URL}${AUTH_PATH}`);
    }
  };

  const handleLogin = async () => {
    navigate(`${APP_URL}${AUTH_PATH}`);
  };

  useEffect(() => {
    setcTheme($theme);
  }, [$theme]);

  return (
    <div className=" h-fit bg-base-100 w-full flex place-items-center place-self-center    backdrop-blur-sm px-4 py-2 z-30">
      <div className="flex-1 ">
        <a
          href={APP_PATH}
          className={`px-4 py-2 flex gap-2 place-content-center place-items-center w-fit ${
            ctheme == "light"
              ? "bg-primary/50 hover:bg-primary filter invert"
              : "bg-base-content/5"
          } hover:bg-base-content/10 transition-all font-extrabold rounded-box`}
        >
          <img src="/favicon.png" className="w-4 inline-block" />
          <span className="hidden md:block">
            <span
              className={`text-primary/80 ${
                ctheme == "light" && "filter invert"
              }`}
            >
              {APP_NAME_LOGO.split(" ")[0]}
            </span>
            <span
              className={`text-primary ${ctheme == "light" && "filter invert"}`}
            >
              {" "}
              {APP_NAME_LOGO.split(" ")[1]}
            </span>
          </span>
        </a>
      </div>
      <NavMenu />
      <div className="flex-none">
        {isFetching ? (
          <div className="skeleton h-12 w-24"></div>
        ) : data ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost ">
              <div className=" rounded-full">Hi, {data?.name}</div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 border border-base-content/25  backdrop-blur-sm rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li onClick={handleLogout}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <div
            onClick={handleLogin}
            tabIndex={0}
            role="button"
            className="btn btn-primary rounded-box "
          >
            Sign in
          </div>
        )}
      </div>
    </div>
  );
};

export const NavMenu = () => {
  const features = [
    {
      title: "Paste",
      icon: "mdi:content-paste",
      link: `${PASTE_PATH}`,
    },
  ];
  return (
    <ul className="menu menu-horizontal  rounded-box">
      <li>
        <details>
          <summary>Tools</summary>
          <ul className="border w-fit border-base-content/5">
            {features.map((feature) => (
              <li key={feature.title}>
                <a href={feature.link}>
                  <Icon icon={feature.icon} />
                  {feature.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </li>
    </ul>
  );
};
