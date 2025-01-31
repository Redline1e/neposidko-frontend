import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Типи для відповіді та запиту
type ResponseType = InferResponseType<typeof client.api.products.$post>;
type RequestType = InferRequestType<typeof client.api.products.$post>['json'];

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.products.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Product Created');
      // Оновлення кешу, якщо потрібно
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast.error('Failed to Create Product');
    },
  });
  return mutation;
};
