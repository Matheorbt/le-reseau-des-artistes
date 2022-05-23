import React, { useState, useEffect } from "react";
import axios from "axios";

import CommentSection from "./CommentSection";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const Comment = (props) => {
  const [comment, setComment] = useState([]);
  const [author, setAuthor] = useState([""]);
  const [commentContent, setCommentContent] = useState("");
  const [user, setUser] = useState(props.user);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Modal state handling
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePermissionDisplay = () => {
    let bool = false;

    user?.comments?.forEach((commentUser) => {
      if (commentUser._id === comment._id) {
        bool = true;
      }
    });
    return bool;
  };

  const handleCommentCreation = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const userID = props.user;
    console.log(props.user);
    try {
      await axios.post(
        "/api/comment/createreply",
        {
          commentContent,
          userID,
          comment,
        },
        config
      );
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const getUserById = async (userId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const { data } = await axios.get(
        "/api/profile/getbyid/" + userId,
        config
      );
      setAuthor(data.data);

      setLoading(!loading);
    } catch (error) {
      setError("Error while trying to retrieve user infos");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const getCommentByid = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const { data } = await axios.get(
        "/api/comment/getbyid/" + props.data,
        config
      );
      setComment(data.comment);
      getUserById(data?.comment?.author);
      setLoading(!loading);
    } catch (error) {
      setError("Error while trying to retrieve user infos");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const handleModificationComment = () => {};

  const handleDelete = () => {
    comment?.isReply ? deleteReply() : deleteComment();
  };

  const deleteComment = async () => {
    const post = props.post;
    handleClose();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      await axios.delete(
        "/api/comment/deletecommentbyid/" + comment._id,
        { user, post },
        config
      );
    } catch (error) {
      setError("Error while trying to delete comment");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const deleteReply = async () => {
    handleClose();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      await axios.delete(
        "/api/comment/deletereplybyid/" + comment._id,
        user,
        config
      );
    } catch (error) {
      console.log(error.message);
      setError("Error while trying to delete reply");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const handleDeleteComment = async () => {
    handleOpen();
  };

  useEffect(() => {
    getCommentByid();
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
                  Confirmation de suppression du commentaire
                </h2>
              </span>
              <p className="font-roboto text-white text-xl">
                Confirmez-vous vouloir supprimer définitivement votre
                commentaire ?
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
                onClick={() => handleDelete()}
              >
                Supprimer
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <div className="flex flex-col items-end">
        <div className="bg-main-black w-full rounded-[15px] relative">
          {handlePermissionDisplay() ? (
            <span className="flex gap-4 w-full justify-end pr-5 pt-5">
              <button
                className="hover:cursor-pointer"
                onClick={() => handleDeleteComment()}
              >
                <i
                  class="fa fa-trash text-white text-xl"
                  aria-hidden="true"
                ></i>
              </button>
              <button onClick={() => handleModificationComment()}>
                <i
                  class="fa fa-pencil text-white text-xl"
                  aria-hidden="true"
                ></i>
              </button>
            </span>
          ) : null}
          <p className="text-white font-roboto text-xl p-4 mb-10">
            {comment?.content}
          </p>
          <img
            className="w-[60px] rounded-[15px] mt-auto z-30 absolute left-[-10px] bottom-[-20px]"
            src={author?.profilePicture}
            alt="profile"
          />
          <div className="flex justify-between w-[95%] ml-auto">
            <h1 className="text-white font-bold text-2xl mb-2">
              {author?.firstName} {author?.lastName}
            </h1>
          </div>
        </div>
        <div className="w-[98%] ml-auto">
          <form
            onSubmit={() => handleCommentCreation()}
            className="flex flex-col gap-3 p-4"
          >
            <label className="text-white font-roboto text-2xl" htmlFor="name">
              Répondre
            </label>
            <textarea
              type="text"
              required
              placeholder="Contenu de votre commentaire"
              autoComplete="no"
              className="font-roboto bg-transparent border-b-2 border-white text-white"
              onChange={(e) => setCommentContent(e.target.value)}
              tabIndex={1}
            />
            <div className="flex flex-col gap-3">
              <button
                className="bg-white p-2 rounded-xl font-bold font-poppins text-main-black w-fit-content"
                type="submit"
                tabIndex={2}
                onClick={(e) => handleCommentCreation(e)}
              >
                Poster
              </button>
            </div>
          </form>
        </div>
        {comment?.reply?.length ? (
          <div className="w-[90%]">
            <CommentSection
              data={comment?.reply}
              user={props.user}
              post={props.post}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Comment;
