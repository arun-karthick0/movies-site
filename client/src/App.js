import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import { ToastContainer } from "react-toastify";
import Register from "./pages/registration/Register";
import Login from "./pages/login/Login";
import Favorite from "./components/favorite/favorite";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import axios from "axios";

axios.defaults.baseURL = "https://movie-site-l8v5.onrender.com";

function App() {
  const [user, setUser] = useState("");
  const loggedIn = window.localStorage.getItem("email");
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setUser(loggedIn);
    }
  }, [user]);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url));
    });
  };

  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);

    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  };

  return (
    <div>
      <ToastContainer position="top-center" />
      <Header user={user} setUser={setUser} loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/:mediaType/:id"
          element={<Details user={user} setUser={setUser} />}
        />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route
          path="/fav"
          element={<Favorite user={user} loggedIn={loggedIn} />}
        />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route path="/register" element={<Register setUser={setUser} />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
