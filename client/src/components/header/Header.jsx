import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { toast } from "react-toastify";
import { AiOutlineCaretDown } from "react-icons/ai";

import "./style.css";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";
import { signOut } from "firebase/auth";

const Header = ({ user, setUser, loggedIn }) => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [drop, setDrop] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenu) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
  };

  const openSearch = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else if (type === "tv") {
      navigate("/explore/tv");
    } else if (type === "fav") {
      navigate("/fav");
    }
    setMobileMenu(false);
  };
  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      window.localStorage.removeItem("email");
      toast.success("logout successful");
    });
  };

  const dropDown = (e) => {
    e.preventDefault();
    if (drop === "") {
      setDrop("show-profile");
    } else {
      setDrop("");
    }
  };

  // const review = (e) => {
  //   e.preventDefault();
  //   navigate("/myreview");
  // };

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="" />
        </div>
        <ul className="menuItems">
          <li className="menuItem" onClick={() => navigationHandler("movie")}>
            Movies
          </li>
          <li className="menuItem" onClick={() => navigationHandler("tv")}>
            TV Shows
          </li>
          {/* {loggedIn && (
            <li
              li
              className="menuItem"
              onClick={() => navigationHandler("fav")}
            >
              My list
            </li> */}

          <li className="menuItem">
            <HiOutlineSearch onClick={openSearch} />
          </li>
          {loggedIn ? (
            <div className="profile-card">
              <div className="logo-initial ">
                <div className="profile-circle">{user[0]}</div>
              </div>
              <AiOutlineCaretDown
                style={{ color: "#fff" }}
                className="drop-down"
                onClick={dropDown}
              />

              {drop && (
                <div className="profile-info show-profile ">
                  <span onClick={logout}>
                    <div className="option">logout</div>
                  </span>
                  <span onClick={() => navigationHandler("fav")}>
                    <div className="option">My List</div>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <li className="auth">
              <Link to={"/login"}>Login</Link>
            </li>
          )}
        </ul>

        <div className="mobileMenuItems">
          <HiOutlineSearch onClick={openSearch} />
          {mobileMenu ? (
            <VscChromeClose onClick={() => setMobileMenu(false)} />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search for a movie or tv show...."
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler}
              />
              <VscChromeClose onClick={() => setShowSearch(false)} />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
