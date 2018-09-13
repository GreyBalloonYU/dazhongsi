import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,List} from 'antd';

class Arrange extends React.Component{
    render(){
        const data=[
            '2018.9.10 17 : 00 - 19 : 30',
            '2018.9.12 17 : 00 - 19 : 30',
            '2018.9.15 13 : 00 - 15 : 00',
        ];
        return(
            <div>
               <Row>
                 <Col xs={24} sm={{span:12,offset:6}}>
                   <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
                   我的排班表
                   <List
                      bordered
                      dataSource={data}
                      renderItem={item => (<List.Item>{item}</List.Item>)}
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
            </div>
        )
    }
}
export default Arrange;