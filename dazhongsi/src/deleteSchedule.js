import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Button,message,Col} from 'antd';
import axios from 'axios';
import {Redirect}from 'react-router-dom';
var re=/^\?scheduleId=(\d*)$/;

class DeleteSchedule extends React.Component{
    constructor(props){
        super(props);
        this.state={
            redirect:false,
        }
    }

    componentDidMount(){
        var deleteSchedule=axios.create({
            url:"http://39.107.99.27:8080/dazhong/schedule?scheduleId="+re.exec(window.location.search)[1],
            headers:{"content-type":"application/json"},
            method:'delete',
            timeout:1000,
            withCredentials:true,
        })
        deleteSchedule().then(function(response){
            if(response.data.result===1000) message.success(response.data.resultDesp,3);
            else message.error("删除排版失败",3);
        })
        .catch(function(error){
            console.log(error);
            message.error("删除排班失败",3);
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
            <Button type="primary" onClick={this.handleRedirect} size="large">点击返回</Button>
            </Col>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <br/><br/><br/><br/><br/><br/>
            </div>
        )
    }
}

export default DeleteSchedule;