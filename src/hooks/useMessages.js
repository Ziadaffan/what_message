import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useMessageHistory = (friendId) => {
    return useQuery({
        queryKey: ['messages', friendId],
        queryFn: async () => {
            if (!friendId) return [];
            const res = await api.get(`/api/messages/history/${friendId}`);
            return res.data.messages;
        },
        enabled: !!friendId,
    });
};
