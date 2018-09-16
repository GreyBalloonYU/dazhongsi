import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,List,Tag,message,Modal,Form,DatePicker,Input} from 'antd';
import axios from 'axios';
import moment from 'moment';
const FormItem = Form.Item;

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf('day');
}

class Arrange extends React.Component{
    constructor(props){
      super(props);
      this.state={
        visible1:false,
        visible2:false,
        visible3:false,
      }
    }

    showModal3=()=>{
      this.setState({visible3:true});
    }

    handleCancel3=()=>{
      this.setState({visible3:false});
    }

    handleSubmit=(e)=>{
      e.preventDefault();
      this.props.form.validateFieldsAndScroll(["志愿者姓名","排班时间"],(err,values)=>{
        if(!err){
           console.log(values);
           this.setState({visible3:false});
        }
      })
    }

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
        const dateConfig = {
          rules: [{ type: 'object', required: true, message: '请选择时间!' }],
        };
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
                   <Button type="primary" style={{width:"200px",height:"80px"}} onClick={this.showModal3}>
                   <span style={{fontSize:"30px",letterSpacing:"5px"}}>
                   添加排班
                   </span>
                   </Button>
                 </Col>
               </Row>
               <Modal
                 title="添加排班"
                 visible={this.state.visible3}
                 footer={null}
                 onCancel={this.handleCancel3}
                 destroyOnClose={true}
               >
                <Form onSubmit={this.handleSubmit}>
                  <FormItem
                    {...formItemLayout}
                    label="志愿者姓名"
                  >
                  {getFieldDecorator('志愿者姓名', {
                    rules: [{
                     required: true, message: '请输入志愿者姓名!',whitespace:true
                   }],
                   })(
                   <Input />
                  )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="排班时间"
                  >
                   {getFieldDecorator('开课时间', dateConfig)(
                    <DatePicker disabledDate={disabledDate}/>
                   )}
                  </FormItem>
                  <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">添加</Button>
                  </FormItem>
               </Form> 
               </Modal>
               <br/><br/><br/>            
            </div>
        )
    }
}
const WrappedArrange = Form.create()(Arrange);
export default WrappedArrange;