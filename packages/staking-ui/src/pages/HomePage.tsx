import {
  LockOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {Button, Divider, Drawer, Menu} from "antd";
import {observer} from "mobx-react";
import {ReactElement, useEffect, useState} from "react";

import CreateProposalForm from "../components/CreateProposalForm";
import ProposalTable from "../components/ProposalTable";
import ValidatorTable from "../components/ValidatorTable";
import {useBasStore} from "../stores";

const ProposalNav = observer((props: any): ReactElement => {
  const [drawerVisible, setDrawerVisible] = useState(false)
  return (
    <div>
      <Drawer
        bodyStyle={{paddingBottom: 80}}
        title="Create proposal"
        visible={drawerVisible}
        width={500}
        onClose={() => {
          setDrawerVisible(false)
        }}
      >
        <CreateProposalForm/>
      </Drawer>

      <ProposalTable/>

      <br/>

      <Button icon={<PlusOutlined translate="yes"/>} size="large" type="primary" onClick={() => {
        setDrawerVisible(true)
      }}>Create Proposal</Button>
    </div>
  );
})

const ValidatorNav = observer((props: any): ReactElement => {
  const store = useBasStore()
  const [stakingRewards, setStakingRewards] = useState('0')
  useEffect(() => {

  }, [store])
  return (
    <div>
      <ValidatorTable/>
    </div>
  );
})

interface IHomePageProps {
}

const HomePage = observer((props: IHomePageProps): ReactElement => {
  const store = useBasStore()
  const [currentTab, setCurrentTab] = useState('governance')
  const [blockInfo, setBlockInfo] = useState({} as any)
  useEffect(() => {
    setInterval(async () => {
      if (!store.isConnected) return;
      setBlockInfo(await store.getBlockNumber())
    }, 1_000)
  }, [store])
  if (!store.isConnected) {
    return <h1>Connecting...</h1>
  }
  return (
    <div>
      <Menu
        mode="horizontal"
        selectedKeys={[currentTab]}
        onSelect={({selectedKeys}) => {
          setCurrentTab(selectedKeys[0])
        }}
      >
        <Menu.Item key="governance" icon={<LockOutlined translate="yes"/>}>
          Governance
        </Menu.Item>

        <Menu.Item key="voting_power" icon={<LockOutlined translate="yes"/>}>
          Voting Power
        </Menu.Item>

        <Menu.Item key="validator" icon={<LockOutlined translate="yes"/>}>
          Validators
        </Menu.Item>
      </Menu>

      <br/>

      {currentTab === 'governance' && <ProposalNav/>}

      {currentTab === 'validator' && <ValidatorNav/>}

      <Divider/>

      <b>blockNumber</b>: 
      
      {blockInfo.blockNumber}
        
      <br/>

      <b>currentEpoch</b>: 
        
      {blockInfo.epoch}
        
      <br/>

      <b>nextEpochBlock</b>: 
      
      {blockInfo.nextEpochBlock}
      
      &nbsp;(in {blockInfo.nextEpochInSec} sec

      or {(blockInfo.nextEpochInSec / 60).toFixed(1)} min)
      
      <br/>

      <b>blockTime</b>: 

        {blockInfo.blockTime}

      <br/>

      <br/>

      <b>activeValidatorsLength</b>: 
      
      {blockInfo.activeValidatorsLength}
      
      <br/>

      <b>epochBlockInterval</b>: 
      
      {blockInfo.epochBlockInterval}
      
      <br/>

      <b>misdemeanorThreshold</b>: 
      
      {blockInfo.misdemeanorThreshold}
      
      <br/>

      <b>felonyThreshold</b>: 
      
      {blockInfo.felonyThreshold}
      
      <br/>

      <b>validatorJailEpochLength</b>: 
      
      {blockInfo.validatorJailEpochLength}
      
      <br/>

      <b>undelegatePeriod</b>: 
      
      {blockInfo.undelegatePeriod}
      
      <br/>

      <b>minValidatorStakeAmount</b>: 
      
      {blockInfo.minValidatorStakeAmount}
      
      <br/>

      <b>minStakingAmount</b>: 
      
      {blockInfo.minStakingAmount}
      
      <br/>

      <br/>
      P.S: MetaMask caches responses for 12 seconds

      <Divider/>
    </div>
  );
});

export default HomePage
