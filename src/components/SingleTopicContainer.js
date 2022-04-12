import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { convertTextToHtml } from "../helpers/convertTextToHtml";
import { toast, ToastContainer } from "react-toastify";
import { useContext } from "react";
import { MainContext } from "../context/mainContext";
import Comments from "../components/Comments";
import { useCookies } from "react-cookie";


const SingleTopicContainer = () => {
  const {
    user,
    setUser,
    setFavorites,
    favorites,
    setNotifications,
    notifications,
  } = useContext(MainContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [userInput, setUserInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [topic, setTopic] = useState(null);
  const { id } = useParams();

  const [cookies, setCookie, removeCookie] = useCookies([]);

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          setUser(null);
          removeCookie("jwt");
        } else {
          setUser(data.user);
          setNotifications(data.notifications);
        }
      }
    };
    verifyUser();
  }, [cookies, removeCookie, notifications]);

  useEffect(() => {
    getTopic();
  }, [user]);

  useEffect(() => {
    if (topic !== null && localStorage.getItem("favorites") !== null) {
      const items = JSON.parse(localStorage.getItem("favorites"));
      const exist = items.find((x) => x === topic._id);

      if (exist) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [topic, favorites]);

  const getTopic = async () => {
    const { data } = await axios.get("http://localhost:4000/topic/" + id);

    setTopic(data.data);
  };
  const submit = async () => {
    const commentData = {
      username: user.username,
      content: userInput,
      title: title,
      description: description,
      image: user.picture,
      date: Date.now(),
    };

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
    if (userInput.length > 1000) {
      toast.error("topic body max length 1000 characters!", {
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

    const { data } = await axios.post(
      "http://localhost:4000/comment/" + id,
      { ...commentData },
      {
        withCredentials: true,
      }
    );
    if (data.success) {
      toast.success("new comment successfully created!", {
        position: "top-center",
        theme: "colored",
      });
      setShowModal(false);
      setUserInput("");
      setTitle("");
      setDescription("");
      getTopic();
    }
  };

  const addToFavorites = (id) => {
    if (localStorage.getItem("favorites") === null) {
      localStorage.setItem("favorites", JSON.stringify([id]));
    }
    if (localStorage.getItem("favorites") !== null) {
      const oldItems = JSON.parse(localStorage.getItem("favorites"));
      const checkIfExists = oldItems.find((x) => x === id);

      if (!checkIfExists) {
        localStorage.setItem("favorites", JSON.stringify([...oldItems, id]));
        setFavorites([...oldItems, id]);
      }
    }
  };

  const removeFavorite = (id) => {
    const itemsInLocalStorage = JSON.parse(localStorage.getItem("favorites"));

    const filterItems = itemsInLocalStorage.filter((x) => x !== id);
    setFavorites(filterItems);
    localStorage.setItem("favorites", JSON.stringify(filterItems));
  };

  return (
    <div>
      {topic && (
        <div className="container-for-single-topic">
          <div>
            <div className="d-flex space-btw sm-column">
              <div className="single-topic-user-info">
                <img
                  style={{ width: "50px", height: "50px" }}
                  src={topic.image}
                  alt=""
                />
                <div>{topic.username}</div>
                <div>{new Date(topic.createdAt).toLocaleString()}</div>
              </div>
              {isFavorite ? (
                <>
                  <div
                    onClick={() => removeFavorite(topic._id)}
                    className="single-topic-favorite-btn"
                  >
                    Remove from Favorites
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => addToFavorites(topic._id)}
                    className="single-topic-favorite-btn"
                  >
                    Add to Favorites
                  </div>
                </>
              )}
            </div>
            <div className="single-topic-title">
              <span className="special">TITLE: </span> {topic.title}
            </div>

            <div className="single-topic-description">
              <span className="special">DESCR: </span>
              {topic.description}
            </div>
          </div>
          <div className="single-topic">
            {topic && convertTextToHtml(topic.content)}
          </div>

          {user && (
            <button
              onClick={() => setShowModal(!showModal)}
              className="single-topic-btn"
            >
              Comment
            </button>
          )}
          <Comments comments={topic.comments} />
        </div>
      )}

      <div
        className={showModal ? "modal-container show-modal" : "modal-container"}
      >
        <div className="d-flex">
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
            <button className="btn" onClick={submit}>
              Submit
            </button>
          </div>
        </div>
        <div onClick={() => setShowModal(false)} className="close-modal-btn">
          <FaTimes />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SingleTopicContainer;
