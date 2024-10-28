import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { transformerRenderWhitespace } from "@shikijs/transformers";
import { detect, languages, LANG } from "program-language-detector";
import { highlight_langs } from "../../consts/misc";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { toast } from "sonner";
import { useStore } from "@nanostores/react";
import { theme } from "../stores/theme";

export const CodeHL = (props: { content: string; lang?: string }) => {
  let detectedLang = detect(props.content).toLowerCase();
  detectedLang = detectedLang === "unknown" ? "text" : detectedLang;

  const $theme = useStore(theme);
  const [html, setHtml] = useState("");
  const [lang, setLang] = useState(props.lang ?? detectedLang);

  useEffect(() => {
    (async () => {
      let h = await codeToHtml(props.content, {
        lang: lang,
        theme: "vitesse-dark",
        defaultColor: "dark",
        transformers: [
          transformerRenderWhitespace(),
          {
            pre(node) {
              delete node.properties.style;
              node.properties.class = "whitespace-pre-wrap text-xs md:text-sm";
            },
          },
        ],
      });
      setHtml(h);
    })();
  }, [lang]);

  const handleLangChange = (e: any) => {
    setLang(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(props.content);
    toast.info("Copied to clipboard", {
      id: "copy",
    });
  };

  return (
    <div className="flex flex-col gap-2  relative grow">
      <div className="flex gap-1  place-content-center  place-items-center self-end w-full md:w-fit">
        <button
          onClick={handleCopy}
          className="btn md:btn-xs btn-ghost bg-base-content/15"
        >
          <Icon icon={"mdi:clipboard"} />
        </button>
        <div className="text-xs rounded-bl-md">
          <select
            defaultValue={lang}
            onChange={handleLangChange}
            className="select select-ghost bg-base-content/15  md:select-xs w-full  md:max-w-xs"
          >
            {highlight_langs.map((l) => (
              <option key={l} value={l}>
                {`${l} ${detectedLang == l ? "(auto detected)" : ""}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        className={`${$theme == "dark" ? "bg-base-content/15" : "bg-base-content/90"} rounded-box p-4 md:p-6 break-all w-full`}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
};
