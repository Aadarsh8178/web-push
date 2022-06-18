import { gql } from "@apollo/client";
export const GET_ROOMS = gql`
  query GetRooms {
    rooms {
      created_at
      creator_id
      desc
      icon
      id
      name
      public
    }
  }
`;
