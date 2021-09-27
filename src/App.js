import React, { useEffect, useState } from "react";
import Tmdb from "./Tmdb";
import MovieRow from "./Components/MovieRow";
import "./App.css";
import FeaturedMovie from "./Components/FeaturedMovie";
import Header from "./Components/Header";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);
  const [blackHeader, setBlackHeader] = useState(false);
  useEffect(() => {
    const loadAll = async () => {
      //Carregando listas
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //Selecionando FeaturedMovie
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMoveInfo(chosen.id, "tv");
      setFeaturedData(chosenInfo);
    };
    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData && <FeaturedMovie item={featuredData} />}
      <section className="lists">
        {movieList.map((item, key) => (
          <div>
            <MovieRow key={key} title={item.title} items={item.items} />
          </div>
        ))}
      </section>

      <footer>
        Direitos de imagem: netflix <br />
        Fonte dados: Themoviedb.org
      </footer>

      {movieList <= 0 && (
        <div className="loading">
          <img
            src="https://media1.tenor.com/images/9a02aac51ed499e01518ac73dd954eb1/tenor.gif?itemid=6089689"
            alt="Carregando"
          />
        </div>
      )}
    </div>
  );
};
