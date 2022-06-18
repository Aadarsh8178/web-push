import { Provider } from "next-auth/client";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { Flex, Stack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import useStore from "../store";
import { SET_USER } from "../store/selectors";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
const httpLink = createHttpLink({
  uri: "https://creative-caiman-82.hasura.app/v1/graphql",
});

let getClient = async () => {
  const session = await fetch("/api/auth/session").then((res) => res.json());
  console.log("SESSION API CALL", session);
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: session ? `Bearer ${session.token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return { client, session };
};

export default function App({ Component, pageProps }) {
  const [client, setClient] = useState();
  const setUser = useStore(SET_USER);
  useEffect(() => {
    (async () => {
      const { client, session } = await getClient();
      setClient(client);
      if (session?.user) {
        setUser({ ...session.user, image: session.image });
      } else {
        setUser(null);
      }
    })();
  }, []);

  return (
    <Provider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      options={{
        // Client Max Age controls how often the useSession in the client should
        // contact the server to sync the session state. Value in seconds.
        // e.g.
        // * 0  - Disabled (always use cache value)
        // * 60 - Sync session state with server if it's older than 60 seconds
        clientMaxAge: 0,
        // Keep Alive tells windows / tabs that are signed in to keep sending
        // a keep alive request (which extends the current session expiry) to
        // prevent sessions in open windows from expiring. Value in seconds.
        //
        // Note: If a session has expired when keep alive is triggered, all open
        // windows / tabs will be updated to reflect the user is signed out.
        keepAlive: 0,
      }}
      session={pageProps?.session}
    >
      <ChakraProvider>
        {client ? (
          <ApolloProvider client={client}>
            <div>
              <Header />
              <Flex style={{ marginTop: "0 !important" }}>
                <Sidebar />
                <div style={{ width: "100%" }}>
                  <Component {...pageProps} />
                </div>
              </Flex>
            </div>
          </ApolloProvider>
        ) : (
          <Flex align="center" justify="center" w="100vw" height="100vh">
            <Spinner size="lg" />
          </Flex>
        )}
      </ChakraProvider>
    </Provider>
  );
}
