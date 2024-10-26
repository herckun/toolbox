import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { CREATOR_URL } from "../../consts/main";

export const Footer = () => {
  return (
    <footer className="  relative bg-base-content/5 backdrop-blur-sm rounded-t-box text-base-content p-4 flex items-center place-content-center flex-col gap-2 w-full md:w-[60vw] self-center">
      <nav>
        <div className="grid grid-flow-col gap-4 text-base-content/60">
          <a>
            <Icon icon="mdi:github" width={"1.5rem"} />
          </a>
          <a>
            <Icon icon="mdi:twitter" width={"1.5rem"} />
          </a>
        </div>
      </nav>
      <p className="text-xs font-mono ">
        Made with <Icon icon="mdi:coffee" className="align-middle" /> by{" "}
        <a className="text-secondary font-bold" href={CREATOR_URL}>
          herc
        </a>
      </p>
    </footer>
  );
};
