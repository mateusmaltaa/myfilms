import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import {store, persistor} from '../src/store/';
import VerProvider from './store/verContext'
import VistoProvider from './store/vistoContext'
import './App.css'
import { PersistGate } from 'redux-persist/integration/react'
 
/* PÁGINAS */
import Login from './view/login/'
import NovoUsuario from './view/cadastro'
import Home from './view/home'
import Remember from './view/remember-password'
import Visto from './view/Visto'
import Ver from './view/Ver'
import Detalhes from './view/detalhes';
import User from './view/user'
import QuemSomos from './view/quemsomos'




function App() {
  return (
    <VistoProvider>
    <VerProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Route exact path='/login' component={Login} />
        <Route path='/detalhes/:id/:name' component={Detalhes} />
        <Route exact path='/ver' component={Ver} />
        <Route exact path='/visto' component={Visto} />
        <Route exact path='/cadastrar' component={NovoUsuario} />
        <Route exact path='/' component={Home} />
        <Route exact path='/quemsomos' component={QuemSomos} />
        <Route exact path='/remember' component={Remember} />
        <Route path='/user/:user' component={User} />
      </Router>
      </PersistGate>
    </Provider>
    </VerProvider>
    </VistoProvider>
  );
}

export default App;
