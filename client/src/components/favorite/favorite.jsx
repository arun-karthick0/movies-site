import "./style.css";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const Favorite = ({ user, loggedIn }) => {
  const [list, setList] = useState();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    axios
      .get(`/liked/${user || loggedIn}`)
      .then((res) => {
        setList(res?.data);
      })
      .catch((err) => console.log(err));
  }, [list, loggedIn, user]);

  const remove = (movie_id) => {
    console.log(movie_id);
    axios
      .put(`/remove`, { user, movie_id })
      .then((res) => {
        toast.success("Removed from list");
        setList(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="fav-movieCard">
      {user &&
        list?.movies?.map((item, index) => {
          return (
            <div
              key={index}
              className={`fav-card ${hoveredIndex === index ? "hovered" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="fav-posterBlock">
                {item.poster === null ? (
                  <img
                    className="fav-posterImg"
                    src={
                      "data:image/png;base64,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"
                    }
                    alt="sorry not available"
                  />
                ) : (
                  <img
                    className="fav-posterImg"
                    src={`https://image.tmdb.org/t/p/w500${item?.poster}`}
                    alt=""
                  />
                )}
                {hoveredIndex === index && (
                  <div
                    className="fav-removeButton"
                    onClick={() => remove(item?.Movie_id)}
                  >
                    X
                  </div>
                )}
              </div>
              <div className="fav-textBlock">
                <span className="fav-title">{item.name}</span>
                <span className="fav-date">
                  {dayjs(item.release_date).format("MMM D, YYYY")}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Favorite;
