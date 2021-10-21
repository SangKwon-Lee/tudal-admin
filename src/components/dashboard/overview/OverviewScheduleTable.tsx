import type { FC } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  CardActions,
  Button,
  LinearProgress,
} from '@material-ui/core';
import dayjs from 'dayjs';
import { Schedule } from 'src/types/schedule';
import { Link } from 'react-router-dom';
const OverviewScheduleTable: FC<{ scheduleList: Schedule[] }> = ({
  scheduleList,
}) => (
  <Card>
    {scheduleList.length === 0 && <LinearProgress />}
    <CardHeader title="주요 일정" />
    <Table>
      <TableBody>
        {scheduleList.map((schedule) => (
          <TableRow
            key={schedule.id}
            sx={{
              '&:last-child td': {
                border: 0,
              },
            }}
          >
            <TableCell width={100}>
              <Box sx={{ p: 1 }}>
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle2"
                >
                  {`${dayjs(schedule.startDate).format('MM-DD')}`}
                </Typography>
                <Typography
                  align="center"
                  color="textSecondary"
                  variant="subtitle2"
                >
                  {`~${dayjs(schedule.endDate).format('MM-DD')}`}{' '}
                </Typography>
              </Box>
            </TableCell>
            <TableCell>
              <div>
                <Typography color="textPrimary" variant="subtitle1">
                  {schedule.title}
                </Typography>
                <Typography color="textSecondary" variant="body2">
                  {schedule.comment.slice(0, 80)}
                </Typography>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <CardActions>
      <Link
        to="/dashboard/schedules"
        style={{ textDecoration: 'none' }}
      >
        <Button color="primary" variant="text">
          일정 더보기
        </Button>
      </Link>
    </CardActions>
  </Card>
);

export default OverviewScheduleTable;
