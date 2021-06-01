import React, {useEffect, useState} from "react";
import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';
import NavBar from '../../components/navbar/navbar';
import Lista from './listVisto'
import {Link, Redirect} from 'react-router-dom';
import './visto.css';
import { useVisto } from '../../store/vistoContext'

function Visto(){

    const { fv } = useVisto();

    const [filmesVisto, setFilmesVisto] = useState([]);
    const [loading, setLoading] = useState(1);
    const usuario = useSelector(state => state.usuarioEmail);
    let listaVisto = [];

    useEffect(() => {
        firebase.firestore().collection('ListaVisto').where('usuario','==', usuario).get().then(async (resultado) => {
            await resultado.docs.forEach(doc => {
                    listaVisto.push({
                        id: doc.id,
                        ...doc.data()
                })
            })
        setFilmesVisto(listaVisto);
        setLoading(0)
        }) 
    }, [fv]); 
 

    return(
    <>

        {
            useSelector(state => state.usuarioLogado) === 0 ? <Redirect to='login' /> : null
        }

        {
        loading === 1 ? 
        <div className="loading">
          <img src="http://pa1.narvii.com/6211/1088d5d90b0028f039b918d60cc89b5f05b1f84a_00.gif" alt="Carregando" />
        </div>
        : '' 
        }
            
        <NavBar /> 
        <section className="list">
            <h1> Vistos: </h1>
            {filmesVisto.length > 0 ?
            filmesVisto.map(item => <Lista key={item.id} idFire={item.id} idFilme={item.idFilme}/>)
            :
            <h2 className="msgErroVer">Você ainda não adicionou nenhum filme à sua lista.</h2>
            }
        </section>
    </>
        
        )
}

export default Visto;