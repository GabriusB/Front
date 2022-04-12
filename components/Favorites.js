import React from "react";
import { convertTextToHtml } from "../helpers/convertTextToHtml";
import ReactPaginate from "react-paginate";
import { useState, useContext } from "react";
import { MainContext } from "../context/mainContext";
import { useNavigate } from "react-router-dom";


const Favorites = ({ topics, addToFavorites, removeFavorite }) => {
  const { setFavorites } = useContext(MainContext);
  const [topicCount, setTopicCount] = useState(10);

  const handlePageChange = async (data) => {
    setTopicCount((data.selected + 1) * 10);
  };
  const nav = useNavigate();

  return (
    <div className="favorite-container">
      {topics.length < 10 ? (
        <>
          {topics.map((x, i) => {
            return (
              <div key={i}>
                <div className="d-flex column">
                  <div className="d-flex align-center gap-10 comment-info">
                    <img style={{ width: "50px" }} src={x.image} alt="" />
                    <div>{x.username}</div>
                    <div>{new Date(x.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="comment-title">{x.title}</div>
                  <div className="comment-description">{x.description}</div>
                </div>
                <div className="favorite-topic-body">
                  {convertTextToHtml(x.content)}
                </div>
                <div className="d-flex">
                  <div
                    onClick={() => removeFavorite(x._id)}
                    className="favorites-btn"
                  >
                    Remove
                  </div>
                  <div
                    onClick={() => nav("/topic/" + x._id)}
                    className="favorites-btn"
                  >
                    Read More
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {topics.slice(topicCount - 10, topicCount).map((x, i) => {
            return (
              <div key={i}>
                <div>
                  <div className="d-flex align-center gap-10 comment-info">
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={x.image}
                      alt=""
                    />
                    <div>{x.username}</div>
                    <div>{new Date(x.createdAt).toLocaleString()}</div>
                  </div>

                  <div className="comment-title">{x.title}</div>
                  <div className="comment-description">{x.description}</div>
                </div>
                <div className="favorite-topic-body">
                  {convertTextToHtml(x.content)}
                </div>
              </div>
            );
          })}
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={Math.ceil(topics.length / 10)}
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

export default Favorites;
