import { useAuth } from "@clerk/clerk-react";

type UseAuthReturnType = ReturnType<typeof useAuth>;

export type RouterContext = {
    auth: UseAuthReturnType | null;
}