import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Center from './center.js'
import {Switch,Route,BrowserRouter}from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const Main=()=>(
    <main>
      <Switch>
        <Route exact path='/' component={App}/>
        <Route path='/center' component={Center}/>
      </Switch>
    </main>
)

ReactDOM.render((
<BrowserRouter>
<Main />
</BrowserRouter>), document.getElementById('root'));
registerServiceWorker();
