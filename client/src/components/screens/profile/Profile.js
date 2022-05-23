import React, { useState, useEffect } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Navbar from "../Navbar";
import PostGrid from "../../posts/PostGrid";

import littleLogo from "../../../assets/logo/logo_little.png";
import { Link, useHistory, useLocation } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState([""]);
  const [error, setError] = useState("");
  const history = useHistory();

  // Modal state handling
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/login");
  };

  const handleAccountDeletion = async () => {
    handleClose();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.delete("/api/profile/deleteaccount", config);
      logoutHandler();
    } catch (error) {
      setError("Error while trying to delete user data.");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    try {
      setUser(JSON?.parse(localStorage.getItem("user")));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="z-50 absolute transform translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] p-6 bg-main-gray rounded-[25px] shadow-md">
          <div className="flex flex-col justify-center gap-6">
            <div className="flex flex-col gap-3 justify-center items-center">
              <span className="flex gap-4">
                <i
                  className="fa fa-times text-white text-2xl cursor-pointer"
                  onClick={() => handleClose()}
                ></i>
                <h2 className="font-bold text-white text-4xl font-poppins">
                  Confirmation de suppression du profil
                </h2>
              </span>
              <p className="font-roboto text-white text-xl">
                Confirmez-vous vouloir supprimer définitivement votre profil ?
              </p>
              <p className="text-warning text-xl">
                (Cette action est irréversible)
              </p>
              <button
                className="font-poppins text-main-black text-xl bg-white rounded-[15px] px-5 py-2 font-bold"
                onClick={() => handleClose()}
              >
                Annuler
              </button>
              <button
                className="font-poppins text-warning text-xl bg-white rounded-[15px] px-5 py-2 font-bold"
                onClick={() => handleAccountDeletion()}
              >
                Supprimer
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <Navbar />
      <div className="bg-main-black min-h-screen flex justify-center items-start h-full">
        <main className="bg-main-gray rounded-[20px] w-[98%] h-full flex flex-col justify-center mt-4 items-center mb-4">
          <section className="w-[98%] mt-4 mb-8 flex flex-col justify-center items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-center gap-4 relative">
                <img
                  src={user?.profilePicture ? user?.profilePicture : littleLogo}
                  alt="profile"
                  className="rounded-[15px] w-[128px]"
                />
                <h1 className="text-white text-4xl font-poppins font-bold">
                  {user?.firstName} {user?.lastName}
                </h1>
              </div>
              <button
                onClick={() => handleOpen()}
                className="font-poppins text-2xl text-warning transition-opacity hover:opacity-70 pr-5"
              >
                Supprimer mon compte
              </button>
            </div>
          </section>
          <section className="bg-main-black w-[98%] rounded-[20px] mb-4 flex flex-col p-4">
            <h1 className="text-white text-4xl font-poppins font-bold">
              Vos postes
            </h1>
            <div>
              {user?.posts?.length ? (
                <div className="text-center my-4">
                  <PostGrid data={user?.posts} />
                </div>
              ) : (
                <div className="text-center my-4">
                  <h1 className="text-white font-poppins text-2xl">
                    Vous n'avez pas encore créé de poste.
                  </h1>
                  <Link
                    to="createpost"
                    className="text-link font-poppins text-xl"
                  >
                    Créer votre premier poste !
                  </Link>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Profile;
