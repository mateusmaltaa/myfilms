import React, { useState } from 'react';
import './remember-password.css';
import NavBar from '../../components/navbar/navbar';


import firebase from '../../config/firebase';
import 'firebase/auth';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

function RememberPassword(){

    const [email, setEmail] = useState();
    const [msg, setMsg] = useState();
    const [corMsg, setCorMsg] = useState();
    const [loading, setLoading] = useState();
    const [viewMsg, setViewMsg] = useState();

    function RecuperarSenha(){
        
        setLoading(1);


        if(!email){
            setViewMsg(1);
            setLoading(0);
            setCorMsg(0);
            setMsg('Você precisa informar o email e a senha para fazer a recuperação')
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
            return;
        }

        firebase.auth().sendPasswordResetEmail(email).then(resultado => {
            setViewMsg(1);
            setLoading(0);
            setMsg('Enviamos um link no seu email para você redefinir sua senha!')
            setCorMsg(1)
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
        }).catch(erro => {
            setViewMsg(1);
            setLoading(0);
            setMsg('Verifique se o email está correto')
            setCorMsg(0);
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
        })
    }
    
    return(
        <>
        {
            useSelector(state => state.usuarioLogado) > 0 && <Redirect to="/" />
        }
            <NavBar></NavBar>
            <div className="div-remember">
                <form className="text-center form-remember mx-auto">
                    <h1 className="h1-prince mb-4 font-weigth-bold">Recuperar Senha</h1>
                    <input type="email" className="item-email form-control my-2" placeholder="Email" 
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <div className="msg my-4">
                        <span>            
                            {viewMsg === 1 && (corMsg === 1 && <span className="msgOk"> <strong>Trem deu certo!</strong> {msg} &#128526;</span>)}
                            {viewMsg === 1 && (corMsg === 0 && <span className="msgNotOk"> <strong>Uai, deu não.</strong> {msg} &#129301;</span>)}
                        </span>
                    </div>

                    {
                        loading ? <div className="spinner-border text-danger" role="status"> <span className="visually-hidden">Loading...</span>  </div>
                        :  <button type="button" className="w-100 btn btn-lg btn-enviar" onClick={RecuperarSenha}>Recuperar Senha</button>
                    }

                   
                </form>
            </div>


        </>
    )
}

export default RememberPassword;