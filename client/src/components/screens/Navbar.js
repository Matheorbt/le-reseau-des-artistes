import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import decode from "jwt-decode";

const Navbar = () => {
  const [user, setUser] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const history = useHistory();
  const currentPage = location.pathname.substring(1);
  var formattedCurrentPage;

  switch (currentPage) {
    case "likedposts":
      formattedCurrentPage = "Postes aimés";
      break;
    case "profile":
      formattedCurrentPage = "Votre profil";
      break;
    case "feed":
      formattedCurrentPage = "Derniers posts";
      break;
    case "savedposts":
      formattedCurrentPage = "Postes sauvegardés";
      break;
    case "createpost":
      formattedCurrentPage = "Créer un post";
      break;
    default:
      formattedCurrentPage = undefined;
  }

  const toggleMenu = () => {
    const sideBar = document.getElementById("side-bar");
    const blur = document.getElementById("bg-blur");

    sideBar.classList.toggle("translate-x-[-100%]");
    blur.classList.toggle("opacity-0");
    blur.classList.toggle("opacity-70");
  };

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  const getCurrentUser = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get("/api/profile/info", config);
      setUser(data.data);
      setLoading(false);
      localStorage.setItem("user", JSON.stringify(data.data));
    } catch (error) {
      setError("Error while trying to retrieve user infos");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      history.push("/login");
    }
    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logoutHandler();
      }
      getCurrentUser();
    }
  }, [location, history, !user]);
  return (
    <>
      <nav className="bg-main-gray flex items-center justify-between p-6 z-50 min-h-[10vh]">
        <Link to="/feed" className="text-white font-poppins font-bold text-2xl">
          Le Réseau Des Artistes
        </Link>
        <h1 className="text-white text-2xl font-poppins font-bold">
          {formattedCurrentPage}
        </h1>
        <div className="flex flex-col gap-2">
          <button onClick={() => toggleMenu()}>
            <i
              className="fa fa-bars text-white text-4xl"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      </nav>
      <div
        id="bg-blur"
        className="absolute w-[100vw] h-[90vh] bg-black opacity-0 top-[10vh]  z-50  pointer-events-none transition-opacity"
      ></div>
      <nav
        className="flex flex-col justify-between bg-main-gray min-w-[35vw] h-[90vh]  z-50  absolute transition translate-x-[-100%]"
        id="side-bar"
      >
        <button onClick={() => toggleMenu()} className=" absolute right-2">
          <i class="fa fa-times text-4xl text-white" aria-hidden="true"></i>
        </button>
        <ul className="flex flex-col justify-start items-start gap-6 pl-4">
          <li>
            <Link
              to="/feed"
              className="flex justify-center items-center gap-2 transition-opacity hover:opacity-70"
            >
              <i class="fa fa-bars text-white text-4xl" aria-hidden="true"></i>{" "}
              <h1 className="text-2xl font-poppins font-bold text-white">
                Derniers postes
              </h1>
            </Link>
          </li>
          <li>
            <Link
              to="/createpost"
              className="flex justify-center items-center gap-2 transition-opacity hover:opacity-70"
            >
              <i
                class="fa fa-plus-circle text-white text-4xl"
                aria-hidden="true"
              ></i>{" "}
              <h1 className="text-2xl font-poppins font-bold text-white">
                Partager du contenu
              </h1>
            </Link>
          </li>
          <li>
            <Link
              to="/savedposts"
              className="flex justify-center items-center gap-2 transition-opacity hover:opacity-70"
            >
              <i
                class="fa fa-bookmark text-white text-4xl"
                aria-hidden="true"
              ></i>{" "}
              <h1 className="text-2xl font-poppins font-bold text-white">
                Postes sauvegardés
              </h1>
            </Link>
          </li>
          <li>
            <Link
              to="/likedposts"
              className="flex justify-center items-center gap-2 transition-opacity hover:opacity-70"
            >
              <i class="fa fa-heart text-white text-4xl" aria-hidden="true"></i>{" "}
              <h1 className="text-2xl font-poppins font-bold text-white">
                Postes aimés
              </h1>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex justify-center items-center gap-2 transition-opacity hover:opacity-70"
            >
              <i class="fa fa-user text-white text-4xl" aria-hidden="true"></i>{" "}
              <h1 className="text-2xl font-poppins font-bold text-white">
                Profil
              </h1>
            </Link>
          </li>
        </ul>
        <div className="flex flex-col items-center gap-3 pb-2 justify-center">
          <hr className="text-white w-[90%]" />
          <button
            onClick={() => logoutHandler()}
            className="font-poppins text-2xl text-warning transition-opacity hover:opacity-70"
          >
            Déconnexion
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
