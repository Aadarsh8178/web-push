import { gql } from "@apollo/client";

export const CREATE_ROOM = gql`
  mutation MyMutation(
    $creator_id: String!
    $desc: String!
    $icon: String
    $name: String!
    $public: Boolean
  ) {
    insert_rooms_one(
      object: {
        creator_id: $creator_id
        desc: $desc
        icon: $icon
        name: $name
        public: $public
      }
    ) {
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
