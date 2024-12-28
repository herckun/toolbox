import { useState } from "react";
import { CustomInput } from "./CustomInput";
import { RegexPatterns } from "../../lib/helpers/parsers";
import { useFormManager } from "./hooks/useFormManager";
import { ENABLED_YT_QUALITIES } from "../../consts/misc";

export const YoutubeDownloader = (props: { user: any }) => {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("lowest");
  const { registerComponent, unregisterComponent, canSave } = useFormManager();

  const handleSetUrl = (value: string) => {
    setUrl(value);
  };

  const handleDownload = async () => {
    //open new tab with download link

    const videoId = new URL(url).searchParams.get("v");
    const downloadUrl = `/api/youtube/download?id=${videoId}&quality=${quality}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="flex flex-col p-4 gap-2 bg-base-100 min-h-[80vh] md:min-h-full grow rounded-box border flex-flex-col border-base-content/5 relative overflow-hidden">
      <h1 className="py-2 w-full px-1 text-lg font-semibold">
        Youtube downloader
      </h1>
      <div className="flex flex-col gap-2">
        <CustomInput
          name="video url"
          value=""
          placeholder="e.g https://www.youtube.com/watch?v=TZC57E2BnvM"
          label="Video URL"
          options={{
            editable: true,
            allowEmpty: false,
            allowedChars: RegexPatterns.YoutubeLink,
            limit: 100,
          }}
          callback={handleSetUrl}
          register={registerComponent}
          unregister={unregisterComponent}
        ></CustomInput>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="select select-bordered "
        >
          {ENABLED_YT_QUALITIES.map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
        {canSave() && (
          <button onClick={handleDownload} className="btn btn-primary">
            Download
          </button>
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
          This tool allows you to download videos from Youtube. Just paste the
          URL of the video you want to download and select the quality.
        </li>
      </ul>
    </div>
  );
};
