import type { FC } from 'react';
import { formatDistanceToNowStrict, subHours } from 'date-fns';
import {
  Chip,
  Box,
  Card,
  CardHeader,
  LinearProgress,
  Link,
  Rating,
  Typography,
  TablePagination,
} from '@material-ui/core';
import { IStockDetailsWithTagCommentNews } from 'src/types/stock';
const now = new Date();

interface StockListProps {
  list: IStockDetailsWithTagCommentNews[];
  loading: boolean;
}

const StockList: FC<StockListProps> = ({ list, loading }) => (
  <Box
    sx={{
      backgroundColor: 'background.default',
      minHeight: '100%',
      p: 3,
    }}
    data-testid="stock-list"
  >
    {loading && (
      <div data-testid="stock-list-loading">
        <LinearProgress />
      </div>
    )}
    {list.map((stock) => (
      <Card
        key={stock.code}
        sx={{
          '& + &': {
            mt: 2,
          },
        }}
      >
        <CardHeader
          disableTypography
          subheader={
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                mt: 1,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexWrap: 'wrap',
                }}
              >
                {console.log(list[0])}
                {stock.tags.map((tag) => {
                  return (
                    <Chip
                      // onDelete={(): void => {
                      //   const newTags = values.tags.filter(
                      //     (t) => t !== _tag,
                      //   );

                      //   setFieldValue('tags', newTags);
                      // }}
                      // eslint-disable-next-line react/no-array-index-key
                      key={tag.id}
                      label={tag.name}
                      sx={{
                        '& + &': {
                          ml: 1,
                        },
                      }}
                      variant="outlined"
                    />
                  );
                })}
              </Box>
            </Box>
          }
          title={
            <Typography
              color="textPrimary"
              sx={{ ml: 1 }}
              variant="h6"
              fontSize={20}
            >
              {`${stock.name}(${stock.code})`}
            </Typography>
          }
        />

        {stock.comments &&
          stock.comments.map((comment) => {
            return (
              <Box
                sx={{
                  pb: 2,
                  px: 3,
                }}
              >
                <Typography color="textSecondary" variant="body1">
                  {comment.message}{' '}
                  {comment.author && `by ${comment.author.username}`}
                </Typography>
              </Box>
            );
          })}
      </Card>
    ))}
  </Box>
);

export default StockList;
