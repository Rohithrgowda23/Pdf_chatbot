import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentApi } from '../api/document.api';

export function useDocuments() {
    const queryClient = useQueryClient();

    const {
        data: documents = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ['documents'],
        queryFn: async () => {
            const res = await documentApi.getAll();
            return res.data?.content || res.data || [];
        },
        refetchInterval: (query) => {
            const data = query.state.data;
            const hasProcessing = (Array.isArray(data) ? data : []).some(
                (d) => d.status === 'UPLOADING' || d.status === 'PROCESSING'
            );
            return hasProcessing ? 3000 : false;
        },
    });

    const { mutateAsync: uploadDocument, isPending: isUploading } = useMutation({
        mutationFn: ({ formData, onProgress }) =>
            documentApi.upload(formData, onProgress),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
    });

    const { mutate: deleteDocument, isPending: isDeleting } = useMutation({
        mutationFn: (id) => documentApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
    });

    return {
        documents,
        isLoading,
        isError,
        refetch,
        uploadDocument,
        isUploading,
        deleteDocument,
        isDeleting,
    };
}
