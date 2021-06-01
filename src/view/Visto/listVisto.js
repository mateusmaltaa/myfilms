import React, {useEffect, useState} from "react";
import Tmdb from '../../config/tmdb';
import { Link, Redirect } from "react-router-dom";
import './listVisto.css';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import {useSelector} from 'react-redux';
import firebase from '../../config/firebase';
import { useVisto } from '../../store/vistoContext'

function ListVisto({key, idFire, idFilme}){

    const { fv, setFv } = useVisto();
    const [redirect, setRedirect] = useState(0);
    const usuarioEmail = useSelector(state => state.usuarioEmail);
    const idFireBase = idFire.toString();
    let listaVer = [];
    const [movieList, setMovieList] = useState([]);

    const db = firebase.firestore();

    useEffect(() => {
        const loadAll = async () => {
          let list = await Tmdb.getFilmes({idFilme}.idFilme);
          setMovieList(list);
        }
        loadAll();
      }, []); 


      function RemoverVisto(){
        firebase.firestore().collection('ListaVisto').doc(idFireBase).delete()
        .then(() => {
          {setFv(1)}
        }).catch(erro => {
          alert("Por favor tente novamente")
        })
      }

      if(fv === 1){
        setFv(0)
      }


      async function AdicionarVer(id){

        await firebase.firestore().collection('ListaVer').where('usuario','==', usuarioEmail).get().then(async (resultado) => {
          resultado.docs.forEach(doc => {
              listaVer.push({
                  id: doc.id,
                    ...doc.data()
                })
            })
        })
    
        function Search(id){
        var found = listaVer.find(function(element){
          if (element.idFilme === id){
              return true
          } else{
              return false
          }
        })
          return found;
        }  
    
          Search(id) === undefined ?
    
          db.collection('ListaVer').add({
              idFilme: id,
              usuario: usuarioEmail
          }).then(() => {
              setRedirect(1);
              RemoverVisto();
          }).catch(erro => {
              alert("Por favor tente novamente")
          })
    
          :
    
          setRedirect(1)
          RemoverVisto();
    
    }


    return(
      <>
      {
        redirect === 1 && <Redirect to ='/ver' />
      }
        <div className="listVer--listarea">

        {movieList.id !== undefined &&
          <div key={key}>
            <div className="listVer--item">
              <Link to={"/detalhes/" + movieList.id + '/' + movieList.title}>
                <img src={`https://image.tmdb.org/t/p/w300${movieList.poster_path}`} alt={movieList.original_title}/>
              </Link>

              <div className="buttonAddVer" onClick={() => AdicionarVer(movieList.id)}> 
                    <AddIcon/>Ver de novo
              </div>

              <div className="RemoverVisto" onClick={RemoverVisto}> 
                    <RemoveIcon/>Não vi
              </div>
            </div>
          </div>
        }
        </div>
      </> 
    )
}

export default ListVisto;