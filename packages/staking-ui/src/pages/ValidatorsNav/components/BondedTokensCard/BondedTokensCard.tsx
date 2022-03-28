import { Spin, Typography } from "antd";
import { observer } from "mobx-react";

export interface IBondedTokensCardProps {
  title?: string;
  tokens: number | string;
  tokenSymbol: string;
  loading?: boolean;
}

const { Text } = Typography;

export const BondedTokensCard = observer(({ 
  title, 
  tokens, 
  tokenSymbol,
  loading = false,
}: IBondedTokensCardProps) => {
  return (
    <div className="card">
      {
        loading
        ? <Spin size="default" />
        : (
          <>
            {title && (
              <Typography.Title level={5} type="secondary">
                {title}
              </Typography.Title>
            )}

            <Text strong className="cardBody">
              {tokens} {tokenSymbol}
            </Text>
          </>
        )
      }
    </div>
  )
});

