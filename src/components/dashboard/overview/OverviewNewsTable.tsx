import type { FC } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { INews } from 'src/types/news';

const OverviewNewsTable: FC<{ newsList: INews[] }> = ({
  newsList,
}) => (
  <Card>
    <CardHeader title="뉴스픽" />
    <List disablePadding>
      {newsList.map((news, index) => (
        <Box key={news.id}>
          <ListItem divider={index + 1 < newsList.length}>
            <ListItemText
              disableTypography
              primary={
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography color="textPrimary" variant="subtitle2">
                    <a
                      href={news.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: 'rgb(87,98,120)',
                      }}
                    >
                      {news.title}
                    </a>
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    {`${formatDistanceToNowStrict(
                      new Date(news.publishDate),
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
    <CardActions>
      <Link
        to="/dashboard/news-comments"
        style={{ textDecoration: 'none' }}
      >
        <Button color="primary" variant="text">
          뉴스 더보기
        </Button>
      </Link>
    </CardActions>
  </Card>
);

export default OverviewNewsTable;
