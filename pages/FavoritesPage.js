import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Favorites from "../components/Favorites";
import { MainContext } from "../context/mainContext";


const FavoritesPage = () => {
  const [topics, setTopics] = useState([]);
  const { setFavorites, favorites } = useContext(MainContext);

  useEffect(() => {
    getTopics();
  }, []);

  const getTopics = async () => {
    if (localStorage.getItem("favorites") !== null) {
      const favoriteItems = JSON.parse(localStorage.getItem("favorites"));

      const { data } = await axios.post(
        "http://localhost:4000/favorites",
        { favoriteItems },
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setTopics(data.data);
        setFavorites(data.data);
      }
    }
  };

  const removeFavorite = (id) => {
    const itemsInLocalStorage = JSON.parse(localStorage.getItem("favorites"));

    const filterItems = itemsInLocalStorage.filter((x) => x !== id);
    setFavorites(filterItems);
    setTopics(filterItems);
    localStorage.setItem("favorites", JSON.stringify(filterItems));
  };

  return (
    <>
      <Favorites topics={topics} removeFavorite={removeFavorite} />
    </>
  );
};

export default FavoritesPage;
