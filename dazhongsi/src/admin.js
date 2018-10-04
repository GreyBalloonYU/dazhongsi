import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Layout,Menu,message,Row,Col,Button,Dropdown,Form,Modal,Input,Select} from 'antd';
import {Switch,Route,Redirect,Link}from 'react-router-dom';
import axios from "axios";
import Arrange from './arrange.js';
import DeleteCheckIn from './deleteCheckIn.js'
import DeleteSchedule from './deleteSchedule.js'
const { Header, Content, Footer } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

class ModifyPassword extends React.Component{
    constructor(props){
      super(props);
      this.state={
          visible:false,
      }
    }  
  
    showModal=()=>{
      this.setState({visible:true});
    }
  
    handleCancel=()=>{
      this.setState({visible:false});
    }
  
    handleSubmit=(e)=>{
      e.preventDefault();
      var that=this;
      this.props.form.validateFieldsAndScroll(['旧密码','新密码'],(err,values)=>{
        if(!err){
        var modifyPass=axios.create({
          url:"http://39.107.99.27:8080/dazhong/user/password?userId="+localStorage.getItem("userId")+"&oldPassword="+values.旧密码+"&newPassword="+values.新密码,
          headers:{"content-type":"application/json"},
          method:'put',
          timeout:1000,
          withCredentials:true,
         });
         modifyPass().then(function(response){
           if(response.data.result===1000){
             message.success(response.data.resultDesp,3);
           }
           else if(response.data.result===4001) message.error(response.data.resultDesp,3);
           that.setState({visible:false});  
         })
         .catch(function(error){
           message.error("修改密码失败",3);
           console.log(error);
         })  
        }    
      })
  }
  
