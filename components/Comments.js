import React, { useEffect } from "react";
import { convertTextToHtml } from "../helpers/convertTextToHtml";
import { useContext, useState } from "react";
import { MainContext } from "../context/mainContext";
import ReactPaginate from "react-paginate";


const Comments = ({ comments }) => {
  const [topicCount, setTopicCount] = useState(10);

  const { user } = useContext(MainContext);

  const handlePageChange = async (data) => {
    setTopicCount((data.selected + 1) * 10);
  };

  comments.sort((a, b) => b.date - a.date);

  return (
    <div>
      {comments.length > 0 && (
        <div className="comments-container">
          {comments.length < 10 ? (
            <>
              {comments.map((x, i) => {
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
                        <div>{new Date(x.date).toLocaleString()}</div>
                      </div>

                      <div className="comment-title">{x.title}</div>
                      <div className="comment-description">{x.description}</div>
                    </div>
                    <div className="comment-body-container">
                      {convertTextToHtml(x.content)}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div>
              {comments.slice(topicCount - 10, topicCount).map((x, i) => {
                return (
                  <div key={i}>
                    <div>
                      <div className="d-flex align-center gap-10 comment-info">
                        <img style={{ width: "50px" }} src={x.image} alt="" />
                        <div>{x.username}</div>
                        <div>{new Date(x.date).toLocaleString()}</div>
                      </div>

                      <div className="comment-title">{x.title}</div>
                      <div className="comment-description">{x.description}</div>
                    </div>
                    <div className="comment-body-container">
                      {convertTextToHtml(x.content)}
                    </div>
                  </div>
                );
              })}
              <ReactPaginate
                previousLabel={"previous"}
                nextLabel={"next"}
                breakLabel={"..."}
                pageCount={Math.ceil(comments.length / 10)}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
