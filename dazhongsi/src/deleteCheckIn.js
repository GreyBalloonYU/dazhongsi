import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Button,message,Col} from 'antd';
import axios from 'axios';
import {Redirect}from 'react-router-dom';
var re=/^\?scheduleId=(\d*)\&name=(.*)$/;

class DeleteCheckIn extends React.Component{
    constructor(props){
        super(props);
        this.state={
            redirect:false,
        }
    }

    componentDidMount(){
        var getCheckInId=axios.create({
            url:"http://39.107.99.27:8080/dazhong/checkIn?scheduleId="+re.exec(window.location.search)[1],
            headers:{"content-type":"application/json"},
            method:'get',
            timeout:1000,
            withCredentials:true,
        })
        getCheckInId().then(function(response1){
            if(response1.data.result===1000){
                var deleteCheckin=axios.create({
                    url:"http://39.107.99.27:8080/dazhong/checkIn?id="+response1.data.content[0]["id"],
                    headers:{"content-type":"application/json"},
                    method:'delete',
                    timeout:1000,
                    withCredentials:true,
                })
                deleteCheckin().then(function(response2){
                    if(response2.data.result===1000) message.success(response2.data.resultDesp,3);
                    else if(response2.data.result===4005) message.error(response2.data.resultDesp,3);
                })
                .catch(function(error2){
                    console.log(error2);
                    message.error("删除签到失败",3);                  
                })
            }
            else if(response1.data.result===4004){
                message.error(response1.data.resultDesp,3);
            }
        })
        .catch(function(error1){
            console.log(error1);
            message.error("删除签到失败",3);
        })
    }

    handleRedirect=()=>{
       this.setState({redirect:true});
    }

    render(){
        if(this.state.redirect)return <Redirect exact push to='/admin/arrange'/>;
        return(
            <div>
            <br/><br/><br/><br/><br/><br/>
            <Col xs={24} sm={{span:1,offset:11}}>
            <Button className="back" type="primary" onClick={this.handleRedirect} size="large">点击返回</Button>
            </Col>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/>
            </div>
        )
    }
}

export default DeleteCheckIn;