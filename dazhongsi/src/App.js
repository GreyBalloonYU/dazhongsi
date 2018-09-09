import React, { Component } from 'react';
import './App.css';
import {Row,Col,Button,Modal,Form,Radio,Input,InputNumber,message} from 'antd';
import {Redirect}from 'react-router-dom';
import axios from 'axios';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
var User={username:'',password:'',name:'',gender:'',age:0,idNumber:'',tel:'',address:'',note:''};
var Userlogin={username:'',password:''};
var enrollUser=axios.create({
  url:"http://39.107.99.27:8080/dazhong/account/",
  headers:{"content-type":"application/json"},
  method:'post',
  data:User,
  timeout:1000,
});
var loginUser=axios.create({
  url:"http://39.107.99.27:8080/dazhong/account/",
  headers:{"content-type":"application/json"},
  method:'get',
  data:Userlogin,
  timeout:1000,  
})
class Login extends React.Component{
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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Userlogin.username=values.用户名;
        Userlogin.password=values.密码;
        console.log(Userlogin);
        var that=this;
        loginUser().then(function(response){
          if(response.result===1000){
            that.setState({visible:false});
            message.success(response.resultDesp,3);
          }
          else if(response.result===4001){
            message.error(response.resultDesp,3);
          }
          console.log(response);
        })
        .catch(function(error){
          message.error('登录失败!',3);
          console.log(error);
        });
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
          <Button type="primary" style={{width:"9.375em",height:"3.125em"}} onClick={this.showModal}>登录</Button>
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

  showModal=()=>{
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
        User.age=values.年龄;
        User.idNumber=values.身份证号;
        User.tel=values.电话;
        User.address=values.地址;
        User.note=values.备注;
        if(typeof(User.age)=="undefined"||User.age===0){
          delete User.age;
        }
        if(typeof(User.idNumber)=="undefined"||User.idNumber==''){
          delete User.idNumber;
        }
        if(typeof(User.tel)=="undefined"||User.tel==''){
          delete User.tel;
        }
        if(typeof(User.address)=="undefined"||User.address==''){
          delete User.address;
        }
        if(typeof(User.note)=="undefined"||User.note==''){
          delete User.note;
        }
        console.log(User);
        var that=this;
        enrollUser().then(function(response){
          if(response.result===1000){
            that.setState({visible:false});
            message.success(response.resultDesp,3);
          }
          else if(response.result===4002){
            message.error(response.resultDesp,3);
          }
          console.log(response);
        })
        .catch(function(error){
          message.error('用户创建失败!',3);
          console.log(error);
        });
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
      <Button type="primary" style={{width:"9.375em",height:"3.125em"}} onClick={this.showModal}>注册</Button>
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
             label="年龄"
            >
            {getFieldDecorator('年龄', {
            rules: [{
              whitespace:true,type:"number"
            }],
            })(
            <InputNumber min={1} max={99}/>
            )}
            </FormItem>
            <FormItem
             {...formItemLayout}
             label="身份证号"
            >
            {getFieldDecorator('身份证号', {
            rules: [{
              whitespace:true
            }, {
              validator: this.checkidNumber,
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
              whitespace:true
            }],
            })(
            <Input />
            )}
            </FormItem>
            <FormItem
             {...formItemLayout}
             label="地址"
            >
            {getFieldDecorator('地址', {
            rules: [{
              whitespace:true
            }],
            })(
            <Input />
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

class App extends Component {
  render() {
    return (
     <div>
       <br/><br/><br/><br/><br/><br/><br/><br/><br/>
       <Row>
       <Col xs={24} sm={{span:12,offset:8}}>
       <span style={{fontSize:"3.5em"}}>
         大钟寺志愿者排班系统
       </span>
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
     </div>
    );
  }
}

export default App;
