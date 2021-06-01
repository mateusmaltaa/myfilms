import React, {useEffect, useState} from "react";
import firebase from '../../config/firebase';
import { useSelector } from 'react-redux';
import NavBar from '../../components/navbar/navbar';
import Lista from './listVer'
import {Link, Redirect} from 'react-router-dom';
import './ver.css';
import { useVer } from '../../store/verContext'

function Ver(){

    const { fpv } = useVer();

    const [filmesVer, setFilmesVer] = useState([]);
    const usuario = useSelector(state => state.usuarioEmail);
    let listaVer = [];
    const [loading, setLoading] = useState(1);

    useEffect(() => {
        firebase.firestore().collection('ListaVer').where('usuario','==', usuario).get().then(async (resultado) => {
            await resultado.docs.forEach(doc => {
                    listaVer.push({
                        id: doc.id,
                        ...doc.data()
                })
            })
        setFilmesVer(listaVer);
        setLoading(0)
        }) 
    }, [fpv]); 

    return(
    <>
    {
        useSelector(state => state.usuarioLogado) === 0 ? <Redirect to='login' /> : null
    }

    {
    loading === 1 ? 
    <div className="loading">
        <img src="https://i.gifer.com/5gpt.gif" alt="Carregando" />
    </div>
    : '' 
    }
        <NavBar />
        <section className="list">
            <h1> Ver: </h1>
            {filmesVer.length > 0 ?
            filmesVer.map(item => <Lista key={item.id} idFire={item.id} idFilme={item.idFilme}/>)
            :
            <h2 className="msgErroVer">Você ainda não adicionou nenhum filme à sua lista.</h2>
            }
        </section>
    </>
    )
}

export default Ver;