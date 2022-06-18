import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import DarkModeSwitch from "./DarkModeSwitch";
import { Flex, Text } from "@chakra-ui/layout";
import { Button, Image } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/color-mode";
import { BellIcon } from "@chakra-ui/icons";

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { colorMode } = useColorMode();
  const [session, loading] = useSession();
  const router = useRouter();

  return (
    <Flex
      dir="row"
      justifyContent="space-between"
      w="100%"
      py={4}
      as="header"
      px="1rem"
      borderBottom="1px solid rgba(255, 255, 255, 0.16)"
      height="4rem"
    >
      <Flex alignItems="center">
        <BellIcon
          color={colorMode === "dark" ? "white" : "black"}
          fontSize="1.6rem"
        />
      </Flex>
      <Flex dir="row">
        {!session && (
          <Button
            as="a"
            href={`/api/auth/signin`}
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Sign In
          </Button>
        )}
        {session && (
          <Flex dir="row" alignItems="center">
            <DarkModeSwitch />
            <Button
              as="a"
              href={`/api/auth/signout`}
              onClick={(e) => {
                e.preventDefault();
                signOut();
                router.push("/");
              }}
              mx="8px"
            >
              Sign Out
            </Button>
            <Image
              borderRadius="full"
              boxSize="40px"
              src={session.user.image}
              alt={session.user.name}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
