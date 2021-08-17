import React, { useState, useRef, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Schedule } from 'src/types/schedule';

import axios from 'src/lib/axios';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';
import { ScheduleForm } from 'src/components/dashboard/schedule';
import ChevronRightIcon from '../../icons/ChevronRight';
import { ScheduleListTable } from '../../components/dashboard/schedule';
import useSettings from 'src/hooks/useSettings';
import useAsync from 'src/hooks/useAsync';
import { APISchedule } from 'src/lib/api';

const ScheduleList: React.FC = () => {
  const { settings } = useSettings();
  const scrollRef = useRef(null);
  const [search, setSearch] = useState<string>('');
  const [targetModify, setTargetModify] = useState<Schedule>(null);
  const [schedulesState, refetchSchedule] = useAsync<Schedule[]>(
    () => APISchedule.getList(search),
    [search],
    [],
  );

  const { data: schedules } = schedulesState;

  const reload = useCallback(
    () => refetchSchedule(),
    [refetchSchedule],
  );

  const postDelete = async (id: number) => {
    try {
      const { status } = await APISchedule.deleteItem(id);
      if (status === 200) {
        reload();
      }
      if (status === 404) {
        alert('존재하지 않는 스케줄입니다. 확인 부탁드립니다.');
      }
    } catch (error) {
      alert('삭제에 실패했습니다. 관리자에게 문의해주시길 바랍니다.');
    }
  };

  const clearTargetModify = () => {
    setTargetModify(null);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard: Schedule List | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 8,
        }}
        ref={scrollRef}
      >
        <Container maxWidth={settings.compact ? 'xl' : false}>
          <Grid container justifyContent="space-between" spacing={3}>
            <Grid item>
              <Typography color="textPrimary" variant="h5">
                일정 리스트
              </Typography>
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={<ChevronRightIcon fontSize="small" />}
                sx={{ mt: 1 }}
              >
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  대시보드
                </Link>
                <Link
                  color="textPrimary"
                  component={RouterLink}
                  to="/dashboard"
                  variant="subtitle2"
                >
                  컨텐츠관리
                </Link>
                <Typography color="textSecondary" variant="subtitle2">
                  일정
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <ScheduleForm
            reload={reload}
            targetModify={targetModify}
            clearTargetModify={clearTargetModify}
          />
          <Box sx={{ mt: 3 }}>
            <ScheduleListTable
              schedules={schedules}
              reload={reload}
              search={search}
              setSearch={setSearch}
              postDelete={postDelete}
              setTargetModify={setTargetModify}
              scrollRef={scrollRef}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ScheduleList;
