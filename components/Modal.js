import React from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import imageExists from "image-exists";
import { toast, ToastContainer } from "react-toastify";
import { useContext } from "react";
import { MainContext } from "../context/mainContext";
import axios from "axios";

const Modal = () => {
  const { user, setTopics, topics } = useContext(MainContext);

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [userInput, setUserInput] = useState("");
  const [previewContent, setPreviewContent] = useState(null);

  const checkImg = (src) => {
    const res = imageExists(src, function (exists) {
      if (exists) {
        return true;
      } else {
        return false;
      }
    });
    return res;
  };

  const imgExtensionRegex =
    /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/;

  const getYoutubeId = (url) => {
    const regExp =
      /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : false;
  };

  const YOUTUBE_REGEX =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/g;

  useEffect(() => {
    setPreviewContent(
      userInput
        .replace(/\n/g, " newLine ")
        .split(" ")
        .map((word, i) => {
          if (word === "newLine") {
            return <br key={i}></br>;
          } else if (checkImg(word) || word.match(imgExtensionRegex)) {
            return (
              <>
                <img
                  style={{ width: "400px", height: "300px" }}
                  src={word}
                  key={i}
                  alt=""
                />{" "}
              </>
            );
          } else if (word.match(YOUTUBE_REGEX)) {
            const YOUTUBE_URL = `https://youtube.com/embed/${getYoutubeId(
              word
            )}`;
            return (
              <>
                <iframe
                  key={i}
                  height="300px"
                  width="400px"
                  src={YOUTUBE_URL}
                  frameBorder="0"
                  allow="fullScreen"
                  allowFullScreen
                ></iframe>{" "}
              </>
            );
          } else if (word.includes("http")) {
            return (
              <>
                <a href={word}>{word}</a>{" "}
              </>
            );
          } else if (word === "") {
            return <>&nbsp;</>;
          } else {
            return word + " ";
          }
        })
    );
  }, [userInput]);

  const createNewTopic = async () => {
    if (title.length > 50) {
      toast.error("title max length 50 characters!", {
        position: "top-center",
        theme: "colored",
      });

      return;
    }

    if (description.length > 200) {
      toast.error("description max length 200 characters!", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    if (userInput.length > 5000) {
      toast.error("topic body max length 5000 characters!", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    if (!user) {
      toast.error("You do not have a permission to upload topics", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    if (title.length === 0) {
      toast.error("title cannot be empty", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    if (description.length === 0) {
      toast.error("description cannot be empty", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }
    if (userInput.length === 0) {
      toast.error("topic body cannot be empty", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    const topicData = {
      username: user.username,
      content: userInput,
      title: title,
      description: description,
      image: user.picture,
    };

    const { data } = await axios.post(
      "http://localhost:4000/create-new-topic",
      {
        ...topicData,
      },
      { withCredentials: true }
    );
    if (data.success) {
      setShowModal(false);
      setUserInput("");
      setTitle("");
      setDescription("");
      setTopics(data.data);
      toast.success("New topic was successfully created!", {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  return (
    <div>
      {/* main page btn to open modal */}
      <button
        onClick={() => setShowModal(!showModal)}
        className="create-new-topic-btn"
      >
        <div>Create New Topic</div>
        <FaPlus fontSize={18} />
      </button>
      {/*     modal container */}
      <div
        className={showModal ? "modal-container show-modal" : "modal-container"}
      >
        {/* modal inside */}

        <div className="topic-form-container">
          <div className="topic-form">
            <input
              value={title}
              className="input"
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
            />
            <input
              value={description}
              className="input"
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="Description"
            />
            <textarea
              value={userInput}
              className="preview-container"
              placeholder="You can write plain text here, add links, YT video links, image links"
              onChange={(e) => setUserInput(e.target.value)}
              type="text"
            />
            <button onClick={createNewTopic} className="btn">
              Create New Topic
            </button>

          </div>
          {/*<div className="topic-form">*/}
          {/*  <div className="input input-title">{title}</div>*/}
          {/*  <div className="input input-description">{description}</div>*/}
            {/*<div className="preview-container">{previewContent}</div>*/}
          {/*</div>*/}
        </div>

        {/* close btn */}
        <div onClick={() => setShowModal(false)} className="close-modal-btn">
          <FaTimes />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Modal;
