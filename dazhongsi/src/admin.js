import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Layout,Menu,message} from 'antd';
import {Switch,Route,Redirect}from 'react-router-dom';
import axios from "axios";
import Checkin from './checkin.js';
import Arrange from './arrange.js';
const { Header, Content, Footer } = Layout;
var user={accountId:"",address:"",age:"",gender:"",id:"",idNumber:"",name:"",note:"",tel:""};

class Admin extends React.Component{
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
        if(window.location.pathname==='/admin/checkin'){
          this.setState({norepeatkey1:false})
        }
        if(window.location.pathname==='/admin/arrange'){
          this.setState({norepeatkey2:false})
        }
    }

    componentDidMount(){
        var getuserinformation=axios.create({
            url:"http://39.107.99.27:8080/dazhong/user/name?name="+localStorage.getItem("name"),
            headers:{"content-type":"application/json"},
            method:'get',
            timeout:1000,
            withCredentials:true,
        })
        var that=this;
          getuserinformation().then(function(response){
            that.setState({
                accountId:response.data.content[0].accountId,
                address:response.data.content[0].address,
                age:response.data.content[0].age,
                gender:response.data.content[0].gender,
                id:response.data.content[0]["id"],
                idNumber:response.data.content[0].idNumber,
                name:response.data.content[0]["name"],
                note:response.data.content[0].note,
                tel:response.data.content[0].tel,
            });
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
           return (<Redirect exact push to='/admin/checkin'/>);
        }
        if(this.state.key==2&&this.state.norepeatkey2&&this.state.clickmenu){
           return (<Redirect exact push to='/admin/arrange'/>);
        }
        user.accountId=this.state.accountId;
        user.address=this.state.address;
        user.age=this.state.age;
        user.gender=this.state.gender;
        user["id"]=this.state["id"];
        user.idNumber=this.state.idNumber;
        user["name"]=this.state["name"];
        user.note=this.state.note;
        user.tel=this.state.tel;
        return(
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                  <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[String(this.state.key)]}
                    style={{ lineHeight: '4.6em' }}
                    onClick={this.changehref}
                  >
                  <Menu.Item key="1">我的</Menu.Item>
                  <Menu.Item key="2">排班表</Menu.Item>
                  </Menu>
                </Header>
                <Content style={{ padding: '0 3.125em', marginTop: 64 }}>
                   <Switch>
                     <Route exact path='/admin/checkin' render={(props)=>(
                      <Checkin {...props} user={user}/> 
                     )}/>
                     <Route exact path="/admin/arrange" component={Arrange}/>
                   </Switch>
                </Content>
            </Layout>
        )
    }
}

export default Admin;
