import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Button,message} from 'antd';
import axios from 'axios';
var re=/^\?scheduleId=(\d*)\&name=(.*)$/;
class DeleteCheckIn extends React.Component{
    componentDidMount(){
        var getCheckInId=axios.create({
            url:"http://39.107.99.27:8080/dazhong/checkIn?scheduleId="+re.exec(window.location.search)[1],
            headers:{"content-type":"application/json"},
            method:'get',
            timeout:1000,
            withCredentials:true,
        })
        getCheckInId().then(function(response1){
            
            console.log(response1);
        })
        .catch(function(error1){
            console.log(error1);
            message.error("删除签到失败",3);
        })
    }
    render(){
        return(
            <div/>
        )
    }
}

export default DeleteCheckIn;