import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { CREATOR_URL } from "../../consts/main";

export const Footer = () => {
  return (
    <footer className="relative border-t border-base-content/20 backdrop-blur-sm  place-items-center text-base-content p-4 flex justify-between gap-2 w-full  self-center h-20">
      <div className="flex flex-col gap-1 place-content-start place-items-start">
        <p className="text-xs font-mono ">
          Made with <Icon icon="mdi:coffee" className="align-middle" /> by{" "}
          <a className="text-secondary font-bold" href={CREATOR_URL}>
            herc
          </a>
        </p>
      </div>
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
    </footer>
  );
};
