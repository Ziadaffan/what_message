import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useSearchUsers = (searchTerm) => {
    return useQuery({
        queryKey: ['searchUsers', searchTerm],
        queryFn: async () => {
            if (!searchTerm || searchTerm.length < 2) return [];
            const res = await api.get(`/api/users/search?q=${searchTerm}`);
            return res.data;
        },
        enabled: !!searchTerm && searchTerm.length >= 2,
    });
};

export const useSendFriendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (receiverId) => {
            const res = await api.post('/api/friends/invite', { receiver_id: receiverId });
            return res.data;
        },
        onSuccess: () => {
            // Optionally invalidate something if needed, though search results might not change immediately
            // but friend requests list for the 'sender' isn't really affected in the UI unless we show "pending"
        },
    });
};
