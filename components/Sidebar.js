import Link from "next/link";
import { VStack } from "@chakra-ui/react";
import AddNewRoom from "./AddNewRoom/AddNewRoom";
import { StyledSidebar } from "./styles";

const Sidebar = () => {
  return (
    <StyledSidebar>
      <VStack alignItems="flex-start">
        <Link href="/rooms">
          <a>Rooms</a>
        </Link>
      </VStack>
      <AddNewRoom />
    </StyledSidebar>
  );
};

export default Sidebar;
