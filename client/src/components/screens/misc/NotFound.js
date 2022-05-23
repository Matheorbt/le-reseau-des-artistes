import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-screen bg-main-blue">
        <h1 className="text-9xl font-bold">
          <span className="text-main-orange">404</span>{" "}
          <span className="text-main-orange">page not found</span>
        </h1>
        <Link
          to="/homepage"
          style={{
            fontStyle: "bold",
            fontSize: "4rem",
            color: "white",
          }}
        >
          Accueil
        </Link>
      </div>
    </>
  );
};

export default NotFound;
