import {
  AppstoreOutlined,
  LockOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Menu, Typography } from "antd";
import { observer } from "mobx-react";
import { ReactElement, useState } from "react";

import { useBasStore } from "../stores";

import { GovernanceNav } from "./GovernanceNav/GovernanceNav";
import { StakingNav } from "./StakingNav/StakingNav";
import { ValidatorsNav } from "./ValidatorsNav/ValidatorNav";

const HomePage = observer((): ReactElement => {
  const [currentTab, setCurrentTab] = useState("validator");

  return (
    <div>
      <Menu
        mode="horizontal"
        selectedKeys={[currentTab]}
        onSelect={({ selectedKeys }) => {
          setCurrentTab(selectedKeys[0]);
        }}
      >
        <Menu.Item key="validator" icon={<LockOutlined translate="yes" />}>
          Validators
        </Menu.Item>
        <Menu.Item key="governance" icon={<AppstoreOutlined translate="yes" />}>
          Governance
        </Menu.Item>
        <Menu.Item key="staking" icon={<WalletOutlined translate="yes" />}>
          Staking
        </Menu.Item>
      </Menu>
      <br />

      {currentTab === "validator" && <ValidatorsNav />}
      {currentTab === "governance" && <GovernanceNav />}
      {currentTab === "staking" && <StakingNav />}
    </div>
  );
});

export default HomePage;
