import { useContext } from "react";
import { MainContext } from "../context/mainContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { BsBook } from "react-icons/bs";

const Topics = () => {
  const { topics, setTopics } = useContext(MainContext);

  const nav = useNavigate();
  const [page, setPage] = useState(1);
  const [allTopicCount, setAllTopicCount] = useState(0);

  useEffect(() => {
    getTopics();
  }, [page]);

  const getTopics = async () => {
    const { data } = await axios.get(
      "http://localhost:4000/all-topics/" + page
    );
    setTopics(data.data);

    setAllTopicCount(Number(data.topics));
  };

  const handlePageChange = async (data) => {
    setPage(data.selected + 1);
  };

  const goToTopic = async (id, name) => {
    nav("/topic/" + id);
  };

  return (
    <div className="main-page-topic-container">
      {allTopicCount < 10 ? (
        <>
          {topics.map((x, i) => {
            const date = new Date(x.createdAt).toLocaleString();
            return (
              <div key={i}>
                <div
                  className="main-page-topic"
                  onClick={() => goToTopic(x._id, x.username)}
                >
                  <div className="topic-user">
                    <img src={x.image} alt="" />
                    <div className="topic-user-username">{x.username}</div>
                    <div className="topic-user-date">{date}</div>
                  </div>
                  <div className="topic-user-separator"></div>
                  <div className="topic-content">
                    <div className="topic-title">
                      {x.title.length > 50
                        ? x.title.slice(0, 50) + "..."
                        : x.title}
                    </div>
                    <div className="topic-description">
                      {x.description.length > 100
                        ? x.description.slice(0, 100) + "..."
                        : x.description}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => goToTopic(x._id, x.username)}
                  className="topic-read-more-btn"
                >
                  {/*<button>Read More</button>*/}
                  {/*<BsBook className="topic-icon" />*/}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {topics.map((x, i) => {
            const date = new Date(x.createdAt).toLocaleString();
            return (
              <div key={i}>
                <div
                  className="main-page-topic"
                  onClick={() => goToTopic(x._id, x.username)}
                >
                  <div className="topic-user">
                    <img src={x.image} alt="" />
                    <div className="topic-user-username">{x.username}</div>
                    <div className="topic-user-date">{date}</div>
                  </div>
                  <div className="topic-user-separator"></div>
                  <div className="topic-content">
                    <div className="topic-title">
                      {x.title.length > 50
                        ? x.title.slice(0, 50) + "..."
                        : x.title}
                    </div>
                    <div className="topic-description">
                      {x.description.length > 100
                        ? x.description.slice(0, 100) + "..."
                        : x.description}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => goToTopic(x._id, x.username)}
                  className="topic-read-more-btn"
                >
                  <button>Read More</button>
                  <BsBook className="topic-icon" />
                </div>
              </div>
            );
          })}
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={Math.ceil(allTopicCount / 10)}
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
    </div>
  );
};

export default Topics;
