import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Typography,
  notification,
} from "antd";
import { Fragment, useEffect, useState } from "react";
import { useFormik } from "formik";

import { metasploitApi } from "../../apis/metaploitApi";

const { Text, Title } = Typography;

const Metasploit = () => {
  const [moduleInfo, setModuleInfo] = useState({});
  const [shellResult, setShellResult] = useState([]);
  const [command, setCommand] = useState("");
  const [showCommandControl, setShowCommandControl] = useState(false);

  const openNotification = ({ message, type, description }) => {
    if (type === "success") {
      notification.success({
        message: message,
        description: description,
        duration: 2,
      });
    }
    if (type === "error") {
      notification.error({
        message: message,
        description: description,
        duration: 2,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      rhost: "",
    },
    onSubmit: async (value) => {
      try {
        const res = await metasploitApi.createExploit(value.rhost);
        if (res.data.job_id) {
          openNotification({
            message: "Shell tấn công được tạo thành công!",
            type: "success",
          });
          setShowCommandControl(true);
        }
      } catch (error) {
        openNotification({ message: "Lỗi!" });
      }
    },
  });

  const handleChangeCommand = (e) => {
    setCommand(e.target.value);
  };

  const handleRetrieveInfor = async () => {
    try {
      const res = await metasploitApi.getInformations();
      setModuleInfo(res);
    } catch (error) {
      openNotification({ message: "Lỗi!" });
    }
  };

  const handleRequestCommand = async (command) => {
    try {
      if (command) {
        const res = await metasploitApi.sendCommand(command);
        if (res) {
          setShellResult(res);
        }
      }
    } catch (error) {
      openNotification({ message: "Lỗi!" });
    }
  };

  useEffect(() => {
    handleRetrieveInfor();
  }, []);

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text
          style={{
            fontSize: 35,
            fontWeight: 500,
            marginBottom: 0,
            paddingBotton: 5,
          }}
        >
          Thử nghiệm trang web kiểm thử trên nền tảng metasploit
        </Text>
        <Text type="secondary" style={{ fontSize: 20 }}>
          Thử nghiệm tấn công lỗ hổng MS17_010 trên hệ điều hành Windows
        </Text>
      </div>
      <div style={{ marginTop: 25 }}>
        <Card
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          }}
          title={<Text style={{ fontSize: 30 }}>Thông tin tấn công</Text>}
        >
          <div style={{ marginBottom: 20 }}>
            <Title level={3} style={{ marginTop: 0 }}>
              Module tấn công
            </Title>
            <Input
              style={{ maxWidth: 450 }}
              defaultValue="windows/smb/ms17_010_eternalblue"
              disabled
            />
          </div>
          <div>
            <Title level={3} style={{ marginTop: 0 }}>
              Thông tin về module
            </Title>
            <Text>{moduleInfo?.description}</Text>
            <Form
              colon={false}
              labelAlign={"right"}
              labelCol={{
                xs: { span: 12 },
                sm: { span: 6 },
              }}
              style={{ marginTop: 20 }}
              labelWrap
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Mục tiêu tấn công">
                    <Input
                      name="rhost"
                      size="large"
                      placeholder="Mục tiêu tấn công"
                      value={formik.values.rhost}
                      onChange={formik.handleChange}
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Cổng tấn công">
                    <Input
                      name="CongTanCong"
                      size="large"
                      placeholder="Cổng tấn công"
                      value={moduleInfo?.run_options?.RPORT}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Thời gian ngắt tấn công">
                    <Input
                      name="thoigianngat"
                      size="large"
                      placeholder="Thời gian ngắt tấn công"
                      value={moduleInfo?.run_options?.ConnectTimeout}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Giới hạn tấn công">
                    <Input
                      name="soluongtancong"
                      size="large"
                      placeholder="Giới hạn tấn công"
                      value={moduleInfo?.run_options?.MaxExploitAttempts}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phiên bản SSL">
                    <Input
                      name="phienbanssl"
                      size="large"
                      placeholder="Phiên bản SSL"
                      value={moduleInfo?.run_options?.SSLVersion}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Xác định mục tiêu">
                    <Input
                      name="xacdinhmuctieu"
                      size="large"
                      placeholder="Xác định mục tiêu"
                      value={moduleInfo?.run_options?.VERIFY_TARGET}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Tiến trình tấn công">
                    <Input
                      name="tientrinhtancong"
                      size="large"
                      placeholder="Tiến trình tấn công"
                      value={moduleInfo?.run_options?.ProcessName}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                size="large"
                onClick={formik.handleSubmit}
                style={{ float: "right" }}
              >
                Tạo tấn công
              </Button>
            </Form>
          </div>
        </Card>
        {showCommandControl ? (
          <div style={{ marginTop: 25 }}>
            <Card
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
              }}
              title={<Text style={{ fontSize: 30 }}>Khai thác tạo shell</Text>}
            >
              <div
                style={{
                  maxWidth: "100%",
                  backgroundColor: "black",
                  height: 400,
                  overflowY: "scroll",
                  overflowX: "scroll !important",
                  position: "relative",
                  padding: 20,
                }}
              >
                <span style={{ color: "white", fontSize: 18, fontWeight: 600 }}>
                  Câu lệnh: {shellResult?.command}
                </span>
                <br />
                <span style={{ color: "white" }}>
                  ---------------------------------------------------------------
                </span>
                {shellResult?.result?.map((item) => (
                  <div>
                    <span
                      style={{
                        color: "white",
                        lineBreak: "normal",
                        fontSize: 15,
                      }}
                    >
                      {item}
                    </span>
                    <br />
                  </div>
                ))}
              </div>
              <Flex gap={10} style={{ marginTop: 25 }}>
                <Input
                  size="large"
                  placeholder="Câu lệnh tấn công"
                  value={command}
                  onChange={handleChangeCommand}
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    handleRequestCommand(command);
                  }}
                >
                  Gửi câu lệnh
                </Button>
              </Flex>
            </Card>
          </div>
        ) : (
          ""
        )}
      </div>
    </Fragment>
  );
};

export default Metasploit;
