import { Collaboration, ZeroSchema } from "@/schema";
import { Button } from "./Button";
import { useZero } from "@rocicorp/zero/react";

export const PendingRequest = ({
  collaboration,
}: {
  collaboration: Collaboration;
}) => {
    const z = useZero<ZeroSchema>();

    const handleAcceptCollaboration = () => {
        z.mutate.collaboration.update({
            id: collaboration.id,
            status: 'accepted'
        })
    }

    const handleRejectCollaboration = () => {
        z.mutate.collaboration.update({
            id: collaboration.id,
            status: 'rejected'
        })
    }

  return (
    <div>
      <div
        key={collaboration.id}
        className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-lg border border-[#8B4513]"
      >
        <div>
          <h4 className="font-medium text-[#2c2420]">Collaboration Request</h4>
          <p className="text-sm text-[#2c2420]/60">
            {collaboration.boardCreatorId} has asked for permission to join your board
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAcceptCollaboration}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            Accept
          </Button>
          <Button
            onClick={handleRejectCollaboration}
            size="sm"
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};
