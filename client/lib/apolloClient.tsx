// client/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useMemo } from 'react';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

let apolloClient: ApolloClient<any>;

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Update to match your server's URL
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Add any custom headers if necessary
    },
  };
});

// Create a WebSocket link for subscriptions
const wsLink = process.browser ? new WebSocketLink({
  uri: 'ws://localhost:4000/graphql', // WebSocket URL for subscriptions
  options: {
    reconnect: true, // Automatically reconnect if the connection is lost
  },
}) : null;

// Use split to direct operations to the correct link
const splitLink = process.browser && wsLink ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
) : authLink.concat(httpLink);

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // Disable force-fetching on the server
    link: splitLink,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = undefined) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore(Object.assign({}, existingCache, initialState));
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}