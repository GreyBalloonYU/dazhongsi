import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Admin from './admin.js'
import Volunteer from './volunteer.js'
import {Switch,Route,BrowserRouter}from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const Main=()=>(
    <main>
      <Switch>
        <Route exact path='/' component={App}/>
        <Route path='/admin' component={Admin}/>
        <Route path='/volunteer' component={Volunteer}/>
      </Switch>
    </main>
)

ReactDOM.render((
<BrowserRouter>
<Main />
</BrowserRouter>), document.getElementById('root'));
registerServiceWorker();
