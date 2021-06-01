import React, {useEffect, useState} from "react";
import Tmdb from '../../config/tmdb';
import { Link, Redirect } from "react-router-dom";
import './listVer.css';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {useSelector} from 'react-redux';
import firebase from '../../config/firebase';
import { useVer } from '../../store/verContext'


function ListVer({key, idFire, idFilme}){

    const { fpv, setFpv } = useVer();

    const [movieList, setMovieList] = useState([]);
    const [redirect, setRedirect] = useState(0);
    const usuarioEmail = useSelector(state => state.usuarioEmail);
    const idFireBase = idFire.toString();
    let listaVisto = [];

    const db = firebase.firestore();

    useEffect(() => {
        const loadAll = async () => {
          let list = await Tmdb.getFilmes({idFilme}.idFilme);
          setMovieList(list);
        }
        loadAll();
      }, []); 

    
    function RemoverVer(){
      firebase.firestore().collection('ListaVer').doc(idFireBase).delete()
      .then(() => {
        {setFpv(1)}
      }).catch(erro => {
        alert("Por favor tente novamente")
      })
    }

    if(fpv === 1){
      setFpv(0)
    }

   async function AdicionarVisto(id){

    await firebase.firestore().collection('ListaVisto').where('usuario','==', usuarioEmail).get().then(async (resultado) => {
      resultado.docs.forEach(doc => {
          listaVisto.push({
              id: doc.id,
                ...doc.data()
            })
        })
    })

    function Search(id){
    var found = listaVisto.find(function(element){
      if (element.idFilme === id){
          return true
      } else{
          return false
      }
    })
      return found;
    }  


      Search(id) === undefined ?

      db.collection('ListaVisto').add({
          idFilme: id,
          usuario: usuarioEmail
      }).then(() => {
          setRedirect(1);
          RemoverVer();
      }).catch(erro => {
          alert("Por favor tente novamente")
      })

      :

      setRedirect(1)
      RemoverVer();

}

    return(
      <>

      {
        redirect === 1 && <Redirect to ='/visto' />
      }

      <div className="listVer--listarea">

        {movieList.id !== undefined &&
            <div key={key}>
              <div className="listVer--item">
                <Link to={"/detalhes/" + movieList.id + '/' + movieList.title} >
                  <img src={`https://image.tmdb.org/t/p/w300${movieList.poster_path}`} alt={movieList.original_title}/>
                </Link>


                <div className="buttonAddVisto" onClick={() => AdicionarVisto(movieList.id)}> 
                    <AddIcon/>Já ví
                </div>

                <div className="RemoverVer" onClick={RemoverVer}> 
                    <RemoveIcon/>Não vou ver
                </div>

              </div>
            </div>
        }
      </div> 
    </>
    )
}

export default ListVer;