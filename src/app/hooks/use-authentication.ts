import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

export const useAuthentication = () => { 
    const [token, setToken] = useState<string | null>(null);
    const {getToken} = useAuth();

    const getAuthToken = async () => {
        const token = await getToken({ template: "casefiles" });
        return token
    };

    useEffect(() => {
        getAuthToken().then( t => {
            setToken(t)
        });
    }, []);
    
    return token
};