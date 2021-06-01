import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';



function NavBar(showNav){

    const email = useSelector(state => state.usuarioEmail);
    const dispatch = useDispatch();
    var vI = '';


    function resetSearch(){
        const url = window.location.href;
        url === 'http://localhost:3000/' ? window.location.reload()
        : vI = '/';
    }

    return ( 

    <nav className={showNav.show ? 'navbar navbar-expand-lg navOpacity' : 'navbar navbar-expand-lg'}>
        <div className="container-fluid">
            <Link onClick={resetSearch} className="navbar-brand" to={vI}>MY Filmes</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <i className="fas fa-bars text-black"></i>
                </button>
            <div className="items-user collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">

                    {
                        useSelector(state => state.usuarioLogado) === 0 
? 
                    <>
                    <li className="nav-item">
                        <Link className="nav-link" aria-current="page" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/cadastrar">Cadastrar</Link>
                    </li>
                    <div className="rota--quemsomos">
                    <li className="nav-item">
                        <Link className="nav-link" to="/quemsomos">Quem Somos</Link>
                    </li>
                    </div>
                    </>
:
                    <>
                    <li className="nav-item">
                        <Link className="nav-link" aria-current="page" to="/ver">Ver</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/visto">Vistos</Link>
                    </li>
                    <div className="nav-item-email-sair">
                    <li className="nav-item--quemsomos">
                        <Link className="nav-link" to="/quemsomos">Quem Somos</Link>
                    </li>
                    <li className="nav-item--email">
                        <Link className="nav-link" to={"/user/" + email}>{email}</Link>
                    </li>
                    <li className="nav-item--sair">
                        <p className="nav-link back" onClick={() => dispatch({type:'LOG_OUT'})}>Sair</p>
                    </li>
                    </div>
                    </>
                    }

                </ul>
            </div>
        </div>
    </nav>
        

    )
}


export default NavBar;
