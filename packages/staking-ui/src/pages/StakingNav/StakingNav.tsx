import { Divider } from "antd";
import { observer } from "mobx-react";
import { ReactElement } from "react";
import DelegatedAssets from "src/pages/StakingNav/components/DelegatedAssets/DelegatedAssets";
import StakingHistory from "src/pages/StakingNav/components/StakingHistory/StakingHistory";

import '../index.css';

import { AccountData } from "./components/AccountData";

export const StakingNav = observer((): ReactElement => {
  return (
    <div>
      <AccountData />
      
      <Divider />

      <DelegatedAssets />
      
      <Divider />

      <StakingHistory />
    </div>
  );
})