import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import SearchFilm from '../../config/searchFilm'
import './searchMovie.css';
import AddIcon from '@material-ui/icons/Add';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import firebase from '../../config/firebase';
import { Link, Redirect } from "react-router-dom";


export default function SearchMovie(){
    const [filmSearch, setFilmSearch] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [viewList, setViewList] = useState();
    const [loading, setLoading] = useState();  
    const usuarioEmail = useSelector(state => state.usuarioEmail);
    const estado = useSelector(state => state.usuarioLogado);
    const [redirectLogin, setRedirectLogin] = useState(0);
    let listaVer = [];
    let listaVisto = [];
    const [buttonVer, setButtonVer] = useState([]);
    const [buttonVisto, setButtonVisto] = useState([]);
    const [reload1, setReload1] = useState(0);
    const [reload2, setReload2] = useState(0);

    const db = firebase.firestore();

     
    async function Buscar(){
        setLoading(1);
        setViewList(0);
        const searchAll = async () => {
        let list = await SearchFilm.listMovies(filmSearch);
        setMovieList(list);
        setViewList(1);
        }
        filmSearch.length > 0 && await searchAll();
        setLoading(0);
        return;
    }
//abre
            useEffect(() => {
                estado === 1 && (
                firebase.firestore().collection('ListaVer').where('usuario','==', usuarioEmail).get().then(async (resultado) => {
                    resultado.docs.forEach(doc => {
                            listaVer.push({
                                id: doc.id,
                                ...doc.data()
                        })
                    })
                setButtonVer(listaVer);
                }))
            },[reload1]); 

            useEffect(() => {
                estado === 1 && (
                firebase.firestore().collection('ListaVisto').where('usuario','==', usuarioEmail).get().then(async (resultado) => {
                    await resultado.docs.forEach(doc => {
                            listaVisto.push({
                                id: doc.id,
                                ...doc.data()
                        })
                    })
                setButtonVisto(listaVisto);
                }))
            },[reload2]);

            function AdicionarVer(id){
                estado === 1
                ?
                db.collection('ListaVer').add({
                    idFilme: id,
                    usuario: usuarioEmail
                }).then(() => {
                    setReload1(1);
                    if(reload1 === 1){
                        setReload1(0)
                    }
                }).catch(erro => {
                    alert("Por favor tente novamente")
                })
               :
               setTimeout(() => {
                setRedirectLogin(1);
               }, 1000);
            }
        
            function AdicionarVisto(id){
                estado === 1
                ?
                db.collection('ListaVisto').add({
                    idFilme: id,
                    usuario: usuarioEmail
                }).then(() => {
                    setReload2(1);
                    if(reload2 === 1){
                        setReload2(0)
                    }
                }).catch(erro => {
                    alert("Por favor tente novamente")
                })
               :
               setTimeout(() => {
                setRedirectLogin(1);
               }, 1000);
            }
            
            function VerificarButtonsVer (id){
                var found = buttonVer.find(function(element){
                    if (element.idFilme === id){
                        return true
                    } else{
                        return false
                    }
                });
                return found;
            }
            
            function VerificarButtonsVisto (id){
                var found = buttonVisto.find(function(element){
                    if (element.idFilme === id){
                        return true
                    } else{
                        return false
                    }
                });
                return found;
            }

//fecha

    return(
        <>
        {
            redirectLogin === 1 && <Redirect to="/login" />
        }
        <div className="areaSearch--all text-center mx-auto">
            <div className="textsSearch">
                <h2>Bem-vindo(a).</h2>
                <h3>Aproveite já.</h3>
            </div>
            <input type="text" className="form-control areaSearch" value={filmSearch} placeholder="Buscar por filme"
            onChange={(e) => setFilmSearch(e.target.value)} />
            <button type="button" className="btn btn-lg buttonSearch" onClick={Buscar}>Buscar</button> <br></br>
        </div>
        <div className="areaFilms--all text-center mx-auto">
            {
            loading ? <div className="spinner-border text-danger" role="status"> <span className="visually-hidden">Loading...</span>  </div>
            : 
            <div>
            {
            viewList === 1 &&
            <div>
            {
                movieList.results.length !== 0 ? 
                <div>
                {
                movieList.results.map((item, key)=>(
                    item.poster_path != null &&
                    <div key={key} className="searchMovie--item">
                       <Link to={"/detalhes/" + item.id + '/' + item.title}>
                           <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.original_title}/>
                        </Link>
                    
                                {

                                VerificarButtonsVisto(item.id) === undefined ? 

                                <div className="buttonAdicionarVistoS" onClick={() => AdicionarVisto(item.id)}> 
                                    <AddIcon/>Já ví
                                </div>

                                :

                                <Link to="visto">
                                    <div className="buttonAdicionarVistoCheckS">
                                        <CheckBoxIcon /> Já vi
                                    </div>
                                </Link>  

                                }
                                {

                                VerificarButtonsVer(item.id) === undefined ? 

                                <div className="buttonAdicionarVerS" onClick={() => AdicionarVer(item.id)}> 
                                    <AddIcon/>Vou ver
                                </div>

                                :

                                <Link to="ver">
                                    <div className="buttonAdicionarVerCheckS">
                                        <CheckBoxIcon /> Vou Ver 
                                    </div>
                                </Link>  

                                }

                </div>
                ))
                }
                </div>
                : <div><h3 className="text-center">Filme não encontrado</h3></div>
            }
            </div>
            }
            </div>
        } 
        </div>
        </>
    )
}
