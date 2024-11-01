import { useQuery } from "@tanstack/react-query";
import { deletePaste, getPastesForUser } from "./data/paste";
import { useEffect, useState } from "react";
import { queryClient } from "./queryClient";
import type { Paste, ResponsePaste } from "../../lib/handlers/PasteHandler";
import { humanizeDate } from "../../lib/helpers/formatter";
import { navigate } from "astro:transitions/client";
import { toast } from "sonner";
import { PASTE_PATH } from "../../consts/paths";
import { ButtonWithConfirmation } from "./ButtonWithConfirmation";

export const UserPastes = (props: { userId: string }) => {
  const [pastes, setPastes] = useState<ResponsePaste[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, error, isFetching } = useQuery(
    {
      queryKey: ["user-pastes", props.userId],
      queryFn: async () => {
        return getPastesForUser(props.userId, cursor);
      },
    },
    queryClient
  );

  const addPastes = (newPastes: ResponsePaste[]) => {
    setPastes([...pastes, ...newPastes]);
  };

  const handleSetCursor = (cursor: string | undefined) => {
    setCursor(cursor);
  };

  const handleDeletePaste = async (pasteId: string) => {
    toast.loading("Deleting paste...", {
      id: "delete-paste",
    });
    const del = await deletePaste(pasteId);
    if (!del.ok) {
      toast.dismiss("delete-paste");
      toast.error("Failed to delete paste", {
        id: "delete-paste-error",
      });
      return;
    }
    toast.dismiss("delete-paste");
    toast.success("Paste deleted successfully");
    setPastes(pastes.filter((paste) => paste.id !== pasteId));
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["user-pastes", props.userId],
    });
  }, [cursor]);

  useEffect(() => {
    if (data) {
      addPastes(data.pastes);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-2 bg-base-100 p-4 rounded-box">
      <h1 className="text-xl text-base-content/80 font-light px-1">Pastes</h1>
      {!data && isFetching ? (
        <div className="skeleton  w-full h-56"></div>
      ) : (
        <div className="flex flex-wrap gap-0">
          {pastes.length === 0 && (
            <span className="px-1 text-sm text-base-content/70">
              No pastes found, you can{" "}
              <a className="underline " href={PASTE_PATH}>
                create one
              </a>{" "}
              and it will appear here
            </span>
          )}
          {pastes.map((paste) => (
            <PasteCard
              key={paste.id}
              paste={paste}
              handleDeletePaste={handleDeletePaste}
            />
          ))}
          {data?.cursor && (
            <div className="w-full">
              <a
                onClick={() => handleSetCursor(data.cursor)}
                className="btn btn-primary btn-sm"
              >
                {isFetching ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Load more"
                )}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PasteCard = (props: {
  paste: ResponsePaste;
  handleDeletePaste: (pasteId: string) => void;
}) => {
  const { paste, handleDeletePaste } = props;

  return (
    <div key={paste.id} className="p-1 h-56  w-full md:w-1/5">
      <div className="flex flex-col gap-1 border border-base-content/15 p-4 rounded-box w-full h-full">
        <h2 className="text-lg font-semibold">
          {paste.title == "none" ? `Paste #${paste.id}` : paste.title}
        </h2>
        <p className="text-sm text-gray-500">
          {humanizeDate(paste.createdAt.toString())}
        </p>
        <div className="grow"></div>
        <div className="flex gap-1 flex-wrap self-end">
          <ButtonWithConfirmation
            callback={() => handleDeletePaste(paste.id)}
            className="btn btn-xs btn-warning  "
            value="Delete"
          />
          <a
            href={paste.link}
            className="btn btn-xs btn-ghost bg-base-content/5 "
          >
            Go to paste
          </a>
        </div>
      </div>
    </div>
  );
};
