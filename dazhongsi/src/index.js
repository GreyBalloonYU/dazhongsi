import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Switch,Route,BrowserRouter}from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const Main=()=>(
    <main>
      <Switch>
        <Route exact path='/' component={App}/>
      </Switch>
    </main>
)

ReactDOM.render((
<BrowserRouter>
<App />
</BrowserRouter>), document.getElementById('root'));
registerServiceWorker();
