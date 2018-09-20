import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,Tag,message,Form,InputNumber,Input,Modal} from 'antd';
import axios from 'axios';
import moment from 'moment';
import {_} from 'underscore';
const FormItem = Form.Item;

class CheckInTag extends React.Component{
    constructor(props){
        super(props);
        this.state={
            content:this.props.isCheckIn?"已签到":"未签到",
            color:this.props.isCheckIn?"green":"red",
        }
    }

    handleCheckin=()=>{
        var checkin=axios.create({
            url:"http://39.107.99.27:8080/dazhong/checkIn",
            headers:{"content-type":"application/json"},
            method:'post',
            data:{scheduleId:this.props.scheduleId},
            timeout:1000,
            withCredentials:true,
        });
        checkin().then(function(response){
            if(response.data.result===1000)message.success(response.data.resultDesp,3);
            else if(response.data.result===4007)message.error(response.data.resultDesp,3);
        })
        .catch(function(error){
           console.log(error);
           message.error("签到失败",3);
        })
        this.setState({content:"已签到",color:"green"});
    }

    render(){
        return(
            <div>
             <span style={{ marginLeft:"1.25em",marginRight:"1.25em",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
             {this.props.text}
             </span>
             <Tag color={this.state.color} style={{marginRight:"1.25em"}}>{this.state.content}</Tag>
             <Button onClick={this.handleCheckin} disabled={this.state.content=="未签到"?false:true}>签到</Button>
            </div>
        )
    }
}


class Checkin extends React.Component{
    constructor(props){
        super(props);
        this.state={
            checkInRow:[],//存有今日签到的数组列表，每一个元素均为CheckInTag
            visible:false,
        }
    }

    showModal=()=>{
        this.setState({visible:true});
    }

    handleCancel=()=>{
        this.setState({visible:false});
    }

    componentDidMount(){
        var that=this;
        var getSchedule=axios.create({
            url:"http://39.107.99.27:8080/dazhong/schedule?name="+localStorage.getItem("name")+"&start="+moment().valueOf()+"&end="+moment().add(1,"days").valueOf(),
            headers:{"content-type":"application/json"},
            method:'get',
            timeout:1000,
            withCredentials:true,
        })
        getSchedule().then(function(response){
            var checkInRow2=[];
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
                checkInRow2.push(
                    <CheckInTag key={i} text={response.data.content[i].scheduleTime} isCheckIn={response.data.content[i].isCheckIn} scheduleId={response.data.content[i]["id"]}/>
                )
            }
            that.setState({checkInRow:checkInRow2});
        })
        .catch(function(error){
            console.log(error);
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
            <p style={{fontSize:"20px"}}>除了密码必须填之外，其他信息可以有选择性的填</p>
        )
        return(
            <div>
              <Row>
                <Col xs={24} sm={{span:6,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   姓名
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user["name"]!==""?this.props.user["name"]:"null"}
                   </span>
                   </div>
                </Col>
                <Col xs={24} sm={6}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   身份证号
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.idNumber!==""?this.props.user.idNumber:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:6,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   年龄
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.age!==""?this.props.user.age:"null"}
                   </span>
                   </div>
                </Col>
                <Col xs={24} sm={6}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   电话
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.tel!==""?this.props.user.tel:"null"}
                   </span>
                   </div>
                </Col>
                <Col xs={24} sm={{span:4,offset:2}}>
                  <Button type="primary" onClick={this.showModal}>修改用户信息</Button>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:6,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   地址
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.address!==""?this.props.user.address:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:12,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   备注
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.note!==""?this.props.user.note:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:12,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   今日签到(显示距离当前时间最近的一个排班):
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:12,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   {_.first(this.state.checkInRow)}
                   </div>
                </Col>
              </Row>
              <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
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
                   label="用户名"
                >
                 {getFieldDecorator('用户名', {
                  rules: [{
                    whitespace:true
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
                    whitespace:true
                  }],
                  })(
                     <Input />
                 )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                   label="密码"
                >
                 {getFieldDecorator('密码', {
                  rules: [{
                    required: true, message: '请输入你的密码!',whitespace:true
                  }],
                  })(
                     <Input />
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
                <FormItem
                 wrapperCol={{
                   xs: { span: 24, offset: 0 },
                   sm: { span: 16, offset: 8 },
                 }}
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

const WrappedCheckin = Form.create()(Checkin);

export default WrappedCheckin;