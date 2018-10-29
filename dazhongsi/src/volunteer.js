import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Layout,Menu,message,Col,Button,Dropdown,Form,Modal,Input,Radio} from 'antd';
import {Switch,Route,Redirect}from 'react-router-dom';
import VolunteerCheckin from './volunteerCheckin.js'
import VolunteerArrange from './volunteerArrange.js'
import axios from "axios";
const { Header, Content, Footer } = Layout;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
var user={accountId:"",gender:"",id:"",name:"",note:"",tel:"",school:"",group:"",post:""};

class ModifyUserInformation extends React.Component{
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
        this.props.form.validateFieldsAndScroll((err,values)=>{
          if(!err){
          var modifyUser=axios.create({
            url:"http://39.107.99.27:8080/dazhong/user",
            headers:{"content-type":"application/json"},
            method:'put',
            data:{
              userId:that.props.user["id"],
              name:values.姓名,
              gender:that.props.user.gender,
              school:values.学校,
              group:values.小组,
              tel:values.电话,
              post:values.岗位,
              note:values.备注
            },
            timeout:1000,
            withCredentials:true,
           });
           modifyUser().then(function(response){
             if(response.data.result===1000){
               message.success(response.data.resultDesp,3);
               that.props.changeUserInformation(values);
             }
             else if(response.data.result===4005) message.error(response.data.resultDesp,3);
           })
           .catch(function(error){
             message.error("修改信息失败",3);
             console.log(error);
           }) 
           this.setState({visible:false});       
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
        const tips=(
            <p style={{fontSize:"20px"}}>在原先的信息上修改</p>
        )
        return(
            <div>
               <Button type="primary" onClick={this.showModal}>修改用户信息</Button>
               <Modal
                 title="修改用户信息"
                 visible={this.state.visible}
                 footer={null}
                 onCancel={this.handleCancel}
                 destroyOnClose={true}
                 width={600}
               >
                <Form onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                   label="姓名"
                >
                 {getFieldDecorator('姓名', {
                  rules: [{
                    required: true, message: '请输入姓名!',whitespace:true
                  }],initialValue:this.props.user["name"]}
                  )(
                     <Input />
                 )}
                </FormItem> 
                <FormItem
                  {...formItemLayout}
                   label="学校"
                >
                 {getFieldDecorator('学校', {
                  rules: [{
                    required: true, message: '请输入你的学校!',whitespace:true
                  }],initialValue:this.props.user.school}
                  )(
                     <Input />
                 )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                   label="小组"
                >
                 {getFieldDecorator('小组', {
                  rules: [{
                    whitespace:true
                  }],initialValue:this.props.user.group}
                  )(
                     <Input />
                 )}
                </FormItem>    
                <FormItem
                  {...formItemLayout}
                   label="电话"
                >
                 {getFieldDecorator('电话', {
                  rules: [{
                    required: true, message: '请输入电话号码!',whitespace:true
                  }],initialValue:this.props.user.tel}
                  )(
                     <Input />
                 )}
                </FormItem>  
                <FormItem
                  {...formItemLayout}
                   label="岗位"
                >
                 {getFieldDecorator('岗位', {
                  rules: [{
                    required: true, message: '请选择你的岗位!',
                  }],initialValue:this.props.user.post}
                 )(
                  <RadioGroup >
                    <Radio value={"志愿讲解岗"}>志愿讲解岗</Radio>
                    <Radio value={"志愿科普岗"}>志愿科普岗</Radio>
                  </RadioGroup>
                 )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                   label="备注"
                >
                 {getFieldDecorator('备注', {
                  rules: [{
                    whitespace:true
                  }],initialValue:this.props.user.note
                  })(
                     <Input />
                 )}
                </FormItem>
                <FormItem
                 {...tailFormItemLayout}
                 help={tips}
                >
                <Button type="primary" htmlType="submit">提交</Button>
                </FormItem>               
                </Form>
              </Modal>
            </div>
        )
    }
}

const WrappedModifyUserInformation = Form.create()(ModifyUserInformation);

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
          url:"http://39.107.99.27:8080/dazhong/user/password?userId="+this.props.userId+"&oldPassword="+values.旧密码+"&newPassword="+values.新密码,
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
                gender:response.data.content[0].gender,
                id:response.data.content[0]["id"],
                name:response.data.content[0]["name"],
                note:response.data.content[0].note,
                tel:response.data.content[0].tel,
                school:response.data.content[0].school,
                group:response.data.content[0].group,
                post:response.data.content[0].post,               
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
            name:values.姓名,
            group:values.小组,
            school:values.学校,
            post:values.岗位,
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
        const menu=(
            <Menu>
            <Menu.Item>
              <WrappedModifyUserInformation user={user} changeUserInformation={this.changeUserInformation}/>
            </Menu.Item>
            <Menu.Item>
              <WrappedModifyPassword userId={this.state.accountId}/>
            </Menu.Item>
            <Menu.Item>
              <Button onClick={this.quitUser} type="primary">登出</Button>
            </Menu.Item>
            </Menu>
        )
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
        user.gender=this.state.gender;
        user["id"]=this.state["id"];
        user["name"]=this.state["name"];
        user.note=this.state.note;
        user.tel=this.state.tel;
        user.school=this.state.school;
        user.group=this.state.group;
        user.post=this.state.post;
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
                  <Menu.Item key="1" className="menu"><span className="label">我的</span></Menu.Item>
                  <Menu.Item key="2" className="menu"><span className="label2">排班表</span></Menu.Item>
                  <Menu.Item key="3" className="disabledmenu" disabled={true}>
                  <span className="dropDown">
                   <Dropdown overlay={menu} placement="bottomCenter" trigger={['click','hover']}>
                     <Button>{this.state["name"]}</Button>
                   </Dropdown>
                  </span>
                  </Menu.Item>
                  </Menu>
                </Header>
                <Content style={{ padding: '0 3.125em', marginTop: 64 }}>
                   <Switch>
                     <Route exact path='/volunteer/checkin' render={(props)=>(
                      <VolunteerCheckin {...props} user={user} changeUserInformation={this.changeUserInformation}/> 
                     )}/>
                     <Route exact path='/volunteer/arrange' component={VolunteerArrange}/>             
                   </Switch>
                   <br/><br/><br/><br/><br/>
                </Content>
            </Layout>
        )
    }
}

export default Volunteer;