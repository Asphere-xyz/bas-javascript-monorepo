import { Spin, Typography } from "antd";
import { observer } from "mobx-react";

export interface IValidatorsCardProps {
  title?: string;
  active: number;
  total: number;
  loading?: boolean;
}

const { Text } = Typography;

export const ValidatorsCard = observer(({ 
  title, 
  active, 
  total,
  loading = false,
}: IValidatorsCardProps) => {
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
              {active} / {total}
            </Text>
          </>
        )
      }

    </div>
  )
});

