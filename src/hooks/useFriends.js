import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useFriends = () => {
    return useQuery({
        queryKey: ['friends'],
        queryFn: async () => {
            const res = await api.get('/api/friends');
            return res.data;
        },
    });
};

export const useFriendRequests = () => {
    return useQuery({
        queryKey: ['friendRequests'],
        queryFn: async () => {
            const res = await api.get('/api/friends/requests');
            return res.data;
        },
    });
};

export const useRespondToRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ requestId, status }) => {
            const res = await api.put(`/api/friends/respond/${requestId}`, { status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};
