import React, { Component } from 'react';
import './App.css';
import {Row,Col,Button,Modal,Form,Radio,Input,message,List,Select,Tag} from 'antd';
import {Redirect}from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {_} from 'underscore';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
var User={username:'',password:'',name:'',gender:'',school:'',group:'',tel:'',post:'',note:''};
var codeurl=""//注册对话框图片验证码的url
var codeurl2=""//登录对话框图片验证码的url
var enrollUser=axios.create({
  url:"http://39.107.99.27:8080/dazhong/account",
  headers:{"content-type":"application/json"},
  method:'post',
  data:User,
  timeout:1000,
  withCredentials:true,
});
//加时间戳
function timestamp(url){  
     //  var getTimestamp=Math.random();  
     var getTimestamp=new Date().getTime();  
     url=url+"?timestamp="+getTimestamp  
     return url;  
}  
class Login extends React.Component{
  constructor(props){
    super(props);
    this.state={
      visible:false,
      redirect:false,
    }
  }
  
  componentDidMount(){
    codeurl2=timestamp("http://39.107.99.27:8080/dazhong/account/imageCode");
  }

  showModal=()=>{
    codeurl2=timestamp("http://39.107.99.27:8080/dazhong/account/imageCode");
    this.setState({visible:true});
  }

  handleCancel=()=>{
    this.setState({visible:false});
  }

  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var urls="http://39.107.99.27:8080/dazhong/account?username="+values.用户名+"&password="+values.密码;
        var loginUser=axios.create({
          url:urls,
          headers:{"content-type":"application/json"},
          method:'get',
          timeout:1000,
          withCredentials:true,
        })
        let urlss="http://39.107.99.27:8080/dazhong/account/imageCode?checkCode="+values.验证码;
        var checkImageCode=axios.create({
          url:urlss,
          headers:{"content-type":"application/json"},
          method:'post',
          timeout:1000,
          withCredentials:true,
        });//检验验证码是否输入正确
        var that=this;
        checkImageCode().then(function(response1){
          if(response1.data.result===1000){
            loginUser().then(function(response){
              if(response.data.result===1000){
                localStorage.setItem("name",response.data.content["name"]);
                localStorage.setItem("userId",response.data.content["id"]);
                localStorage.setItem("role",response.data.content["role"]);
                that.setState({visible:false,redirect:true});
                message.success(response.data.resultDesp,3);
              }
              else if(response.data.result===4001){
                message.error(response.data.resultDesp,3);
              }
            })
            .catch(function(error){
              message.error('登录失败!',3);
              console.log(error);
            });
          }
          else if(response1.data.result===4007){
            message.error(response1.data.resultDesp,3);
            codeurl2=timestamp("http://39.107.99.27:8080/dazhong/account/imageCode");
          }
          else if(response1.data.result===4008){
            message.error(response1.data.resultDesp,3);
          }
        })
        .catch(function(error1){
          console.log(error1);
          message.error('验证码错误!',3);
          codeurl2=timestamp("http://39.107.99.27:8080/dazhong/account/imageCode");
        })
      }
    });
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
    if(this.state.redirect){
      if(localStorage.getItem("role")==="管理员")return <Redirect exact push to="/admin/checkin"/>
      else return <Redirect exact push to="/volunteer"/>
    }
    return(
       <div>
          <div className="login">
          <Button type="primary" style={{width:"9.375em",height:"3.125em"}} onClick={this.showModal}>登录</Button>
          </div>
          <Modal 
          title="用户登录"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="用户名"
          >
            {getFieldDecorator('用户名', {
              rules: [{required: true, message: '请输入用户名!',whitespace:true}],
             })(
               <Input/>
             )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码"
          >
            {getFieldDecorator('密码', {
              rules: [{required: true, message: '请输入密码!',whitespace:true}],
            })(
              <Input type="password" />
             )}
          </FormItem>
          <FormItem
             {...formItemLayout}
             label="验证码"
            >
            {getFieldDecorator('验证码', {
            rules: [{
              whitespace:true,required: true, message: '请输入验证码!',
            }],
            })(
            <div>
            <Input />
            <img src={codeurl2} alt="图片验证码" />  
            </div>          
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

class Register extends React.Component{
  constructor(props){
    super(props);
    this.state={
      visible:false,
      confirmDirty: false,
    }
  }

  componentDidMount(){
    codeurl=timestamp("http://39.107.99.27:8080/dazhong/account/imageCode");
  }

  showModal=()=>{
    codeurl=timestamp("http://39.107.99.27:8080/dazhong/account/imageCode");
    this.setState({visible:true});
  }

  handleCancel=()=>{
    this.setState({visible:false});
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('密码')) {
      callback('您输入的两个密码不一致!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['确认密码'], { force: true });
    }
    callback();
  }

  checkidNumber = (rule, value, callback) => {
    if (value && !reg.test(value)) {
      callback('身份证输入不合法!');
    }
    callback();
  }

  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        User["name"]=values.姓名;
        User.username=values.用户名;
        User.gender=values.性别;
        User.password=values.密码;
        User.tel=values.电话;
        User.school=values.学校;
        User.group=values.小组;
        User.post=values.岗位;
        User.note=values.备注;
        if(typeof(User.group)=="undefined"||User.group==''){
          delete User.group;
        }
        if(typeof(User.note)=="undefined"||User.note==''){
          delete User.note;
        }
        let urlss="http://39.107.99.27:8080/dazhong/account/imageCode?checkCode="+values.验证码;
        var checkImageCode=axios.create({
          url:urlss,
          headers:{"content-type":"application/json"},
          method:'post',
          timeout:1000,
          withCredentials:true,
        });//检验验证码是否输入正确
        var that=this;
        checkImageCode().then(function(response1){
          if(response1.data.result===1000){
          enrollUser().then(function(response){
            if(response.data.result===1000){
              that.setState({visible:false});
              message.success(response.data.resultDesp,3);
            }
            else if(response.data.result===4002){
              message.error(response.data.resultDesp,3);
            }
          })
          .catch(function(error){
            message.error('用户创建失败!',3);
            console.log(error);
          });
        }
        else if(response1.data.result===4007){
          message.error(response1.data.resultDesp,3);
          codeurl=timestamp("http://39.107.99.27:8080/dazhong/account/imageCode");
        }
        else if(response1.data.result===4008){
          message.error(response1.data.resultDesp,3);
        }
        })
        .catch(function(error1){
          console.log(error1);
          message.error('验证码错误!',3);
          codeurl=timestamp("http://39.107.99.27:8080/dazhong/account/imageCode");
        })
      }
    });
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
      <div className="register">  
      <Button type="primary" style={{width:"9.375em",height:"3.125em"}} onClick={this.showModal}>注册</Button>
      </div>
       <Modal
          title="用户注册"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
          destroyOnClose={true}
       >
        <Form onSubmit={this.handleSubmit}>
            <FormItem
             {...formItemLayout}
             label="用户名"
            >
            {getFieldDecorator('用户名', {
            rules: [{
              required: true, message: '请输入你的用户名!',whitespace:true
            }],
            })(
            <Input />
            )}
            </FormItem>
            <FormItem
             {...formItemLayout}
             label="姓名"
            >
            {getFieldDecorator('姓名', {
            rules: [{
              required: true, message: '请输入你的姓名!',whitespace:true
            }],
            })(
            <Input />
            )}
            </FormItem>
            <FormItem
             {...formItemLayout}
             label="性别"
            >
            {getFieldDecorator('性别', {
            rules: [{
              required: true, message: '请选择性别!',
            }],
            })(
                <RadioGroup >
                <Radio value={"男"}>男</Radio>
                <Radio value={"女"}>女</Radio>
                </RadioGroup>
            )}
            </FormItem>
            <FormItem
             {...formItemLayout}
             label="密码"
            >
            {getFieldDecorator('密码', {
             rules: [{
              required: true, message: '请输入你的密码!',whitespace:true
            }, {
              validator: this.validateToNextPassword,
            }],
             })(
            <Input type="password" />
             )}
             </FormItem>
            <FormItem
             {...formItemLayout}
             label="再次确认密码"
            >
            {getFieldDecorator('确认密码', {
            rules: [{
              required: true, message: '请确认你的密码!',whitespace:true
            }, {
              validator: this.compareToFirstPassword,
            }],
             })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
            </FormItem>
            <FormItem
             {...formItemLayout}
             label="学校"
            >
            {getFieldDecorator('学校', {
            rules: [{
              required: true, message: '请填写你的学校!',whitespace:true
            }],
            })(
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
            }],
            })(
            <Input />
            )}
            </FormItem>
            <FormItem
             {...formItemLayout}
             label="电话"
            >
            {getFieldDecorator('电话', {
            rules: [{
              required: true, message: '请填写电话号码!',whitespace:true
            }],
            })(
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
            }],
            })(
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
            }],
            })(
            <Input />
            )}
            </FormItem>
            <FormItem
             {...formItemLayout}
             label="验证码"
            >
            {getFieldDecorator('验证码', {
            rules: [{
              whitespace:true,required: true, message: '请输入验证码!',
            }],
            })(
            <div>
            <Input />
            <img src={codeurl} alt="图片验证码" />  
            </div>          
            )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">注册</Button>
            </FormItem>
         </Form>
       </Modal>
      </div>
    )
  }
}
const WrappedRegister = Form.create()(Register);
const WrappedLogin=Form.create()(Login);

