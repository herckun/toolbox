import { useMemo, useState } from "react";
import { RegexPatterns } from "../../lib/helpers/parsers";
import { CustomInput } from "./CustomInput";
import { useFormManager } from "./hooks/useFormManager";
import { generatePlaceholderPassword } from "../../lib/helpers/generators";
import { authClient } from "../../lib/utils/react-auth-client";
import { navigate } from "astro:transitions/client";
import { toast } from "sonner";
import { APP_PATH, APP_URL } from "../../consts/paths";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

export const AuthenticateBox = () => {
  const { registerComponent, unregisterComponent, canSave } = useFormManager();

  const [authMethod, setAuthMethod] = useState("email");

  const [action, setAction] = useState("sign-in");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetUsername = (value: string) => {
    setUsername(value);
  };

  const handleSetEmail = (value: string) => {
    setEmail(value);
  };

  const handleSetPassword = (value: string) => {
    setPassword(value);
  };

  const switchAction = (newAction: string) => {
    setAction(newAction);
  };

  const switchAuthMethod = (newMethod: string) => {
    setAuthMethod(newMethod);
  };

  const cachedPlaceholderPassword = useMemo(
    () => generatePlaceholderPassword(),
    [],
  );

  const signUp = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email: email,
        password: password,
        name: username,
        callbackURL: APP_PATH,
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          navigate(APP_PATH);
        },
        onError: (ctx) => {
          setIsLoading(false);

          toast.error(ctx.error.message, {
            id: "auth-error",
          });
        },
      },
    );
  };

  const signIn = async () => {
    const { data, error } = await authClient.signIn.email(
      {
        email: email,
        password: password,
        callbackURL: APP_PATH,
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          navigate(APP_PATH);
        },
        onError: (ctx) => {
          setIsLoading(false);

          if (ctx.error.status === 403) {
            toast.error("Please verify your email address", {
              id: "auth-error",
            });
            return;
          }

          toast.error(ctx.error.message, {
            id: "auth-error",
          });
        },
      },
    );
  };

  const signinWithGithub = async () => {
    const data = await authClient.signIn.social({
      provider: "github",
      callbackURL: `${APP_URL}${APP_PATH}`,
    });
  };

  const handleSend = () => {
    if (action === "sign-in") {
      signIn();
    } else {
      signUp();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full  px-2 md:px-24 rounded-box ">
      <div role="tablist" className="tabs tabs-boxed bg-neutral-content/5">
        <a
          onClick={() => switchAuthMethod("email")}
          role="tab"
          className={`tab ${authMethod == "email" ? "tab-active" : ""}`}
        >
          Email
        </a>
        <a
          onClick={() => switchAuthMethod("github")}
          role="tab"
          className={`tab ${authMethod == "github" ? "tab-active" : ""}`}
        >
          <Icon icon="mdi:github" width={"1.25rem"} />
        </a>
      </div>

      {authMethod === "github" && (
        <button onClick={signinWithGithub} className="btn btn-md">
          <Icon icon="mdi:github" width={"1.25rem"} />
          Sign in with Github
        </button>
      )}

      {authMethod === "email" && (
        <>
          {" "}
          <div className="flex flex-col space-y-2">
            {action === "sign-up" && (
              <CustomInput
                name="username"
                value=""
                placeholder="e.g Ben"
                label="Username"
                options={{
                  editable: true,
                  allowedChars: RegexPatterns.OnlyLetters,
                  limit: 30,
                }}
                callback={handleSetUsername}
                register={registerComponent}
                unregister={unregisterComponent}
              ></CustomInput>
            )}
            <CustomInput
              name="email"
              value=""
              placeholder="e.g benisben@ben.com"
              label="Email"
              options={{
                editable: true,
                allowedChars: RegexPatterns.Email,
              }}
              callback={handleSetEmail}
              register={registerComponent}
              unregister={unregisterComponent}
            ></CustomInput>
            <CustomInput
              name="password"
              value=""
              placeholder={`e.g ${cachedPlaceholderPassword}`}
              label="Password"
              options={{
                editable: true,
                allowedChars: RegexPatterns.PasswordComplex,
                hideContent: true,
              }}
              callback={handleSetPassword}
              register={registerComponent}
              unregister={unregisterComponent}
            ></CustomInput>

            <button
              onClick={handleSend}
              className={`btn btn-sm btn-primary`}
              disabled={!canSave()}
            >
              {action.split("-").join(" ")}
              {isLoading && <span className="loading loading-spinner"></span>}
            </button>
          </div>
          <div role="tablist" className="tabs tabs-boxed bg-neutral-content/5">
            <a
              onClick={() => switchAction("sign-in")}
              role="tab"
              className={`tab ${action == "sign-in" ? "tab-active" : ""}`}
            >
              Sign in
            </a>
            <a
              onClick={() => switchAction("sign-up")}
              role="tab"
              className={`tab ${action == "sign-up" ? "tab-active" : ""}`}
            >
              Sign up
            </a>
          </div>
        </>
      )}
    </div>
  );
};
