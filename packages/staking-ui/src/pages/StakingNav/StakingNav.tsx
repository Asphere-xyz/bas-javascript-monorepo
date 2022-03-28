import { Divider } from "antd";
import { observer } from "mobx-react";
import { ReactElement, useEffect } from "react";
import DelegatedAssets from "src/pages/StakingNav/components/DelegatedAssets/DelegatedAssets";
import StakingHistory from "src/pages/StakingNav/components/StakingHistory/StakingHistory";
import { useBasStore } from "src/stores";

import '../index.css';

export const StakingNav = observer((): ReactElement => {
  const store = useBasStore();

  useEffect(() => {

  }, [store]);

  return (
    <div>

      <DelegatedAssets />
      
      <Divider />

      <StakingHistory />
    </div>
  );
})