class OneWeekSchedule extends Component{
  constructor(props){
    super(props);
    this.state={
      visible:false,
      isSearch:false,
      listRow:[],//存有所有志愿者在最近一周之内排班的数据(之前3天加未来4天) 
    }
  }

  showModal=()=>{
    this.setState({visible:true});
    var that=this;
    var getSchedule=axios.create({
        url:"http://39.107.99.27:8080/dazhong/schedule?start="+moment().subtract(3,"days").valueOf()+"&end="+moment().add(4,"days").valueOf(),
        headers:{"content-type":"application/json"},
        method:'get',
        timeout:1000,
        withCredentials:true,
    })
     getSchedule().then(function(response){
      var dataRow=[];//排班列表
      for(var i=0;i<response.data.content.length;i++){
          for(var j=0;j<response.data.content.length-i-1;j++){
              if(moment(response.data.content[j].scheduleTime).isAfter(response.data.content[j+1].scheduleTime)){
                  var temp=response.data.content[j];
                  response.data.content[j]=response.data.content[j+1];
                  response.data.content[j+1]=temp;
              }
          }
      }
      for(var i=0;i<response.data.content.length;i++){
          dataRow.push(
              {
               checkin:response.data.content[i].isCheckIn?"已签到":"未签到",
               time:response.data.content[i].scheduleTime,
               name:response.data.content[i].name,
               scheduleId:response.data.content[i]["id"],
              }
          )
      }
        that.setState({listRow:dataRow});      
    })
    .catch(function(error){
      console.log(error);
    })
  }

