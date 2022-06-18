import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ROOMS } from "../graphql/queries";
import PageSpinner from "../components/PageSpinner";

const rooms = () => {
  const { loading, error, data } = useQuery(GET_ROOMS);
  console.log(data);
  if (loading) {
    return <PageSpinner />;
  }
  return <div>Rooms</div>;
};

export default rooms;
