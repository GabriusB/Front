import imageExists from "image-exists";

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

const getYoutubeId = (url) => {
  const regExp =
    /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : false;
};

const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/g;

export const convertTextToHtml = (text) => {
  return text
    .replace(/\n/g, " newLine ")
    .split(" ")
    .map((word, i) => {
      if (word === "newLine") {
        return <br key={i}></br>;
      } else if (checkImg(word)) {
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
        const YOUTUBE_URL = `https://youtube.com/embed/${getYoutubeId(word)}`;
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
    });
};