  handleCancel=()=>{
    this.setState({visible:false});
  }

  render(){
    return(
      <div>
        <div className="oneweek">
        <Button size="large" onClick={this.showModal}>查看最近一周的排班表</Button>
        </div>
        <Modal
         title="查看最近一周的排班表"
         visible={this.state.visible}
         footer={null}
         maskClosable={false}
         onCancel={this.handleCancel}
         destroyOnClose={true}
         width={900}
        > 
          <List
              bordered
              itemLayout="vertical"
              dataSource={this.state.listRow}
              renderItem={item => (
                <List.Item
                key={item.title}
                extra={item.checkin=="未签到"?<Tag color="red">未签到</Tag>:<Tag color="green">已签到</Tag>}
                >
              <span className="schedule2">
              <span style={{marginRight:"1em"}}>{item.time+" -- "+moment(item.time).add(2,"hours").add(30,"minutes").format("HH:mm:ss")}</span>
              {item["name"]}
              </span>
               </List.Item>
              )}
              size="large"
            />
        </Modal>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
     <div style={{backgroundColor:"#CCF5FF"}}>
       <br/><br/><br/><br/><br/><br/><br/><br/><br/>
       <Row>
       <Col span={24}>
       <div className="indextitle">
         大钟寺古钟博物馆志愿者排班系统
       </div>
       </Col>
       </Row>
       <br/><br/><br/><br/>
       <Row gutter={16}>
        <Col xs={24} sm={{span:2,offset:8}}>
          <WrappedLogin/>
        </Col>
        <Col xs={24} sm={{span:2,offset:3}}>
          <WrappedRegister/>
        </Col>
       </Row>
       <br/><br/><br/><br/>
       <Col xs={24} sm={{span:1,offset:10}}>
          <OneWeekSchedule/>
       </Col>
       <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
     </div>
    );
  }
}

export default App;
