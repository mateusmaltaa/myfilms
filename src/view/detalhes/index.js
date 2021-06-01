import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import NavBar from '../../components/navbar/navbar';
import Tmdb from '../../config/tmdb';
import './detalhes.css';
import AddIcon from '@material-ui/icons/Add';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import firebase from '../../config/firebase';
import { Link, Redirect } from "react-router-dom";


function Detalhes(props){

    const [filme, setFilme] = useState([]);
    const [credits, setCredits] = useState([]);
    const [load, setLoad] = useState(1);
    const [msgFail, setMsgFail] = useState(0);
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

    useEffect(async () => {
        const loadAll = async () => {
            let movie = await Tmdb.getFilmes(props.match.params.id);
            setFilme(movie);
            setMsgFail(1);
        }
        const loadCredits = async () => {
            let searchCredits = props.match.params.id + '/credits';
            let credits = await Tmdb.getFilmes(searchCredits);
            setCredits(credits);
            }
        await loadAll();
        await loadCredits();
        setLoad(0);
      }, [props.match.params.id]); 

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

    let data = new Date(filme.release_date);

    const runtime = filme.runtime;
    let horas = parseInt(runtime / 60);
	let minutos = parseInt(runtime % 60);
    let horasMinutos = horas + 'H' + minutos + 'M';
    
    let genres = [];
    for(let i in filme.genres){
    genres.push (filme.genres[i].name)
    }


    let elenco = [];
    for(let i in credits.cast){
    elenco.push(credits.cast[i].name)
    }

  
    return(
        <>

        {
            redirectLogin === 1 && <Redirect to="/login" />
        }

        <NavBar />

        {

        load === 1 
        
        ?

        <div className="loading">
          <img src="http://caixolanerd.com.br/wp-content/uploads/2019/12/tumblr_pm7z2tvoSa1sd6stk_540.gif" alt="Carregando" />
        </div>

        :

        props.match.params.name !== 'undefined'
        
        ?

            <div>
                <section className="img-back" style={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage:`url(https://image.tmdb.org/t/p/original${filme.backdrop_path})`
                    
                }}>
                    <div className="img-back--vertical">
                    </div>
                </section>
                <div className="img-film">
                    <img src={`https://image.tmdb.org/t/p/w300${filme.poster_path}`} className="img-banner" alt=""/>
                </div>




                <div className="buttons-details">
                {
                VerificarButtonsVisto(filme.id) === undefined
                ? 
                <div  className="buttonVistoD">
                        <button type="button" className="btn" onClick={() => AdicionarVisto(filme.id)}> <AddIcon /> Já ví</button>
                </div>
                :
                <div  className="buttonVistoDCheck">
                        <Link to="/visto"><button type="button" className="btn"> <CheckBoxIcon /> Já ví</button></Link>
                </div>
                }
                {
                    VerificarButtonsVer(filme.id) === undefined
                    ? 
                    <div className="buttonVerD">
                        <button type="button" className="btn" onClick={() => AdicionarVer(filme.id)}> <AddIcon /> Vou Ver</button>
                    </div>
                    :
                    <div className="buttonVerDCheck">
                        <Link to="/ver"><button type="button" className="btn"> <CheckBoxIcon /> Vou Ver</button></Link>
                    </div>
                }
                </div>

                <div className="informations-film">
                        <h1 className="title-film">{filme.title}</h1>
                        <div className="small-informations">{data.getFullYear()}</div>
                        <div className="small-informations">{horasMinutos}</div>
                        <div className="small-informations"> {genres.join(', ')} </div>
                        <div className="small-informations">{filme.vote_average}</div>
                        <div className="overview-film"><h5>{filme.overview}</h5></div>
                </div>
                <div className="elenco-film">
                    <div className="small-informations-elenco">Elenco: {elenco.join(', ')} </div>
                </div>
            </div>

        :
            msgFail === 1 && <h1 className="row-fail-films">Desculpe não encontramos detalhes sobre esse filme</h1>
        }
        
        </>
    )
}


export default Detalhes;