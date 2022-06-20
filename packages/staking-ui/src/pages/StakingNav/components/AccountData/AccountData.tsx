import { Spin, Typography } from "antd";
import { observer } from "mobx-react";
import { useBasStore } from "src/stores";
import { useLocalFetchDataStore } from "src/stores/FetchDataStore";

const { Title, Text } = Typography;

export const AccountData = observer(() => {
  const store = useBasStore();

  const availableAmount = useLocalFetchDataStore<string>(async () => {
    let availableAmountTemp = '0';
    try {
      const avail = await store.getBasSdk().getStaking().getMyAvailableReDelegateAmount();
      availableAmountTemp = avail.toString(10);
    } catch (e) {
      console.error(e);
    }
    return availableAmountTemp;
  });

  const delegatedAmount = useLocalFetchDataStore<string>(async () => {
    let delegatedAmountTemp = '0';
    try {
      const avail = await store.getBasSdk().getStaking().getDelegatorDelegatedAmount(
        store.getBasSdk().getKeyProvider().getMyAddress(),
      );
      delegatedAmountTemp = avail.toFixed();
    } catch (e) {
      console.error(e);
    }
    return delegatedAmountTemp;
  });

  return (
    <div className="accountDataCArd">
      <div className="">
        <Title level={5} type='secondary'>
          Re-Delegate Amount
        </Title>
        {
          availableAmount.isLoading
          ? <Spin size="default" />
          : (
            <Text strong className="cardBody">
              {availableAmount.item} 
            </Text>
          )
        }
      </div>
      <div>
        <Title level={5} type='secondary'>
          Total Delegated
        </Title>
        {
          delegatedAmount.isLoading
          ? <Spin size="default" />
          : (
            <Text strong  className="cardBody">
              {delegatedAmount.item} 
            </Text>
          )
        }
      </div>
    </div>
  )
});