import axios from "axios";
import { useCookies } from "react-cookie";

import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../context/mainContext";
import ReactPaginate from "react-paginate";
import { convertTextToHtml } from "../helpers/convertTextToHtml";
import { IoMdNotifications } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";


const ProfileContainer = () => {
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [allTopicCount, setAllTopicCount] = useState(10);
  const { setUser, user, setNotifications, notifications, topics } =
    useContext(MainContext);
  const [showModal, setShowModal] = useState(false);
  const [userTopics, setUserTopics] = useState([]);
  const image = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
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
          getUserTopics(data.user.username);
        }
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);

  const getUserTopics = async (username) => {
    const { data } = await axios.post(
      "http://localhost:4000/get-topics",
      { username },
      {
        withCredentials: true,
      }
    );
    setUserTopics(data.data);
  };

  const handlePageChange = async (data) => {
    setAllTopicCount((data.selected + 1) * 10);
  };

  const goToTopic = async (id, notificationState) => {
    if (notificationState) {
      const { data } = await axios.post(
        "http://localhost:4000/notification",
        { id },
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        navigate("/topic/" + id);
      }
    } else {
      navigate("/topic/" + id);
    }
  };

  const changeImage = async () => {
    const img = image.current.value;

    if (img.length === 0) {
      toast.error("image link is empty!", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    if (!img.includes("http")) {
      toast.error("image link must include http at the beginning", {
        position: "top-center",
        theme: "colored",
      });
      return;
    }

    const { data } = await axios.post(
      "http://localhost:4000/change-image",
      { username: user.username, image: img },
      {
        withCredentials: true,
      }
    );
    if (data.success) {
      image.current.value = "";
      getUserTopics(user.username);
      toast.success("Image changed!", {
        position: "top-center",
        theme: "colored",
      });
      setShowModal(false);
    } else {
      toast.error(data.message, {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  return (
    <div className="profile-topic-container">
      {user && (
        <div>
          <div onClick={() => setShowModal(true)} className="change-image-btn">
            <button>Change Image</button>
          </div>
          <div
            className={
              showModal ? "modal-container show-modal" : "modal-container"
            }
          >
            <div className="change-image-container">
              <input
                ref={image}
                className="input"
                type="text"
                placeholder="Image url"
              />
              <button onClick={() => changeImage()} className="login-btn">
                Submit
              </button>
            </div>
            <div
              onClick={() => setShowModal(false)}
              className="close-modal-btn"
            >
              <FaTimes />
            </div>
          </div>
        </div>
      )}
      {userTopics.length < 10 ? (
        <>
          <div>
            {userTopics.map((x, i) => {
              const date = new Date(x.createdAt).toLocaleString();
              return (
                <div key={i}>
                  <div className="d-flex align-center gap-10 profile-topic-info">
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={x.image}
                      alt=""
                    />
                    <div>{x.username}</div>
                    <div>{date}</div>
                    {x.notification && (
                      <IoMdNotifications className="profile-topic-icon" />
                    )}
                  </div>

                  <div
                    className={
                      x.notification
                        ? "profile-topic-body profile-active"
                        : "profile-topic-body"
                    }
                  >
                    {convertTextToHtml(x.content)}
                  </div>
                  <div
                    onClick={() => goToTopic(x._id, x.notification)}
                    className={
                      x.notification
                        ? "profile-btn-active"
                        : "profile-topic-btn"
                    }
                  >
                    {x.notification ? "Check notifications!" : "Go to topic"}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div>
            {userTopics.slice(allTopicCount - 10, allTopicCount).map((x, i) => {
              const date = new Date(x.createdAt).toLocaleString();
              return (
                <div key={i}>
                  <div className="d-flex align-center gap-10 profile-topic-info">
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={x.image}
                      alt=""
                    />
                    <div>{x.username}</div>
                    <div>{date}</div>
                    {x.notification && (
                      <IoMdNotifications className="profile-topic-icon" />
                    )}
                  </div>

                  <div
                    className={
                      x.notification
                        ? "profile-topic-body profile-active"
                        : "profile-topic-body"
                    }
                  >
                    {convertTextToHtml(x.content)}
                  </div>
                  <div
                    onClick={() => goToTopic(x._id, x.notification)}
                    className={
                      x.notification
                        ? "profile-btn-active"
                        : "profile-topic-btn"
                    }
                  >
                    {x.notification ? "Check notifications!" : "Go to topic"}
                  </div>
                </div>
              );
            })}
          </div>
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={Math.ceil(userTopics.length / 10)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName={"pagination-container"}
            pageClassName={"pagination-item"}
            pageLinkClassName={"pagination-link"}
            previousClassName={"pagination-btn"}
            nextClassName={"pagination-btn"}
            breakClassName={"pagination-break"}
            activeClassName={"pagination-active"}
          />
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProfileContainer;
