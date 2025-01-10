import { BASE_API_URL, isDevelopment } from "@/constants";
import { Replicache } from "replicache";
import { mutators } from "./mutators";


export const createReplicacheInstance = (boardId: string) => {
  const name = isDevelopment ? `case-files-${boardId}-dev` : `case-files-${boardId}`;

  return new Replicache({
    name,
    licenseKey: import.meta.env.VITE_REPLICACHE_LICENSE_KEY,
    pushURL: `${BASE_API_URL}/replicache/push/${boardId}`,
    pullURL: `${BASE_API_URL}/replicache/pull/${boardId}`,
    mutators,
    logLevel: 'debug',
  });
};


    