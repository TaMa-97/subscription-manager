import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Edit2, Trash2 } from "lucide-react";
import { Subscription } from "../types/subscription";
import { Button } from "./styled/Common";

const Container = styled.div`
  margin-top: 2rem;
`;

const TotalAmount = styled.div`
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
  }

  p {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ServiceName = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
  color: #2d3748;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 1rem;
`;

const Info = styled.div`
  color: #718096;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const IconButton = styled(Button)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionList: React.FC<Props> = ({
  subscriptions,
  onEdit,
  onDelete,
}) => {
  const totalAmount = subscriptions.reduce((sum, sub) => {
    const price = typeof sub.monthly_price === "number" ? sub.monthly_price : 0;
    return sum + price;
  }, 0);

  return (
    <Container>
      <TotalAmount>
        <h2>月額合計</h2>
        <p>¥{totalAmount.toLocaleString()}</p>
      </TotalAmount>

      <Grid>
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <ServiceName>{subscription.name}</ServiceName>
            <Price>
              ¥{(subscription.monthly_price || 0).toLocaleString()}/月
            </Price>
            <Info>
              <div>
                開始日:{" "}
                {format(new Date(subscription.start_date), "yyyy年M月d日", {
                  locale: ja,
                })}
              </div>
              {subscription.memo && <div>メモ: {subscription.memo}</div>}
            </Info>
            <Actions>
              <IconButton onClick={() => onEdit(subscription)} title="編集">
                <Edit2 size={18} />
              </IconButton>
              <IconButton
                variant="danger"
                onClick={() => onDelete(subscription.id)}
                title="削除"
              >
                <Trash2 size={18} />
              </IconButton>
            </Actions>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};
