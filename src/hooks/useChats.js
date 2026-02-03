import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useConversations = () => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const res = await api.get('/api/chats');
            return res.data;
        },
    });
};
