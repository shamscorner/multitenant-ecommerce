import { cache } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query';

import 'server-only'; // <-- ensure this file cannot be imported from the client

import { appRouter } from './routers/_app';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  queryClient: getQueryClient,
  router: appRouter,
});
export const caller = appRouter.createCaller(createTRPCContext);
// If your router is on a separate server, pass a client:
// createTRPCOptionsProxy({
//   client: createTRPCClient({
//     links: [httpLink({ url: '...' })],
//   }),
//   queryClient: getQueryClient,
// });

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
