import { Spinner } from "@chakra-ui/spinner";
import React from "react";

const PageSpinner = () => {
  return (
    <div
      style={{
        height: "calc(100vh - 4rem)",
        width: "100%",
        display: "grid",
        placeContent: "center",
      }}
    >
      <Spinner />
    </div>
  );
};

export default PageSpinner;
