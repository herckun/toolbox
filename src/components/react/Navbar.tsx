import { APP_NAME_LOGO } from "../../consts/main";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { fetchAuthUser } from "./data/user";
import { user } from "../../../auth-schema";
import { authClient } from "../../lib/utils/react-auth-client";
import { navigate } from "astro:transitions/client";
import { APP_URL, AUTH_PATH } from "../../consts/paths";
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
    const { data, error } = await authClient.signOut();
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
    <div className="h-fit bg-base-200-content/10 w-full flex place-items-center place-self-center border-b border-base-content/15   backdrop-blur-sm px-4 py-2 z-30">
      <div className="flex-1">
        <a
          href={APP_URL}
          className={`px-4 py-2 flex gap-2 place-content-center place-items-center w-fit ${
            ctheme == "light"
              ? "bg-primary/50 hover:bg-primary filter invert"
              : "bg-base-content/5"
          } hover:bg-base-content/10 transition-all font-extrabold rounded-box`}
        >
          <img src="/favicon.png" className="w-4 inline-block" />
          <span>
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
              className="menu menu-sm dropdown-content bg-base-300 border border-base-content/25  backdrop-blur-sm rounded-box z-[1] mt-3 w-52 p-2 shadow"
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
