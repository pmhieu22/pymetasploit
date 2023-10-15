import { Card, Input, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import { metasploitApi } from "../../apis/metaploitApi";

const { Text, Link, Title } = Typography;

const Metasploit = () => {
  const [modules, setModules] = useState([]);
  
  

  console.log("modules: ", modules);
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
        <Card title={<Text style={{ fontSize: 35 }}>Exploit options</Text>}>
          <div>
            <Title level={3} style={{ marginTop: 0 }}>
              Exploit Module
            </Title>
            <Input
              style={{ maxWidth: 450 }}
              defaultValue="windows/smb/ms17_010_eternalblue"
              disabled
            />
          </div>
        </Card>
      </div>
    </Fragment>
  );
};

export default Metasploit;
