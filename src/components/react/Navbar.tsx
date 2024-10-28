import { APP_NAME } from "../../consts/main";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { fetchAuthUser } from "./data/user";
import { user } from "../../../auth-schema";
import { authClient } from "../../lib/utils/react-auth-client";
import { navigate } from "astro:transitions/client";
import { APP_URL, AUTH_PATH } from "../../consts/paths";
import { toast } from "sonner";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

export const Navbar = () => {
  const { data, isFetching, error } = useQuery(
    {
      queryKey: ["authUser"],
      queryFn: fetchAuthUser,
    },
    queryClient,
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

  return (
    <div className="h-[5vh] min-h-16 w-full flex place-items-center place-self-center border border-base-content/15   backdrop-blur-sm px-2 z-30">
      <div className="flex-1">
        <a href={APP_URL} className="btn btn-ghost text-xl rounded-box">
          {APP_NAME}
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
