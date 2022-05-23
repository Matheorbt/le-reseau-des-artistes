import React, { useEffect, useState } from "react";
import Navbar from "../screens/Navbar";
import axios from "axios";

import ReactPlayer from "react-player";

import { Document, Page, pdfjs } from "react-pdf";
import littleLogo from "../../assets/logo/logo_little.png";
import bigLogo from "../../assets/logo/logo_big.png";

import ContentType from "./ContentType";
import CommentSection from "../comments/CommentSection";

const PostOverview = ({ match }) => {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [post, setPost] = useState([""]);
  const [author, setAuthor] = useState([""]);
  const [user, setUser] = useState([""]);
  const [error, setError] = useState([""]);
  const [loading, setLoading] = useState(true);

  const [commentContent, setCommentContent] = useState("");

  // Modal state handling
  const [open, setOpen] = useState(false);

  // Book handling
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleNextPage = () => {
    let newIndex;

    pageNumber + 1 <= numPages
      ? (newIndex = pageNumber + 1)
      : (newIndex = pageNumber);
    setPageNumber(newIndex);
  };

  const handlePreviousPage = () => {
    let newIndex;

    pageNumber - 1 > 0 ? (newIndex = pageNumber - 1) : (newIndex = pageNumber);
    setPageNumber(newIndex);
  };

  const postID = match.params.postID;

  const handleLike = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.patch(
        "/api/post/like/" + postID,
        {
          user,
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

  const handleLikeDisplay = () => {
    let bool = false;

    user?.likedPosts?.forEach((likedPost) => {
      if (likedPost._id === post._id) {
        bool = true;
      }
    });
    return bool;
  };

  const handleSaveDisplay = () => {
    let bool = false;

    user?.savedPosts?.forEach((savedPost) => {
      console.log("likedpost._id", savedPost._id);
      console.log("post._id", post._id);
      console.log(savedPost._id === post._id);
      if (savedPost._id === post._id) {
        bool = true;
      }
    });
    return bool;
  };

  const handleSave = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.patch(
        "/api/post/save/" + postID,
        {
          user,
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

  const getPostById = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get("/api/post/postbyid/" + postID, config);
      setPost(data.post);
      getUserById(data.post?.author);
      setLoading(!loading);
    } catch (error) {
      setError("Error while trying to retrieve user infos");
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

  const handleCommentCreation = async (e) => {
    const isReply = false;
    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      await axios.post(
        "/api/comment/create",
        {
          commentContent,
          user,
          post,
          isReply,
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

  useEffect(() => {
    getPostById();
    try {
      setUser(JSON?.parse(localStorage.getItem("user")));
    } catch (error) {
      console.log(error);
    }
  }, [setUser]);

  const handleContentFormat = () => {
    switch (post?.contentType) {
      case "music":
        return (
          <audio src={post?.content} controls>
            Your browser does not support the audio element.
          </audio>
        );
      case "book":
        return (
          <div>
            <Document
              file={post?.content}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pageNumber} />
            </Document>
            <div className="flex justify-between my-2">
              <button
                className="text-white font-poppins font-bold"
                onClick={() => handlePreviousPage()}
              >
                Page précedente
              </button>
              <p className="text-white font-poppins">
                Page {pageNumber} sur {numPages}
              </p>
              <button
                className="text-white font-poppins font-bold"
                onClick={() => handleNextPage()}
              >
                Page suivante
              </button>
            </div>
          </div>
        );
      case "image":
        return (
          <img
            className="rounded-[15px] relative"
            src={post?.content ? post?.content : bigLogo}
            alt="content"
          />
        );
      case "video":
        return (
          <ReactPlayer
            url={post?.content}
            controls
            playing
            muted
            width="100%"
          />
        );
      default:
        break;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-main-black flex flex-col items-center pt-6">
        <main className="bg-main-gray rounded-[20px] w-[98%] min-h-[50%] flex flex-col justify-center pt-4 items-center mb-4">
          {/* Content */}
          <section className="flex flex-col justify-center items-center w-[98%]">
            <span className="flex items-center justify-center gap-4">
              <h1 className="text-white font-bold font-poppins text-4xl text-center my-4">
                {post?.title}
              </h1>
              <ContentType contentType={post?.contentType} />
            </span>
            {handleContentFormat()}
            <div className="flex items-center justify-between w-full my-4">
              <span className="flex items-center gap-4">
                <img
                  className="w-[60px] rounded-[15px]"
                  src={
                    author?.profilePicture ? author?.profilePicture : littleLogo
                  }
                  alt="profile"
                />
                <h1 className="text-white font-bold text-4xl">
                  {author?.firstName} {author?.lastName}
                </h1>
              </span>
              <span className="flex items-center justify-center gap-3">
                <p className="font-bold text-poppins text-4xl text-white">
                  {post?.like >= 0 ? post?.like : 0}
                </p>
                <button
                  onClick={() => handleLike()}
                  className="hover:cursor-pointer"
                >
                  {handleLikeDisplay() ? (
                    <i
                      class="fa fa-heart text-warning  text-3xl"
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      class="fa fa-heart-o text-white text-3xl"
                      aria-hidden="true"
                    ></i>
                  )}
                </button>
                <button
                  onClick={() => handleSave()}
                  className="hover:cursor-pointer"
                >
                  {handleSaveDisplay() ? (
                    <i
                      class="fa fa-bookmark text-white text-3xl"
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      class="fa fa-bookmark-o text-white text-3xl"
                      aria-hidden="true"
                    ></i>
                  )}
                </button>
              </span>
            </div>
          </section>
          {/* Description */}
          {post?.description ? (
            <section className="max-w-[80%]">
              <article>
                <h1 className="text-white font-bold font-poppins text-4xl text-center my-4">
                  Description
                </h1>
                <p className="text-white font-roboto text-lg text-left p-4">
                  {post?.description}
                </p>
              </article>
            </section>
          ) : null}
          {post?.description ? <hr className="text-white w-[90%]" /> : null}
          {/* Comment section */}
          <section className="flex flex-col content-center items-center w-[98%]">
            <h1 className="text-white font-bold font-poppins text-4xl my-4">
              Commentaires
            </h1>
            <div className="w-[98%]">
              <form
                onSubmit={() => handleCommentCreation()}
                className="flex flex-col gap-3 p-4"
              >
                <label
                  className="text-white font-roboto text-2xl"
                  htmlFor="name"
                >
                  Écrire un commentaire
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
            {post?.comments?.length ? (
              <CommentSection data={post?.comments} post={post} user={user} />
            ) : (
              <div className="text-center my-4">
                <h1 className="text-white font-poppins text-2xl">
                  Aucun commentaire n'a encore été laissé, soyez le premier !
                </h1>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default PostOverview;
