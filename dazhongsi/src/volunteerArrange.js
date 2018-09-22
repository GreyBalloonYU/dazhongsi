import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,List,Tag,message,Modal} from 'antd';
import {Link}from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {_} from 'underscore';

class InquireSelfCheckIn extends React.Component{
    constructor(props){
      super(props);
      this.state={
        visible:false,
        dataRow:[],//存有本人未来一周之内签到的数据
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
          url:"http://39.107.99.27:8080/dazhong/schedule?name="+localStorage.getItem("name")+"&start="+moment().valueOf()+"&end="+moment().add(7,"days").valueOf(),
          headers:{"content-type":"application/json"},
          method:'get',
          timeout:1000,
          withCredentials:true,
      })
      getSchedule().then(function(response){
          var dataRow2=[];
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
              dataRow2.push(
                  {checkin:response.data.content[i].isCheckIn?"已签到":"未签到",content:response.data.content[i].scheduleTime}
              )
          }
          that.setState({dataRow:dataRow2});
      })
      .catch(function(error){
          console.log(error);
      })     
    }

    render(){
      return(
        <div>
          <Row>
            <Col xs={24} sm={{span:12,offset:6}}>
              <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
              我的排班表
              <List
                bordered
                itemLayout="vertical"
                dataSource={_.first(this.state.dataRow,3)}
                renderItem={item => (
                  <List.Item
                   key={item.title}
                   extra={item.checkin=="未签到"?<Tag color="red">未签到</Tag>:<Tag color="green">已签到</Tag>}
                  >
                  <span style={{fontSize:"1.5em"}}>
                  {item.content+" -- "+moment(item.content).add(2,"hours").add(30,"minutes").format("HH:mm:ss")}
                  </span>
                  </List.Item>                
                )}
                size="large"
              />
              </div>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col xs={24} sm={{span:12,offset:6}}>
              <Button type="primary" onClick={this.showModal}>查询未来一周的排班</Button>
            </Col>
          </Row>
          <Modal
           title="我未来一周的排班表"
           visible={this.state.visible}
           footer={null}
           maskClosable={false}
           onCancel={this.handleCancel}
          > 
              <List
                bordered
                itemLayout="vertical"
                dataSource={this.state.dataRow}
                renderItem={item => (
                  <List.Item
                   key={item.title}
                   extra={item.checkin=="未签到"?<Tag color="red">未签到</Tag>:<Tag color="green">已签到</Tag>}
                  >
                  <span style={{fontSize:"1.5em"}}>
                  {item.content+" -- "+moment(item.content).add(2,"hours").add(30,"minutes").format("HH:mm:ss")}
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

class VolunteerArrange extends React.Component{
      render(){
          return(
              <div>
                 <InquireSelfCheckIn/>
                 <br/><br/>   
              </div>
          )
      }
}

export default VolunteerArrange;