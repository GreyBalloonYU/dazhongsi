import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Layout,Menu,message} from 'antd';
import {Switch,Route,Redirect}from 'react-router-dom';
import axios from "axios";
import Checkin from './checkin.js';
import Arrange from './arrange.js';
const { Header, Content, Footer } = Layout;

class Center extends React.Component{
    constructor(props){
        super(props);
        this.state={
            key:1,
            norepeatkey1:true,
            norepeatkey2:true,
            clickmenu:true,//确保是在点击侧边菜单的操作
        }
    }

    componentWillMount(){
        if(window.location.pathname==='/center/checkin'){
          this.setState({norepeatkey1:false})
        }
        if(window.location.pathname==='/center/arrange'){
          this.setState({norepeatkey2:false})
        }
    }

    componentDidMount(){
        var getuserinformation=axios.create({
            url:"http://39.107.99.27:8080/dazhong/user/name?name="+localStorage.getItem("name"),
            headers:{"content-type":"application/json"},
            method:'get',
            timeout:1000,
        })
        getuserinformation().then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        })
    }

    componentDidUpdate(){
        if(this.state.key==1&&this.state.norepeatkey1&&this.state.clickmenu){
         this.setState({norepeatkey1:false,norepeatkey2:true});
         }
        if(this.state.key==2&&this.state.norepeatkey2&&this.state.clickmenu){
         this.setState({norepeatkey1:true,norepeatkey2:false});
        }
    }

    changehref=({ item, key, keyPath })=>{
        this.setState({key:key,clickmenu:true,});
    }

    render(){
        if(this.state.key==1&&this.state.norepeatkey1&&this.state.clickmenu){
           return (<Redirect exact push to='/center/checkin'/>);
        }
        if(this.state.key==2&&this.state.norepeatkey2&&this.state.clickmenu){
           return (<Redirect exact push to='/center/arrange'/>);
        }
        return(
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                  <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[String(this.state.key)]}
                    style={{ lineHeight: '64px' }}
                    onClick={this.changehref}
                  >
                  <Menu.Item key="1">我的</Menu.Item>
                  <Menu.Item key="2">排班表</Menu.Item>
                  </Menu>
                </Header>
                <Content style={{ padding: '0 50px', marginTop: 64 }}>
                   <Switch>
                     <Route exact path="/center/checkin" component={Checkin}/>
                     <Route exact path="/center/arrange" component={Arrange}/>
                   </Switch>
                </Content>
            </Layout>
        )
    }
}

export default Center;
