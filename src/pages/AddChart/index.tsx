import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, {  useState } from 'react';
import {genChartByAiUsingPost, } from "@/services/swagger/chartController";
import {UploadOutlined} from "@ant-design/icons";
import ReactECharts from 'echarts-for-react';

const AddChart: React.FC = () => {
  // 返回的分析结果
const [chart,setChart] = useState<API.BiResponse>();
  // 返回的图表代码 option
const[option, setOption] = useState<any>();
  // 用来判断用户是否提交了请求
const[submitting, setSubmitting] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    setOption(undefined);
    setChart(undefined);
    // 如果已经是提交中的状态，直接返回，避免重复提交
    if(submitting){
      return;
    }
    setSubmitting(true);
    // 第一个参数需要一个完整对象
    const params = {
      ...values,
      file:undefined
    }
    // 将请求发送包裹在一个 try - catch 块中，当请求发生异常时，给用户一个默认的响应
    try{
      // 发送请求
      const res = await
        genChartByAiUsingPost(params,{},values.file.file.originFileObj);
      if(!res?.data){
        message.error("分析失败");
      }else{
        message.success("分析成功");
        // 将返回的 genChart 转成 JSON 类型
        const chartOption = JSON.parse(res.data.genChart ?? '');
        // 如果为空，则抛出异常，并提示:"图表代码解析错误"
        if(!chartOption){
          throw new Error("图表代码解析错误");
        }else{
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any){
      message.error("分析失败:" + e.message);
    }
    setSubmitting(false);
  }

  return (
    // 把页面内容指定一个类名add-chart
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title={"智能分析"}>
            <Form
              // 表单名称改为addChart
              name="addChart"
              labelAlign={"left"}
              wrapperCol={{span: 16}}
              onFinish={onFinish}
              // 初始化数据啥都不填，为空
              initialValues={{  }}
            >
              <Form.Item name="goal" label="分析目标"  rules={[{ required: true, message: '分析需求不许为空' }]}>
                <TextArea placeholder={"请输入你的分析需求，比如：分析网站用户的增长情况"}/>
              </Form.Item>
              <Form.Item
                name="name"
                label="图表名称">
                <Input placeholder="请输入图表名称"/>
              </Form.Item>

              <Form.Item
                name="chartType"
                label="图表类型"
              >
                <Select
                  options ={[
                    { value: '折线图', label: '折线图' },
                    { value: '柱状图', label: '柱状图' },
                    { value: '堆叠图', label: '堆叠图' },
                    { value: '饼图', label: '饼图' },
                    { value: '雷达图', label: '雷达图' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                name="file"
                label="原始数据"
              >
                <Upload name="file">
                  <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
                </Upload>
              </Form.Item>


              <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        {/* 分析结论和图表放在第二列 */}
        <Col span={12}>
          <Card title="分析结论">
            {/* 如果分析结论存在，就展示分析结论；
                不存在则显示'请先在左侧进行提交' */}
            {chart?.genResult ?? <div>请先在左侧进行提交</div>}
            {/* 提交中，还未返回结果，分析结论就显示加载中的组件 */}
            <Spin spinning={submitting}/>
          </Card>
          {/* 加一个间距 */}
          <Divider />
          <Card title="可视化图表">
            {/* 如果它存在，才渲染这个组件 */}
            {
              // 后端返回的代码是字符串，不是对象，用JSON.parse解析成对象
              option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交</div>
            }
            {/* 提交中，还未返回结果，图表就显示加载中的组件 */}
            <Spin spinning={submitting}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
