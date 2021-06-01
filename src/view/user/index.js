import React, { useState } from 'react';
import NavBar from '../../components/navbar/navbar';
import './user.css';
import { useSelector, useDispatch } from 'react-redux';
import {Redirect} from 'react-router-dom';
import firebase from '../../config/firebase';
import 'firebase/auth';


function User(props){

    const [viewMsg, setViewMsg] = useState();
    const [msg, setMsg] = useState();
    const [redirectHome, setRedirectHome] = useState(0);

    const dispatch = useDispatch();

    function mudarSenha(email){
        firebase.auth().sendPasswordResetEmail(email).then(resultado => {
            setViewMsg(1);
            setMsg('Enviamos um link no seu email para você redefinir sua senha!')
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
        }).catch(erro => {
            setViewMsg(1);
            setMsg('Tente Novamente')
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
        })
    }

    function deletarConta(){
        var userr = firebase.auth().currentUser;
        userr.delete().then(resultado => {
            setViewMsg(1);
            setMsg('Infelizmente sua conta foi excluida, logo você será redirecionado para a página inicial')
            setTimeout(() => {
                setViewMsg(0);
                dispatch({type:'LOG_OUT'})
                setRedirectHome(1);
            }, 2500)
        }).catch(erro =>{
            setViewMsg(1);
            setMsg('Saia, faça login e tente novamente')
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
        })
    }


    return(
        <>
        {
            useSelector(state => state.usuarioLogado) === 0 ? <Redirect to='/login' /> : null
        }
        {
            useSelector(state => state.usuarioEmail) !== props.match.params.user ? <Redirect to='/' /> : null
        }
        {
            redirectHome === 1 && <Redirect to="/" />
        }

        <NavBar show={true} />
        <section className="backImg" style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: 'url(https://static.zerochan.net/ONE.PIECE.full.691826.jpg)', opacity: 0.8
        }}>
            <div className="backImg--horizontal">
            </div>
            <h1 className="nameUser">{props.match.params.user}</h1>
            <div className="buttons-user">
                <div className="password-button" onClick={() => mudarSenha(props.match.params.user)}>
                    Mudar Senha
                </div>
                <div className="delete-button" onClick={() => deletarConta()}>
                    Excluir Conta
                </div>
                {viewMsg === 1 && <div className="smsErro"> {msg} </div>}
            </div>
        </section>
        </>
    )
}

export default User;