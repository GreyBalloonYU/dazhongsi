import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,Tag} from 'antd';

class CheckInTag extends React.Component{
    constructor(props){
        super(props);
        this.state={
            content:this.props.isCheckIn?"已签到":"未签到",
            color:this.props.isCheckIn?"green":"red",
        }
    }

    handleCheckin=()=>{
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
    componentDidMount(){
    //    var getSchedule=axios.create({
    //        url:"http://39.107.99.27:8080/dazhong/user/name?name="+localStorage.getItem("name"),
    //        headers:{"content-type":"application/json"},
    //        method:'get',
    //        timeout:1000,
    //        withCredentials:true,
     //   })
    }

    render(){
        console.log(this.props.user)
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
                  <Button type="primary">修改用户信息</Button>
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
                   今日签到
                   <CheckInTag text="今天14 : 30至16 : 30" isCheckIn={1}/>
                   <CheckInTag text="今天13 : 30至14 : 30" isCheckIn={0}/>
                   <CheckInTag text="今天7 : 30至9 : 30" isCheckIn={1}/>
                   <CheckInTag text="今天6 : 30至7 : 30" isCheckIn={0}/>
                   </div>
                </Col>
              </Row>
              <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            </div>
        )
    }
}
export default Checkin;