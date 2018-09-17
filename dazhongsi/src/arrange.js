import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,List,Tag,message,Modal,Form,DatePicker,Input} from 'antd';
import axios from 'axios';
import moment from 'moment';
const FormItem = Form.Item;

function disabledDate(current) {
  // Can not select days before today
  return current&&current < moment().endOf('day').subtract(1,"days");
}

class AddSchedule extends React.Component{
  constructor(props){
    super(props);
    this.state={
      visible:false,
    }
  }

  showModal=()=>{
    this.setState({visible:true});
  }

  handleCancel=()=>{
    this.setState({visible:false});
  }

  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(["志愿者姓名","排班时间"],(err,values)=>{
      if(!err){
        var urls="http://39.107.99.27:8080/dazhong/user-id?name="+values.志愿者姓名;
        var that=this;
        var getUserIdByName=axios.create({
          url:urls,
          headers:{"content-type":"application/json"},
          method:'get',
          timeout:1000,
          withCredentials:true,
        })
        getUserIdByName().then(function(response1){
          if(response1.data.content==null)message.error("您添加的志愿者不存在",3);
          else{
          var addSchedule=axios.create({
            url:"http://39.107.99.27:8080/dazhong/schedule",
            headers:{"content-type":"application/json"},
            method:'post',
            data:{scheduleTime:values.排班时间.format("YYYY-MM-DD HH:mm:ss"),userId:response1.data.content},
            timeout:1000,
            withCredentials:true,
          })
          addSchedule().then(function(response2){
            if(response2.data.result===1000){
              message.success(response2.data.resultDesp,3);
              that.setState({visible:false});
            }
            else if(response2.data.result===4006)message.error(response2.data.resultDesp,3);
          })
          .catch(function(error2){
            console.log(error2);
            message.error("添加排班失败",3);
          })
         }
        })
        .catch(function(error2){
          console.log(error2);
          message.error("添加排班失败",3);
        })
      }
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
      const config = {
        rules: [{ type: 'object', required: true, message: '请选择时间!' }],
      };
      return(
        <div>
        <Row>
        <Col xs={24} sm={{span:12,offset:10}}>
          <Button type="primary" style={{width:"200px",height:"80px"}} onClick={this.showModal}>
          <span style={{fontSize:"30px",letterSpacing:"5px"}}>
          添加排班
          </span>
          </Button>
        </Col>
        </Row>
        <Modal
          title="添加排班"
          visible={this.state.visible}
          footer={null}
          onCancel={this.handleCancel}
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
         {getFieldDecorator('排班时间', config)(
           <DatePicker
             format="YYYY-MM-DD HH:mm:ss"
             disabledDate={disabledDate}
             showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
           />
         )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">添加</Button>
        </FormItem>
        </Form> 
        </Modal>
        </div>
      )
    }
}

const WrappedAddSchedule = Form.create()(AddSchedule);

class Arrange extends React.Component{
    constructor(props){
      super(props);
      this.state={
        visible1:false,
        visible2:false,
      }
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
               <WrappedAddSchedule/>
               <br/><br/><br/>            
            </div>
        )
    }
}

export default Arrange;