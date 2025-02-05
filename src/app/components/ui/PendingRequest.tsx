import { Collaboration, User, ZeroSchema } from "@/schema";
import { Button } from "./Button";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery as useReactQuery } from "@tanstack/react-query";
import { BASE_API_URL } from "@/constants";
export const PendingRequest = ({
  collaboration,
}: {
  collaboration: Collaboration & {
    user: User;
  };
}) => {
  const z = useZero<ZeroSchema>();
  const [board] = useQuery(z.query.board.where('id', '=', collaboration.boardId).one());
  const {user} = collaboration;

  const handleAcceptCollaboration = () => {
    z.mutate.collaboration.update({
      id: collaboration.id,
      status: "accepted",
    });
  };

  const handleRejectCollaboration = () => {
    z.mutate.collaboration.update({
      id: collaboration.id,
      status: "rejected",
    });
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      key={collaboration.id}
      className="p-4 bg-[#FDFBF7] rounded-xl border-2 border-[#8B4513]/30 shadow-lg hover:shadow-xl transition-all min-h-[100px] h-full"
    >
      <div className="flex flex-col h-full justify-between gap-4">

        <div className="flex items-start gap-3">
          <img src={user?.imageUrl ?? ""} alt={user?.name ?? ""} className="w-8 h-8 mt-1 rounded-full shadow-md object-cover" />
          <div className="flex flex-col">
            <h4 className="text-lg font-serif text-[#2c2420] font-bold">
              New Case Partner
            </h4>
            <p className="text-sm font-mono text-[#2c2420]/70">
              <span className="font-semibold text-[#8B4513]">{user?.name} </span> 
              requests to join 
              <span className="font-bold text-slate-900 "> {board?.title}</span>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-1 ">
          <Button
            size="sm"
            onClick={handleAcceptCollaboration}
            className=" text-sm bg-[#8B4513] hover:bg-[#B4540A] text-[#FDFBF7] px-2"
          >
            Accept
          </Button>
          <Button
            size="sm"
            onClick={handleRejectCollaboration}
            variant="outline"
            className="text-sm border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-2"
          >
            Reject
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
