import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import './movieRow.css';
import AddIcon from '@material-ui/icons/Add';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import firebase from '../../config/firebase';
import { Link, Redirect } from "react-router-dom";


export default function MovieRow({title, items}){



    const [scrollX, setScrollX] = useState(0);
    const usuarioEmail = useSelector(state => state.usuarioEmail);
    const estado = useSelector(state => state.usuarioLogado);
    const [redirectLogin, setRedirectLogin] = useState(0);
    let listaVer = [];
    let listaVisto = [];
    const [buttonVer, setButtonVer] = useState([]);
    const [buttonVisto, setButtonVisto] = useState([]);
    const [reload1, setReload1] = useState(0);
    const [reload2, setReload2] = useState(0);
    let estadoo = useSelector(state => state.usuarioLogado);


    const db = firebase.firestore();

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

    const handleLeftArrow = () =>{
        let x = scrollX + Math.round(window.innerWidth / 2);
        if(x > 0) {
            x = 0
        }
        setScrollX(x);
    }

    const handleRightArrow = () =>{
        let x = scrollX - Math.round(window.innerWidth / 2);
        let listW = items.results.length * 180;
        if((window.innerWidth - listW) > x){
            x = (window.innerWidth - listW) - 60
        }
        setScrollX(x)
    }
    
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

    return(
    <>
        {
            redirectLogin === 1 && <Redirect to="/login" />
        }

        <div className="movieRow">
            <h3>{title}</h3>
            <div className="movieRow--left" onClick={handleLeftArrow}>
                <NavigateBeforeIcon style={{fontSize: 50}} />
            </div>
            <div className="movieRow--right" onClick={handleRightArrow}>
                <NavigateNextIcon style={{fontSize: 50}} />
            </div>
            <div className="movieRow--listarea">
                <div className="movieRow--list" style={{
                            marginLeft: scrollX,
                            width:  items.results.length * 180
                }}>

                    {items.results.length > 0 && items.results.map((item, key) => 
                        (<div key={key} className="movieRow--item">
                            <Link to={"/detalhes/" + item.id + '/' + item.title}>
                                <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.original_title}/>
                            </Link>
                            
                            {

                            VerificarButtonsVisto(item.id) === undefined ? 

                            <div className="buttonAdicionarVisto" onClick={() => AdicionarVisto(item.id)}> 
                                <AddIcon/>Já ví
                            </div>

                            :
                            
                            <Link to="visto">
                                <div className="buttonAdicionarVistoCheck">
                                    <CheckBoxIcon /> Já vi
                                </div>
                            </Link>  
                            
                            }
                            {
                            
                           VerificarButtonsVer(item.id) === undefined ? 
                            
                            <div className="buttonAdicionarVer" onClick={() => AdicionarVer(item.id)}> 
                                <AddIcon/>Vou ver
                            </div>

                            :

                            <Link to="ver">
                                <div className="buttonAdicionarVerCheck">
                                    <CheckBoxIcon /> Vou Ver 
                                </div>
                            </Link>  
                    
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
    )
}