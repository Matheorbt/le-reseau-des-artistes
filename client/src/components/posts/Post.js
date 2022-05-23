import React, { useState, useEffect } from "react";
import axios from "axios";

import littleLogo from "../../assets/logo/logo_little.png";

import musicLogo from "../../assets/logo/logo_music.png";
import bookLogo from "../../assets/logo/logo_book.png";
import videoLogo from "../../assets/logo/logo_video.png";

import ContentType from "./ContentType";
import { Link } from "react-router-dom";

const Post = (postID) => {
  const [post, setPost] = useState([""]);
  const [author, setAuthor] = useState([""]);
  const [user, setUser] = useState([""]);
  const [error, setError] = useState([""]);
  const [loading, setLoading] = useState(true);
  const id = postID.postID;

  const getPostById = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      const { data } = await axios.get("/api/post/postbyid/" + id, config);
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
    getCurrentUser();
    getPostById();
  }, []);

  const handlePictureDisplay = () => {
    switch (contentType) {
      case "music":
        return (
          <img
            className="rounded-[15px] w-[250px] h-[120px] z-20 relative object-cover"
            src={musicLogo}
            alt="content"
          />
        );
      case "book":
        return (
          <img
            className="rounded-[15px] w-[250px] h-[120px] z-20 relative object-cover"
            src={bookLogo}
            alt="content"
          />
        );
      case "image":
        return (
          <img
            className="rounded-[15px] w-[250px] h-[120px] z-20 relative object-cover"
            src={content}
            alt="content"
          />
        );
      case "video":
        return (
          <img
            className="rounded-[15px] w-[250px] h-[120px] z-20 relative object-cover"
            src={videoLogo}
            alt="content"
          />
        );
      default:
        break;
    }
  };

  const { title, like, content, contentType } = post;
  return (
    <Link to={"/post/" + id}>
      <div className="max-w-[400px] relative">
        {handlePictureDisplay()}
        <img
          className="w-[60px] rounded-[15px] mt-auto z-30 absolute left-[-10px] bottom-[-20px]"
          src={author?.profilePicture ? author?.profilePicture : littleLogo}
          alt="profile"
        />
        <div className="bg-main-gray rounded-[15px] absolute w-[250px] h-[120px] left-5 top-10 z-10 flex gap-10 flex-reverse justify-end items-end">
          <h1 className="font-bold text-poppins text-white mb-2 text-xl">
            {title}
          </h1>
          <span className="mb-1">
            <ContentType contentType={contentType} />
          </span>
          <span className="mb-2 flex items-center justify-center gap-3 mr-2">
            <p className="font-bold text-poppins text-white">{like}</p>
            {user?.likedPosts?.includes(post) ? (
              <i class="fa fa-heart-o text-warning" aria-hidden="true"></i>
            ) : (
              <i class="fa fa-heart-o text-white" aria-hidden="true"></i>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Post;
