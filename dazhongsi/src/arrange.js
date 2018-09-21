import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import {Row,Col,Button,List,Tag,message,Modal,Form,DatePicker,Input} from 'antd';
import {Link}from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {_} from 'underscore';
const FormItem = Form.Item;
const Search=Input.Search;

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
              that.props.handleAction();
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

    componentWillReceiveProps(nextProps){
      if(nextProps.isAction){
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
        this.props.handleEndAction();       
      }
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
                  {item.content}
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
                  {item.content}
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

class ManageSchedule extends React.Component{
  constructor(props){
     super(props);
     this.state={
       visible:false,
       listRow:[],//存有所有志愿者在最近两个月之内排班的数据(之前一个月加未来一个月) 
       isSearch:false,//是否在搜索框搜索了志愿者姓名
       volunteerName:""//搜索的志愿者的姓名
     }
  }

  showModal=()=>{
    this.setState({visible:true});
  }

  handleCancel=()=>{
    this.setState({visible:false,isSearch:false});
  }

  componentDidMount(){
    var that=this;
    var getSchedule=axios.create({
        url:"http://39.107.99.27:8080/dazhong/schedule?start="+moment().subtract(1,"months").valueOf()+"&end="+moment().add(1,"months").valueOf(),
        headers:{"content-type":"application/json"},
        method:'get',
        timeout:1000,
        withCredentials:true,
    })
    getSchedule().then(function(response){
        var dataRow=[];
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
            dataRow.push(
                {
                 checkin:response.data.content[i].isCheckIn?"已签到":"未签到",
                 time:response.data.content[i].scheduleTime,
                 name:response.data.content[i].name,
                 scheduleId:response.data.content[i]["id"],
                }
            )
        }
        that.setState({listRow:dataRow});
    })
    .catch(function(error){
        console.log(error);
    })   
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isAction){
      var that=this;
      var getSchedule=axios.create({
          url:"http://39.107.99.27:8080/dazhong/schedule?start="+moment().subtract(1,"months").valueOf()+"&end="+moment().add(1,"months").valueOf(),
          headers:{"content-type":"application/json"},
          method:'get',
          timeout:1000,
          withCredentials:true,
      })
      getSchedule().then(function(response){
          var dataRow=[];
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
              dataRow.push(
                {
                 checkin:response.data.content[i].isCheckIn?"已签到":"未签到",
                 time:response.data.content[i].scheduleTime,
                 name:response.data.content[i].name,
                 scheduleId:response.data.content[i]["id"],
                }
              )
          }
          that.setState({listRow:dataRow});
      })
      .catch(function(error){
          console.log(error);
      })
      this.props.handleEndAction();    
    }
  }

  handleSearch=(value,event)=>{
    this.setState({volunteerName:value,isSearch:true});
  }

  render(){
    var that=this;
    return(
      <div>
        <Row>
          <Col xs={24} sm={{span:12,offset:6}}>
            <div style={{fontSize:"16px",marginTop:"30px",position:"relative"}}>
            排班表管理
            <List
              bordered
              itemLayout="vertical"
              dataSource={_.first(this.state.listRow,4)}
              renderItem={item => (
                <List.Item
                key={item.title}
                extra={item.checkin=="未签到"?<Tag color="red">未签到</Tag>:<Tag color="green">已签到</Tag>}
                actions={[
                  <span>{item.checkin=="已签到"?
                  <span style={{marginLeft:"1em",marginRight:"1em"}}>
                  <Link to={"/admin/deleteCheckIn?scheduleId="+item.scheduleId+"&name="+item.name}>删除签到记录</Link>
                  </span>
                  :
                  <span style={{marginLeft:"1em",marginRight:"1em"}}/>}</span>,
                  <Link to={"/admin/deleteSchedule?scheduleId="+item.scheduleId}>删除排班</Link>
                ]}
                >
              <span style={{fontSize:"1.5em"}}>
              <span style={{marginRight:"1em"}}>{item.time}</span>
              {item["name"]}
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
            <Button type="primary" onClick={this.showModal}>管理最近两个月的排班表</Button>
          </Col>
        </Row>
        <Modal
         title="管理最近两个月的排班表"
         visible={this.state.visible}
         footer={null}
         maskClosable={false}
         onCancel={this.handleCancel}
         width={900}
        > 
          <Row>
            <Col xs={24} sm={8}>
            <Search
                placeholder="搜索志愿者姓名,查询排班表"
                enterButton
                size="large"
                onSearch={this.handleSearch}
             />
            </Col>
          </Row>
          <br/><br/>
            <List
              bordered
              itemLayout="vertical"
              dataSource={this.state.isSearch?_.filter(that.state.listRow,function(list){ return list["name"]===that.state.volunteerName}):this.state.listRow}
              renderItem={item => (
                <List.Item
                key={item.title}
                extra={item.checkin=="未签到"?<Tag color="red">未签到</Tag>:<Tag color="green">已签到</Tag>}
                actions={[
                  <span>{item.checkin=="已签到"?
                  <span style={{marginLeft:"1em",marginRight:"1em"}}>
                  <Link to={"/admin/deleteCheckIn?scheduleId="+item.scheduleId+"&name="+item.name}>删除签到记录</Link>
                  </span>
                  :
                  <span style={{marginLeft:"1em",marginRight:"1em"}}/>}</span>,
                  <Link to={"/admin/deleteSchedule?scheduleId="+item.scheduleId}>删除排班</Link>
                ]}
                >
              <span style={{fontSize:"1.5em"}}>
              <span style={{marginRight:"1em"}}>{item.time}</span>
              {item["name"]}
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

class Arrange extends React.Component{
  constructor(props){
    super(props);
    this.state={
      isAction:false,//是否执行了添加排班、删除排班、删除签到的操作
    }
  }

  handleAction=()=>{
    this.setState({isAction:true});
  }

  handleEndAction=()=>{
    this.setState({isAction:false});
  }

    render(){
        return(
            <div>
               <InquireSelfCheckIn isAction={this.state.isAction} handleAction={this.handleAction} handleEndAction={this.handleEndAction}/>
               <br/><br/>
               <ManageSchedule isAction={this.state.isAction} handleAction={this.handleAction} handleEndAction={this.handleEndAction}/>
               <br/><br/><br/>
               <WrappedAddSchedule handleAction={this.handleAction}/>
               <br/><br/><br/>            
            </div>
        )
    }
}

export default Arrange;