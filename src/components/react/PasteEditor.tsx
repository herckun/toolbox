import { useEffect, useState } from "react";
import { RegexPatterns } from "../../lib/helpers/parsers";
import { CustomInput } from "./CustomInput";
import { useFormManager } from "./hooks/useFormManager";
import { toast } from "sonner";
import { createPaste, getPaste } from "./data/paste";
import { useQuery } from "@tanstack/react-query";
import { navigate } from "astro:transitions/client";
import { queryClient } from "./queryClient";
import { PASTE_PATH } from "../../consts/paths";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { NotSignedIn } from "./Errors";
import { CodeHL } from "./CodeHL";

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
    navigate(`${PASTE_PATH}/${paste.id}`);
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
    <div className="flex flex-col p-4 gap-2 bg-base-100 min-h-[50vh] grow rounded-box border flex-flex-col border-base-content/5 relative overflow-hidden">
      {!props.user && <NotSignedIn />}
      <h1 className="py-2 w-full px-1 text-lg font-semibold">New Paste</h1>
      {pasteTitle.length > 0 && (
        <h1 className="py-2 px-1 text-sm font-semibold">{pasteTitle}</h1>
      )}
      <textarea
        onChange={(e) => handleSetPasteContent(e.target.value)}
        className="textarea w-full grow border-base-content/10"
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
          className={`btn btn-primary btn-sm grow  ${canSave() ? "" : "btn-disabled"}`}
        >
          Create Paste
        </button>
      </div>
      {showSettings && (
        <div className="w-full flex gap-2">
          <div className="flex flex-col justify-between p-4 gap-2 bg-base-100 md:max-w-96 w-full rounded-box">
            <span>Paste options</span>
            <CustomInput
              name="title"
              value=""
              placeholder="e.g My awesome paste"
              label="title"
              options={{
                editable: true,
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
                allowedChars: RegexPatterns.OnlyLetters,
                limit: 30,
              }}
              callback={handleSetPastePassword}
              register={registerComponent}
              unregister={unregisterComponent}
            ></CustomInput>
          </div>
        </div>
      )}
    </div>
  );
};

const PasteViewer = (props: { pasteId: string; password?: string }) => {
  const [unlockPassword, setunlockPassword] = useState<string | undefined>(
    undefined,
  );

  const { canSave, registerComponent, unregisterComponent } = useFormManager();
  const { data, error, isFetching } = useQuery(
    {
      queryKey: ["paste", props.pasteId],
      queryFn: async () => {
        if (unlockPassword || props.password) {
          return await getPaste(
            props.pasteId!,
            unlockPassword ?? props.password,
          );
        }
        return await getPaste(props.pasteId!);
      },
      enabled: !!props.pasteId,
    },
    queryClient,
  );

  const handleSetUnlockPassword = (value: string) => {
    setunlockPassword(value);
  };

  const handleUnlockPaste = async () => {
    queryClient.invalidateQueries({
      queryKey: ["paste", props.pasteId],
    });
  };

  if (!data || isFetching) {
    return (
      <div className="skeleton w-full flex-1 min-h-[50vh] bg-base-content/10"></div>
    );
  }
  return (
    <div className="flex flex-col p-4 gap-2 shrink-0 bg-base-100 min-h-[50vh] md:max-w-[50vw] grow rounded-box border flex-flex-col border-base-content/5 relative overflow-hidden ">
      <div className="h-full flex flex-col gap-2 justify-between">
        <h1 className="py-2 w-full px-1 text-lg font-semibold">
          {data.title == "none" ? `Paste #${props.pasteId}` : data.title}
        </h1>
        {!data.requiresPassword && (
          <CustomInput
            name="paste-link"
            value={`${PASTE_PATH}/${props.pasteId}`}
            placeholder="Paste link"
            options={{
              editable: false,
              clipboard: true,
            }}
          ></CustomInput>
        )}
        {!data.requiresPassword && <CodeHL content={data.content} />}

        {data.requiresPassword && (
          <div className="flex flex-col gap-2 grow  place-content-cente justify-center self-center">
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
                allowedChars: RegexPatterns.OnlyLetters,
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
    <div className="flex flex-col p-4 gap-2 bg-base-100 h-fit md:min-h-full w-full md:w-1/4 grow  rounded-box prose">
      <span className="font-semibold">About tool</span>
      <ul className="text-xs md:text-base font-light">
        <li>
          This tool allows you to paste your code and share it with others, with
          the protection of a password to protect your paste if needed.
        </li>
        <li>
          You will have to be logged in to create a new paste, but sharing them
          is as easy as copy-pasting the paste link
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
