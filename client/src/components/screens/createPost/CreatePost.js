import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState(undefined);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [contentType, setContentType] = useState("");

  // Modal state handling
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const defineContentType = (file) => {
    const { type } = file;
    const formattedType = type.split("/")[0];
    let contentType;

    switch (formattedType) {
      case "image":
        contentType = "image";
        break;
      case "video":
        contentType = "video";
        break;
      case "audio":
        contentType = "music";
        break;
      default:
        contentType = "book";
        break;
    }
    return contentType;
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
    setFile(file);
    setContentType(defineContentType(file));
  };

  const postHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("object", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("contentType", contentType);
    formData.append("fileName", fileName);
    formData.append("author", JSON.stringify(author));

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };

    try {
      await axios
        .post("/api/post/createpost", formData, config)
        .then((response) => {
          handleOpen();
        })
        .catch(function (error) {
          console.log(error);
        });
      setOpen(true);
    } catch (error) {
      setError(error.response.data.error);
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
      setAuthor(data.data);
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
                  Post créé avec succès !
                </h2>
              </span>
              <button
                className="font-poppins text-main-black text-xl bg-white rounded-[15px] px-5 py-2 font-bold"
                onClick={() => handleClose()}
              >
                Ok
              </button>
            </div>
          </div>
        </Box>
      </Modal>
      <Navbar />
      <div className="bg-main-black min-h-screen flex justify-center">
        <main className="bg-main-gray rounded-[20px] w-[98%] flex flex-col justify-center mt-4 items-center mb-4">
          {success ? (
            <div className="bg-main-black w-[98%] rounded-[20px] py-5">
              <h1 className="font-poppins text-2xl text-white">{success}</h1>
            </div>
          ) : null}
          <form
            onSubmit={postHandler}
            action=""
            className="form-auth"
            id="uploadForm"
          >
            <h3 className="text-4xl text-center font-bold text-white">
              Détails du post
            </h3>
            {error && <span className="text-warning font-bold">{error}</span>}
            <div className="form-group">
              <label className="text-xl font-roboto text-white" htmlFor="name">
                Titre:
              </label>
              <input
                type="text"
                required
                id="title"
                placeholder="Préciser un titre"
                autoComplete="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                tabIndex={1}
              />
            </div>
            <div className="form-group">
              <label className="text-xl font-roboto text-white" htmlFor="name">
                Description:
              </label>
              <input
                type="text"
                id="description"
                placeholder="Description(optionel)"
                autoComplete="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                tabIndex={2}
              />
            </div>
            <label className="text-xl font-roboto text-white" htmlFor="name">
              Télécharger:
            </label>
            <input
              type="file"
              id="filePicker"
              autoComplete="text"
              onChange={onChange}
              className="input"
              tabIndex={5}
            />
            <button type="submit" className="white-btn" tabIndex={3}>
              Publier
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export default CreatePost;
