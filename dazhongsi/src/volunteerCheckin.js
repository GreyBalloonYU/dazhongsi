import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,Tag,message,Form,InputNumber,Input,Modal} from 'antd';
import axios from 'axios';
import moment from 'moment';
import {_} from 'underscore';
const FormItem = Form.Item;
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 

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
             <span className="checkInBorder" style={{ marginLeft:"1.25em",marginRight:"1.25em",borderStyle:"solid",borderWidth:"thin",borderColor:"#AAAAAA"}}>
             {this.props.text+" -- "+this.props.nextText}
             </span>
             <span className="checkInTag">
             <Tag color={this.state.color} style={{marginRight:"1.25em"}}>{this.state.content}</Tag>
             <Button onClick={this.handleCheckin} disabled={this.state.content=="未签到"?false:true}>签到</Button>
             </span>
            </div>
        )
    }
}

  class VolunteerCheckin extends React.Component{
    constructor(props){
        super(props);
        this.state={
            checkInRow:[],//存有今日签到的数组列表，每一个元素均为CheckInTag
            visible:false,
        }
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
                  <CheckInTag key={i} 
                  text={response.data.content[i].scheduleTime} 
                  nextText={moment(response.data.content[i].scheduleTime).add(2,"hours").add(30,"minutes").format("HH:mm:ss")}
                  isCheckIn={response.data.content[i].isCheckIn} 
                  scheduleId={response.data.content[i]["id"]}
                  />
                )
            }
            that.setState({checkInRow:checkInRow2});
        })
        .catch(function(error){
            console.log(error);
        })
    }

    render(){
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
                   小组
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.group!==""?this.props.user.group:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:6,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   学校
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.school!==""?this.props.user.school:"null"}
                   </span>
                   </div>
                </Col>
                <Col xs={24} sm={6}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   岗位
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.post!==""?this.props.user.post:"null"}
                   </span>
                   </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={{span:6,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   电话
                   <span style={{ marginLeft:"20px",borderStyle:"solid",borderWidth:"thin",paddingLeft:30,paddingRight:30,borderColor:"#AAAAAA"}}>
                   {this.props.user.tel!==""?this.props.user.tel:"null"}
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
                   <div className="checkIn">
                   {_.first(this.state.checkInRow)}
                   </div>
                </Col>
              </Row>
              <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>
        )
    }
}

export default VolunteerCheckin;