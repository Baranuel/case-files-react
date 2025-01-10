
import { useEffect } from "react";
import { useReplicache } from "@/app/providers/ReplicacheProvider";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { BASE_WS_URL } from "@/constants";

export const TriggerReplicachePull= ({boardId}: {boardId: string}) => {
    const {rep} = useReplicache()   
    const {lastMessage, readyState} = useWebSocket(`${BASE_WS_URL}/${boardId}`) 

    const pullNewData = async () => {
        console.log("pulling new data");
        await rep?.pull();
      };
    
      useEffect(() => {
        if (readyState !== ReadyState.OPEN) return;
        if(!lastMessage?.data) return
        if(JSON.parse(lastMessage?.data).type !== 'poke') return
          pullNewData();
      }, [readyState, lastMessage]);

  return null;
};
