import { Box, Card, CardHeader, Typography } from '@material-ui/core';
import { TudalusState, TudalusAction } from './Tudalus.Conatiner';

interface TudalusProps {
  tudalusState: TudalusState;
  dispatch: (params: TudalusAction) => void;
}

const TudalusPresenter: React.FC<TudalusProps> = ({
  dispatch,
  tudalusState,
}) => {
  const { subscriber } = tudalusState;
  return (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ p: 1, width: '250px', marginRight: 5 }}>
        <CardHeader title="총 구독자 수"></CardHeader>
        <Typography sx={{ fontSize: 22, fontWeight: 'bold', p: 2 }}>
          {subscriber}명
        </Typography>
      </Card>
    </Box>
  );
};

export default TudalusPresenter;
