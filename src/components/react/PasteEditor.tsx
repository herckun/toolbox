import { useEffect, useState } from "react";
import { RegexPatterns } from "../../lib/helpers/parsers";
import { CustomInput } from "./CustomInput";
import { useFormManager } from "./hooks/useFormManager";
import { toast } from "sonner";
import { createPaste, deletePaste, getPaste } from "./data/paste";
import { useQuery } from "@tanstack/react-query";
import { navigate } from "astro:transitions/client";
import { queryClient } from "./queryClient";
import { PASTE_PATH } from "../../consts/paths";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { NotSignedIn } from "./Errors";
import { CodeHL } from "./CodeHL";
import { ButtonWithConfirmation } from "./ButtonWithConfirmation";
import { highlight_langs } from "../../consts/misc";

export const PasteEditor = (props: {
  mode: "create" | "view";
  pasteId?: string;
  password?: string;
  user?: any;
}) => {
  const { registerComponent, unregisterComponent, canSave } = useFormManager();
  const [pasteTitle, setPasteTitle] = useState("");
  const [pasteContent, setPasteContent] = useState("");
  const [pastePassword, setPasePassword] = useState("");
  const [pasteSyntaxHighlight, setPasteSyntaxHighlight] = useState("text");
  const [showSettings, setShowSettings] = useState(false);

  const handleSetPasteTitle = (value: string) => {
    setPasteTitle(value);
  };
  const handleSetPastePassword = (value: string) => {
    setPasePassword(value);
  };
  const handleSetPasteContent = (value: string) => {
    setPasteContent(value);
  };
  const handleLangChange = (value: string) => {
    setPasteSyntaxHighlight(value);
  };

  const switchShowSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleCreatePaste = async () => {
    toast.loading("Creating paste...", {
      id: "create-paste",
    });
    const create = await createPaste({
      title: pasteTitle,
      password: pastePassword,
      content: pasteContent,
      syntaxHighlight: pasteSyntaxHighlight,
    });
    if (!create.ok) {
      toast.dismiss("create-paste");
      toast.error("Failed to create paste", {
        id: "create-paste-error",
      });
      return;
    }
    const paste = await create.json();
    toast.dismiss("create-paste");

    toast.success("Paste created successfully");
    if (pastePassword) {
      navigate(
        `${PASTE_PATH}/${paste.id}?password=${encodeURIComponent(
          pastePassword
        )}`
      );
    } else {
      navigate(`${PASTE_PATH}/${paste.id}`);
    }
  };

  if (props.mode == "view" && props.pasteId) {
    return (
      <PasteViewer
        pasteId={props.pasteId}
        password={props.password}
      ></PasteViewer>
    );
  }

  return (
    <div className="flex flex-col p-4 gap-2 bg-base-100 min-h-[80vh] md:min-h-full grow rounded-box border flex-flex-col border-base-content/5 relative overflow-hidden">
      <h1 className="py-2 w-full px-1 text-lg font-semibold">New Paste</h1>
      {pasteTitle.length > 0 && (
        <h1 className="py-2 px-1 text-sm font-semibold">{pasteTitle}</h1>
      )}
      <textarea
        onChange={(e) => handleSetPasteContent(e.target.value)}
        className="textarea w-full grow border-base-content/10 min-h-[50vh]"
        placeholder="Paste your code here"
      ></textarea>
      <div className="w-full flex gap-1">
        <button
          onClick={switchShowSettings}
          className="btn btn-sm btn-neutral btn-square"
        >
          {!showSettings && <Icon icon={"mdi:settings"} />}
          {showSettings && <Icon icon={"mdi:close"} />}
        </button>
        <button
          onClick={handleCreatePaste}
          className={`btn btn-primary btn-sm grow  ${
            canSave() ? "" : "btn-disabled"
          }`}
        >
          Create Paste
        </button>
      </div>
      {showSettings && (
        <div className="w-full h-fit flex gap-2">
          <div className="flex h-fit flex-col justify-between p-4 gap-2 bg-base-100 md:max-w-96 w-full rounded-box">
            <span>Paste options</span>
            <CustomInput
              name="title"
              value=""
              placeholder="e.g My awesome paste"
              label="title"
              options={{
                editable: true,
                allowEmpty: true,
                allowedChars: RegexPatterns.LettersNumbersAndSpaces,
                limit: 100,
              }}
              callback={handleSetPasteTitle}
              register={registerComponent}
              unregister={unregisterComponent}
            ></CustomInput>
            <CustomInput
              name="password"
              value=""
              placeholder="(leave empty for no password)"
              label="password"
              options={{
                editable: true,
                allowEmpty: true,
                allowedChars: RegexPatterns.LettersNumbersAndSpecialChars,
                limit: 30,
              }}
              callback={handleSetPastePassword}
              register={registerComponent}
              unregister={unregisterComponent}
            ></CustomInput>
            {pastePassword.length > 0 && (
              <span className="text-xs px-1 text-base-content/50">
                Be careful, the content of this paste will be encrypted and you
                will need the password to view it.
              </span>
            )}
            <span className="text-xs h-6 p-1 text-base-content  lowercase block">
              Syntax Highlighting
            </span>
            <select
              defaultValue={pasteSyntaxHighlight}
              onChange={(e) => handleLangChange(e.target.value)}
              className="select select-ghost bg-base-content/15 grow  w-full  "
            >
              {highlight_langs.map((l) => (
                <option key={l} value={l}>
                  {`${l}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

const PasteViewer = (props: { pasteId: string; password?: string }) => {
  const [showLink, setShowLink] = useState("normal");
  const [unlockPassword, setunlockPassword] = useState<string | undefined>(
    props.password
  );

  const { canSave, registerComponent, unregisterComponent } = useFormManager();
  const { data, error, isFetching } = useQuery(
    {
      queryKey: ["paste", props.pasteId],
      queryFn: async () => {
        if (unlockPassword) {
          return await getPaste(props.pasteId!, unlockPassword);
        }
        return await getPaste(props.pasteId!);
      },
      enabled: !!props.pasteId,
    },
    queryClient
  );

  const handleSetUnlockPassword = (value: string) => {
    setunlockPassword(value);
  };

  const handleDeletePaste = async () => {
    toast.loading("Deleting paste...", {
      id: "delete-paste",
    });
    const del = await deletePaste(props.pasteId!);
    if (!del.ok) {
      toast.dismiss("delete-paste");
      toast.error("Failed to delete paste", {
        id: "delete-paste-error",
      });
      return;
    }
    toast.dismiss("delete-paste");
    toast.success("Paste deleted successfully");
    navigate(PASTE_PATH);
  };

  const handleUnlockPaste = () => {
    queryClient.invalidateQueries({
      queryKey: ["paste", props.pasteId],
    });
  };

  const handleTryAgain = () => {
    setunlockPassword(undefined);
    queryClient.invalidateQueries({
      queryKey: ["paste", props.pasteId],
    });
  };

  const handleSetShowLink = (value: string) => {
    setShowLink(value);
  };

  if (isFetching) {
    return (
      <div className="skeleton w-full min-h-[50vh] bg-base-content/10"></div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col p-4 gap-2 bg-base-100 w-full min-h-[80vh] md:min-h-full rounded-box border flex-flex-col border-base-content/5 relative overflow-hidden ">
        <h1 className="py-2 w-full px-1 text-lg font-semibold">
          Could not get your paste
        </h1>
        <p className="text-base-content px-1">
          Something went wrong while trying to get your paste, make sure the id
          and any password you provided are correct
        </p>
        <button
          onClick={handleTryAgain}
          className="btn btn-sm btn-primary max-w-32"
        >
          Try again
        </button>
      </div>
    );
  }

  const paste_link = `${PASTE_PATH}/${props.pasteId}`;
  const paste_link_with_password = unlockPassword
    ? `${PASTE_PATH}/${props.pasteId}?password=${encodeURIComponent(
        unlockPassword
      )}`
    : paste_link;
  return (
    <div className="flex flex-col p-4 gap-2 bg-base-100 w-full min-h-[80vh] md:min-h-full rounded-box border flex-flex-col border-base-content/5 relative overflow-hidden ">
      {data?.isCreator && (
        <ButtonWithConfirmation
          callback={handleDeletePaste}
          className="btn btn-sm btn-warning  absolute top-1 right-1"
          value={
            <span>
              <Icon
                icon="mdi:delete"
                className="align-middle"
                width={`1.2rem`}
              />
            </span>
          }
        ></ButtonWithConfirmation>
      )}
      <div className="h-full flex flex-col gap-2 justify-between">
        <h1 className="py-2 w-full px-1 text-lg font-semibold">
          {data.title == "none" ? `Paste #${props.pasteId}` : data.title}
        </h1>
        {!data.requiresPassword && paste_link != paste_link_with_password && (
          <div role="tablist" className="tabs tabs-boxed bg-base-content/10">
            <a
              onClick={() => handleSetShowLink("normal")}
              role="tab"
              className={`tab ${showLink === "normal" ? "tab-active" : ""}`}
            >
              Share link
            </a>
            <a
              onClick={() => handleSetShowLink("password")}
              role="tab"
              className={`tab ${showLink === "password" ? "tab-active" : ""}`}
            >
              Share link (with password)
            </a>
          </div>
        )}
        {!data.requiresPassword && (
          <CustomInput
            name="paste-link"
            value={
              showLink === "normal" ? paste_link : paste_link_with_password
            }
            placeholder="Paste link"
            options={{
              editable: false,
              clipboard: true,
            }}
          ></CustomInput>
        )}
        {!data.requiresPassword && (
          <CodeHL content={data.content} lang={data.syntaxHighlight} />
        )}

        {data.requiresPassword && (
          <div className="flex flex-col gap-2 grow  place-content-center justify-center self-center">
            <span className="font-bold text-lg">
              This paste is password protected
            </span>
            <p className="text-xs">
              You need to enter the password to view the content
            </p>
            <CustomInput
              name="password"
              value=""
              placeholder="Password"
              label="Password"
              options={{
                editable: true,
                allowedChars: RegexPatterns.LettersNumbersAndSpecialChars,
                limit: 30,
                hideContent: true,
              }}
              callback={handleSetUnlockPassword}
              register={registerComponent}
              unregister={unregisterComponent}
            ></CustomInput>
            <button
              onClick={handleUnlockPaste}
              className="btn btn-primary max-w-96"
              disabled={!canSave()}
            >
              Unlock
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const About = () => {
  return (
    <div className="flex flex-col p-4 gap-2 bg-base-100 w-full h-fit   rounded-box prose">
      <span className="font-semibold">About tool</span>
      <ul className="text-xs md:text-base font-light">
        <li>
          This tool allows you to paste your code and share it with others, with
          the protection of a password to protect your paste if needed.
        </li>
        <li>
          You can create a paste without an account, but you will not be able to
          delete it later.
        </li>
        <li>
          {" "}
          You are prohibited from posting any copyrighted or stolen material,
          personal information, leaked or hacked data, spam links (including
          links pointing to pornographic, pirated, or any illegal content), or
          any malicious/harmful or hacking-related content. Violating snippets
          will be deleted immediately, and your account and IP address will be
          permanently banned.
        </li>
      </ul>
    </div>
  );
};
