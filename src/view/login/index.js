import React, { useState } from 'react';
import './login.css';
import {Link, Redirect} from 'react-router-dom';


import firebase from '../../config/firebase';
import 'firebase/auth';
import NavBar from '../../components/navbar/navbar';

import { useSelector, useDispatch } from 'react-redux';


function Login(){

    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [msgTipo, setMsgTipo] = useState();
    const [loading, setLoading] = useState();  
    const [msg, setMsg] = useState(); 
    const [viewMsg, setViewMsg] = useState();

    const dispatch = useDispatch();

    function Logar(){
        
        setLoading(1);

        if(!email || !senha){
            setViewMsg(1);
            setLoading(0);
            setMsgTipo('erro')
            setMsg('Você precisa informar o email e a senha para fazer o login')
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, senha).then(resultado =>{
            setViewMsg(1);
            setLoading(0)
            setMsgTipo('sucesso')
            setTimeout(() => {
                dispatch({type:'LOG_IN', usuarioEmail: email})
            }, 4000);
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);

        }).catch(erro =>{
            setViewMsg(1);
            setLoading(0)
            setMsgTipo('erro');
            setMsg('Verifique o email e/ou a senha')
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
        });
    }

    return(

    <>
    {
        useSelector(state => state.usuarioLogado) > 0 && <Redirect to="/" />
    }
    
    <NavBar></NavBar>

    <div className="login-content">
        
    <form className="text-center form-signin  mx-auto">
        
        <div className="text-center mb-4">
            <img className="mb-4" src="https://i.ibb.co/vxLmGq1/Favicon-removebg-preview.png" alt="" width="72" height="57" />
            <h1 className="h3 mb-3 font-weight-bold login-login-content" >Login</h1>
        </div>

        <div className="login-inputs-email">
            <input type="email" id="inputEmail" className="form-control my-2" placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)}
             />
        </div>

        <div className="login-inputs-password">
            <input type="password" id="inputPassword" className="form-control my-2" placeholder="Senha" 
             onChange={(e) => setSenha(e.target.value)}
            />
        </div>

        <div className="msg-login text-black text-center my-4">
            
            {viewMsg === 1 && (msgTipo === 'sucesso' &&  <span className="msgCerto"><strong>Trem deu certo!</strong> Você será redirecionado &#128526;</span>)}
            {viewMsg === 1 && (msgTipo ==='erro' && <span className="msgErro"><strong>Uai, deu não.</strong> {msg} &#129301;</span>)}
     
        </div>

        {
            loading ? <div className="spinner-border text-danger" role="status"> <span className="visually-hidden">Loading...</span>  </div>
            : <button className="w-100 btn btn-lg btn-login" type="button" onClick={Logar}>Entrar</button>
        }

        <div className="options-login my-4 text-center">
            <Link to="/remember" className="mx-2">Esqueceu a senha?</Link>
            <span className="login-symbol">&#9749;</span>
            <Link to ="/cadastrar" className="mx-2">Cadastrar</Link>
        </div>

  </form>
  </div>
    </>
    )
}



export default Login;