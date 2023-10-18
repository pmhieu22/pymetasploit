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
      const res = await metasploitApi.createExploit(value.rhost);
      if (res.job_id) {
        openNotification({ message: "Tao shell thanh cong", type: "success" });
        setShowCommandControl(true);
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
      console.log("error", error);
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
      console.log("error", error);
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
        <Text style={{ fontSize: 35, fontWeight: 500 }}>
          Thu nghiem trang web kiem thu su dung metasploit
        </Text>
        <Text type="secondary" style={{ fontSize: 25 }}>
          Thu nghiem tan cong lo hong MS17_010 tren he dieu hanh windows
        </Text>
      </div>
      <div style={{ marginTop: 25 }}>
        <Card title={<Text style={{ fontSize: 30 }}>Thong tin tan cong</Text>}>
          <div style={{ marginBottom: 20 }}>
            <Title level={3} style={{ marginTop: 0 }}>
              Exploit Module
            </Title>
            <Input
              style={{ maxWidth: 450 }}
              defaultValue="windows/smb/ms17_010_eternalblue"
              disabled
            />
          </div>
          <div>
            <Title level={3} style={{ marginTop: 0 }}>
              Thong tin ve module
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
                  <Form.Item label="Muc tieu tan cong">
                    <Input
                      name="rhost"
                      size="large"
                      placeholder="Muc tieu tan cong"
                      value={formik.values.rhost}
                      onChange={formik.handleChange}
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Cong tan cong">
                    <Input
                      name="CongTanCong"
                      size="large"
                      placeholder="Cong tan cong"
                      value={moduleInfo?.run_options?.RPORT}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Thoi gian ngat tan cong">
                    <Input
                      name="thoigianngat"
                      size="large"
                      placeholder="Thoi gian ngat tan cong"
                      value={moduleInfo?.run_options?.ConnectTimeout}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Gioi han tan cong">
                    <Input
                      name="soluongtancong"
                      size="large"
                      placeholder="Gioi han tan cong"
                      value={moduleInfo?.run_options?.MaxExploitAttempts}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phien ban SSL">
                    <Input
                      name="phienbanssl"
                      size="large"
                      placeholder="Phien ban SSL"
                      value={moduleInfo?.run_options?.SSLVersion}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Xac dinh muc tieu">
                    <Input
                      name="xacdinhmuctieu"
                      size="large"
                      placeholder="Xac dinh muc tieu"
                      value={moduleInfo?.run_options?.VERIFY_TARGET}
                      disabled
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item label="Tien trinh tan cong">
                    <Input
                      name="tientrinhtancong"
                      size="large"
                      placeholder="Tien trinh tan cong"
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
                Tao tan cong
              </Button>
            </Form>
          </div>
        </Card>
        {showCommandControl ? (
          <div style={{ marginTop: 25 }}>
            <Card
              title={<Text style={{ fontSize: 30 }}>Khai thac tao shell</Text>}
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
                  Cau lenh: {shellResult?.command}
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
                  placeholder="Cau lenh tan cong"
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
                  Gui cau lenh
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
