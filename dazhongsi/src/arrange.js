import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,List,Tag} from 'antd';

class Arrange extends React.Component{
    render(){
        const data=[
            '2018.9.10 17 : 00 - 19 : 30',
            '2018.9.12 17 : 00 - 19 : 30',
            '2018.9.15 13 : 00 - 15 : 00',
        ];
        const data1=[];
        for(var i=0;i<4;i++){
          data1.push({
             content:"2018.9.10 17 : 00 -19 : 30     李四",
             checkin:"未签到",
             key:i
          })
        }
        return(
            <div>
               <Row>
                 <Col xs={24} sm={{span:12,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   我的排班表
                   <List
                      bordered
                      dataSource={data}
                      renderItem={item => (
                        <List.Item>
                        {item}
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
                   <Button type="primary">查询未来一周的排班</Button>
                 </Col>
               </Row> 
               <br/><br/>
               <Row>
                 <Col xs={24} sm={{span:12,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   排班表管理
                   <List
                      bordered
                      itemLayout="vertical"
                      dataSource={data1}
                      renderItem={item => (
                      <List.Item
                         key={item.title}
                         extra={item.checkin=="未签到"?<Tag color="red">未签到</Tag>:<Tag color="green">已签到</Tag>}
                      >
                      {item.content}
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
                   <Button type="primary">查询过去的排班表</Button>
                 </Col>
               </Row>
               <br/><br/><br/>
               <Row>
                 <Col xs={24} sm={{span:12,offset:10}}>
                   <Button type="primary" style={{width:"200px",height:"80px"}}>
                   <span style={{fontSize:"30px",letterSpacing:"5px"}}>
                   添加排班
                   </span>
                   </Button>
                 </Col>
               </Row>
               <br/><br/><br/>
            </div>
        )
    }
}
export default Arrange;