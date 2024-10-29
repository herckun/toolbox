import { useQuery } from "@tanstack/react-query";
import { getPastesForUser } from "./data/paste";
import { useEffect, useState } from "react";
import { queryClient } from "./queryClient";
import type { Paste, ResponsePaste } from "../../lib/handlers/PasteHandler";
import { humanizeDate } from "../../lib/helpers/formatter";

export const UserPastes = (props: { userId: string }) => {
  const [pastes, setPastes] = useState<ResponsePaste[]>([]);
  const [cursor, setCursor] = useState<
    | {
        id: string;
        createdAt: Date;
      }
    | undefined
  >(undefined);
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

  if (isFetching) {
    return <div className="skeleton w-full h-56"></div>;
  }

  return (
    <div className="flex flex-col gap-2 bg-base-100 p-4 rounded-box">
      <h1 className="text-2xl font-semibold">Pastes</h1>
      <div className="flex flex-wrap gap-0">
        {pastes.map((paste) => (
          <PasteCard key={paste.id} paste={paste} />
        ))}
        {data?.cursor && (
          <div className="w-full">
            <a
              onClick={() => handleSetCursor(data.cursor)}
              className="btn btn-sm"
            >
              Load More
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const PasteCard = (props: { paste: ResponsePaste }) => {
  const { paste } = props;
  return (
    <div key={paste.id} className="p-1 h-56  w-1/5">
      <div className="flex flex-col gap-1 border border-base-content/5 p-4 rounded-box w-full h-full">
        <h2 className="text-lg font-semibold">
          {paste.title == "none" ? `Paste #${paste.id}` : paste.title}
        </h2>
        <p className="text-sm text-gray-500">
          {humanizeDate(paste.createdAt.toString())}
        </p>
        <div className="grow"></div>
        <a
          href={paste.link}
          className="btn btn-xs btn-ghost bg-base-content/5 self-end"
        >
          Go to paste
        </a>
      </div>
    </div>
  );
};