    render(){
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
      return(
        <div>
          <Button onClick={this.showModal}>修改密码</Button>
          <Modal
                 title="修改密码"
                 visible={this.state.visible}
                 footer={null}
                 onCancel={this.handleCancel}
                 destroyOnClose={true}
                 width={600}
          >
            <Form onSubmit={this.handleSubmit}>
            <FormItem
              {...formItemLayout}
                label="旧密码"
            >
              {getFieldDecorator('旧密码', {
              rules: [{required: true, message: '请输入原密码!',whitespace:true}]
              })(
                  <Input type="password"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
                label="新密码"
            >
              {getFieldDecorator('新密码', {
              rules: [{required: true, message: '请输入新的密码!',whitespace:true}]
              })(
                  <Input type="password"/>
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">确认</Button>
            </FormItem>
            </Form>        
          </Modal>
        </div>
      )
    }
  }
  
const WrappedModifyPassword = Form.create()(ModifyPassword);

class SearchVolunteerInformation extends React.Component{
    constructor(props){
        super(props);
        this.state={
            visible:false,
            volunteerName:"",//搜索的志愿者的姓名
            volunteerInformation:{name:"",school:"",group:"",post:"",tel:"",note:""},
        }
    }

    showModal=()=>{
       this.setState({visible:true});
    }
    
    handleCancel=()=>{
       this.setState({visible:false});
    }

    handleChange=(value)=>{
        var getuserinformation=axios.create({
            url:"http://39.107.99.27:8080/dazhong/user/name?name="+value,
            headers:{"content-type":"application/json"},
            method:'get',
            timeout:1000,
            withCredentials:true,
        })
        var that=this;
        getuserinformation().then(function(response){
          var volunteerInformation={name:"",school:"",group:"",post:"",tel:"",note:""};
          volunteerInformation["name"]=response.data.content[0]["name"];
          volunteerInformation.note=response.data.content[0].note;
          volunteerInformation.tel=response.data.content[0].tel;
          volunteerInformation.school=response.data.content[0].school;
          volunteerInformation.group=response.data.content[0].group;
          volunteerInformation.post=response.data.content[0].post; 
          that.setState({volunteerInformation:volunteerInformation});
        })
        .catch(function(error){
          console.log(error);
        })
    }

    componentDidMount(){
        var that=this;
        var getAllUserName=axios.create({
            url:"http://39.107.99.27:8080/dazhong/user-name",
            headers:{"content-type":"application/json"},
            method:'get',
            timeout:1000,
            withCredentials:true,
        })
        getAllUserName().then(function(response){
            var dataRow=[];//所有志愿者名字列表
            for(var i=0;i<response.data.content.length;i++){
                dataRow.push(
                    <Option value={response.data.content[i]}>{response.data.content[i]}</Option>
                )
            } 
            that.setState({volunteerName:dataRow}); 
        })
    }

    render(){
        return(
            <div>
               <Button onClick={this.showModal} type="primary">查询志愿者信息</Button> 
               <Modal
                  title="管理最近两个月的排班表"
                  visible={this.state.visible}
                  footer={null}
                  maskClosable={false}
                  onCancel={this.handleCancel}
                  destroyOnClose={true}
                  width={900}
               > 
                <Row>
                  <Col xs={24} sm={8}>
                    <Select
                      showSearch
                      style={{ width: 250 }}
                      placeholder="搜索志愿者姓名,查询详细信息"
                      optionFilterProp="children"
                      onChange={this.handleChange}
                    >
                    {this.state.volunteerName}
                    </Select>
                  </Col>
                </Row>
                <br/><br/>
                <Row>
                <Col xs={24} sm={{span:6,offset:4}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   姓名
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.state.volunteerInformation["name"]!==""?this.state.volunteerInformation["name"]:"null"}
                   </span>
                   </div>
                </Col>
                <Col xs={24} sm={{span:6,offset:4}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   小组
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.state.volunteerInformation.group!==""?this.state.volunteerInformation.group:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:6,offset:4}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   学校
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.state.volunteerInformation.school!==""?this.state.volunteerInformation.school:"null"}
                   </span>
                   </div>
                </Col>
                <Col xs={24} sm={{span:6,offset:4}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   岗位
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.state.volunteerInformation.post!==""?this.state.volunteerInformation.post:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:6,offset:4}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   电话
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.state.volunteerInformation.tel!==""?this.state.volunteerInformation.tel:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:12,offset:4}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   备注
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.state.volunteerInformation.note!==""?this.state.volunteerInformation.note:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
               </Modal>
            </div>
        )
    }
}

class Admin extends React.Component{
    constructor(props){
        super(props);
        this.state={
            key:1,
            norepeatkey1:true,
            clickmenu:true,//确保是在点击侧边菜单的操作
            isquit:false,//是否登出
        }
    }

    componentWillMount(){
        if(window.location.pathname==='/admin/arrange'){
          this.setState({norepeatkey1:false})
        }
    }

    componentDidUpdate(){
        if(this.state.key==1&&this.state.norepeatkey1&&this.state.clickmenu){
         this.setState({norepeatkey1:false});
         }
    }

    changehref=({ item, key, keyPath })=>{
        this.setState({key:key,clickmenu:true,});
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
        const menu=(
            <Menu>
            <Menu.Item>
              <SearchVolunteerInformation/>
            </Menu.Item>
            <Menu.Item>
              <WrappedModifyPassword/>
            </Menu.Item>
            <Menu.Item>
              <Button onClick={this.quitUser} type="primary">登出</Button>
            </Menu.Item>
            </Menu>
        )
        if(this.state.key==1&&this.state.norepeatkey1&&this.state.clickmenu){
           return (<Redirect exact push to='/admin/arrange'/>);
        }
        if(this.state.isquit){
           return (<Redirect exact push to='/'/>);
        }
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
                  <Menu.Item className="menu2" key="1"><span className="label3">排班表</span></Menu.Item>
                  <Menu.Item className="disabledmenu" key="2" disabled={true}>
                  <span className="dropDown2">
                   <Dropdown overlay={menu} placement="bottomCenter">
                     <Button>{localStorage.getItem("name")}</Button>
                   </Dropdown>
                  </span>
                  </Menu.Item>
                  </Menu>
                </Header>
                <Content style={{ padding: '0 3.125em', marginTop: 64 }}>
                   <Switch>
                     <Route exact path='/admin/arrange' component={Arrange}/>
                     <Route path="/admin/deleteCheckIn" component={DeleteCheckIn}/> 
                     <Route path="/admin/deleteSchedule" component={DeleteSchedule}/>                
                   </Switch>
                   <br/><br/><br/><br/><br/>
                </Content>
            </Layout>
        )
    }
}

export default Admin;
