import React, { useEffect } from "react";

const ContentType = (contentType) => {
  const cotentTypeString = contentType.contentType;

  switch (cotentTypeString) {
    case "book":
      return (
        <i className="fa fa-book text-white text-2xl" aria-hidden="true"></i>
      );
    case "video":
      return (
        <i
          className="fa fa-file-video-o text-white text-2xl"
          aria-hidden="true"
        ></i>
      );
    case "music":
      return (
        <i className="fa fa-music text-white text-2xl" aria-hidden="true"></i>
      );
    case "image":
      return (
        <i
          className="fa fa-file-image-o text-white text-2xl"
          aria-hidden="true"
        ></i>
      );
    default:
      return <i class="fa fa-question" aria-hidden="true"></i>;
  }
};

export default ContentType;
