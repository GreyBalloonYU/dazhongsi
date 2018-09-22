import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Layout,Menu,message,Col,Button} from 'antd';
import {Switch,Route,Redirect}from 'react-router-dom';
import WrappedVolunteerCheckin from './volunteerCheckin.js'
import VolunteerArrange from './volunteerArrange.js'
import axios from "axios";
const { Header, Content, Footer } = Layout;
var user={accountId:"",address:"",age:"",gender:"",id:"",idNumber:"",name:"",note:"",tel:""};

class Volunteer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            key:1,
            norepeatkey1:true,
            norepeatkey2:true,
            clickmenu:true,//确保是在点击侧边菜单的操作
            isquit:false,//是否登出
        }
    }

    componentWillMount(){
        if(window.location.pathname==='/volunteer/checkin'){
          this.setState({norepeatkey1:false})
        }
        if(window.location.pathname==='/volunteer/arrange'){
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

    changeUserInformation=(values)=>{
        this.setState({
            address:values.地址,
            age:values.年龄,
            idNumber:values.身份证号,
            name:values.姓名,
            note:values.备注,
            tel:values.电话,
        });
    }

    quitUser=()=>{
        var that=this;
        var quituser=axios.create({
            url:"http://39.107.99.27:8080/dazhong/account",
            headers:{"content-type":"application/json"},
            method:'delete',
            timeout:1000,
            withCredentials:true,
        }) 
        quituser().then(function(response){
            message.success("退出成功",3);
            that.setState({isquit:true});
        })
        .catch(function(error){
            message.error("登出失败",3);
            console.log(error);
        })
    }

    render(){
        if(this.state.key==1&&this.state.norepeatkey1&&this.state.clickmenu){
           return (<Redirect exact push to='/volunteer/checkin'/>);
        }
        if(this.state.key==2&&this.state.norepeatkey2&&this.state.clickmenu){
           return (<Redirect exact push to='/volunteer/arrange'/>);
        }
        if(this.state.isquit){
           return (<Redirect exact push to='/'/>);
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
                     <Route exact path='/volunteer/checkin' render={(props)=>(
                      <WrappedVolunteerCheckin {...props} user={user} changeUserInformation={this.changeUserInformation}/> 
                     )}/>
                     <Route exact path='/volunteer/arrange' component={VolunteerArrange}/>             
                   </Switch>
                   <br/><br/><br/>
                   <Col xs={24} sm={{span:1,offset:11}}>
                   <Button onClick={this.quitUser} size="large" type="primary">登出</Button>
                   </Col>
                   <br/><br/>
                </Content>
            </Layout>
        )
    }
}

export default Volunteer;