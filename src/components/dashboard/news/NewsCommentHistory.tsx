import type { FC } from 'react';
import {
  formatDistanceToNowStrict,
  subHours,
  subMinutes,
} from 'date-fns';
import * as _ from 'lodash';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { INewsComment } from 'src/types/news';
import dayjs from 'dayjs';
import { fontSize } from '@material-ui/system';

interface NewsCommentHistoryProps {
  newsComments: INewsComment[];
}

const NewsCommentHistory: FC<NewsCommentHistoryProps> = ({
  newsComments,
}) => {
  const sortedNewsComments = newsComments.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() -
      new Date(a.updated_at).getTime(),
  );
  return _.isEmpty(newsComments) ? (
    <div data-testid="hello">
      <LinearProgress />
    </div>
  ) : (
    <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100%',
        p: 3,
      }}
    >
      <Card style={{ width: '100%' }}>
        <CardHeader title="과거 코멘트 내역" />
        <List disablePadding>
          {sortedNewsComments.map((comment, index) => (
            <Box key={comment.id}>
              <ListItem divider={index + 1 < newsComments.length}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  disableTypography
                  primary={
                    index === 0 ? (
                      <Badge
                        color="primary"
                        sx={{
                          '.MuiBadge-badge': {
                            right: -16,
                            top: 11,
                          },
                        }}
                        variant="dot"
                      >
                        <Typography
                          color="textPrimary"
                          variant="subtitle1"
                        >
                          {comment.author
                            ? `${comment.author.nickname} (${comment.author.email})`
                            : ''}
                        </Typography>
                      </Badge>
                    ) : (
                      <Typography
                        color="textPrimary"
                        variant="subtitle1"
                      >
                        {comment.author ? comment.author.email : ''}
                      </Typography>
                    )
                  }
                  secondary={
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <pre
                        style={{
                          fontSize: 15,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {comment.comment}
                      </pre>
                      <Typography
                        color="textSecondary"
                        variant="caption"
                      >
                        {`${formatDistanceToNowStrict(
                          new Date(comment.updated_at),
                          {
                            addSuffix: true,
                          },
                        )}`}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Box>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default NewsCommentHistory;
