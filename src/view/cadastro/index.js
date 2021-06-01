import React, { useState } from 'react';


import firebase from '../../config/firebase';
import 'firebase/auth';

import './cadastro.css';
import { Redirect } from 'react-router-dom';
import NavBar from '../../components/navbar/navbar';
import { useSelector } from 'react-redux';

function NovoUsuario(){


    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [msgTipo, setMsgTipo] = useState();
    const [msg, setMsg] = useState(); 
    const [loading, setLoading] = useState();  
    const [redirect, setRedirect] = useState();
    const [viewMsg, setViewMsg] = useState();

    function cadastrar (){

        setLoading(1);

        if(!email || !senha){
            setViewMsg(1);
            setLoading(0);
            setMsgTipo('erro')
            setMsg('Você precisa informar o email e a senha para fazer o cadastro')
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, senha).then(resultado => {
            setViewMsg(1);
            setMsgTipo('sucesso')
            setLoading(0)
            setTimeout(() => {
                setRedirect(1);
            }, 4000);
            setTimeout(() => {
                setViewMsg(0);
            }, 2500);
        }).catch(erro => {
            setViewMsg(1);
            setMsgTipo('erro')
            setLoading(0)
               switch(erro.message)
               {
                   
                    case 'Password should be at least 6 characters': 
                        setMsg('A senha deve ter pelo menos 6 caracteres');
                    break;

                    case 'The email address is already in use by another account.': 
                        setMsg('Este email já esta sendo usado por outro usuário ');
                    break;

                    case 'The email address is badly formatted.': 
                        setMsg('O formato do email é inválido');
                    break;

                    default:
                        setMsg('Não foi possivel cadastrar. Tente novamente mais tarde');
                    break;
               }
               setTimeout(() => {
                setViewMsg(0);
            }, 2500);
        })
    }


    return(
        <>
        <NavBar></NavBar>

        {
            redirect === 1 && <Redirect to ='/login' />
        }
        {
        useSelector(state => state.usuarioLogado) > 0 && <Redirect to="/" />
        }

        <div className="form-cadastro">
            
            <form className="text-center form-login mx-auto">

            <div className="mb-4">
                <img className="mb-4" src="https://i.ibb.co/vxLmGq1/Favicon-removebg-preview.png" alt="" width="72" height="57" />
                <h1 className="h3 mb-3 font-weight-bold cadastro-cadastro-content" >Cadastro</h1>
            </div>

            <div className="cadastro-inputs-email">
                    <input type="email" className="form-control my-2" placeholder="Email" 
                    onChange={(e) => setEmail(e.target.value)}
                    />
            </div>
            
            <div className="cadastro-inputs-password">
                <input type="password" className="form-control my-2" placeholder="Senha" 
                onChange={(e) => setSenha(e.target.value)}
                />
            </div>

            <div className="msg-login text-black my-4">
                {viewMsg === 1 && (msgTipo === 'sucesso' &&  <span className="msgCerto"><strong>Trem cadastrou certin !</strong> Você será redirecionado &#128526;</span>)}
                {viewMsg === 1 && (msgTipo ==='erro' && <span className="msgErro"><strong>Uai, deu não.</strong> {msg} &#129301;</span>)}
            </div>

            {
                loading ? <div className="spinner-border text-danger" role="status"> <span className="visually-hidden">Loading...</span>  </div>
                : <button onClick={cadastrar} type="button" className="w-100 btn btn-lg btn-cadastro">Cadastrar</button>
            }

            </form>

        </div>
        </>
    )

}

export default NovoUsuario;
