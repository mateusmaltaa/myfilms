import React, {useEffect, useState} from "react";
import "./home.css";
import NavBar from '../../components/navbar/navbar'
import MovieRow from './movieRow';
import SearchMovie from './searchMovie'
import BackSearch from './backSearch'
import Rodape from '../../components/navbar/rodape'
import Tmdb from '../../config/tmdb'


function Home() {

  const [movieList, setMovieList] = useState([]);
  const [imgFeatured, setImgFeatured] = useState([]);
  const [showOpacityNav, setShowOpacityNav] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let featuredMovie = list.filter(i => i.slug === 'toprated');
      let randomChosen = Math.floor(Math.random() * (featuredMovie[0].items.results.length - 1));
      let chosen = featuredMovie[0].items.results[randomChosen];
      setImgFeatured(chosen);
    }

    loadAll();
  }, []); 

  useEffect(() => {
    setShowOpacityNav(false);
    const scrollListener = () => {
      if(window.scrollY > 300){
        setShowOpacityNav(true);
      } else {
        setShowOpacityNav(false);
      }
    }
    window.addEventListener('scroll', scrollListener);
    return() => {
    window.removeEventListener('scroll', scrollListener);
    }
  }, []); 

  return(
        <>
        <NavBar show={showOpacityNav}/>
        <BackSearch item={imgFeatured} />
        <SearchMovie />
        <div className="page">
          <section className="lists">
            {movieList.map((item, key) => (
              <MovieRow key={key} title={item.title} items={item.items}/>
            ))
            }
          </section>
        </div>
        <Rodape/>

        {movieList.length <= 0 && imgFeatured.length <= 0 ?
        <div className="loading">
          <img src="https://plugcitarios.com/blog/wp-content/uploads/2015/03/1410967177-dragonballzgif-0.gif" alt="Carregando" />
        </div>
        :
        ''
        }
        
        </>
  )
  
}

export default Home;
