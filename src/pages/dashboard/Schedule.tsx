import React, { useState, useEffect, useCallback } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import qs from "qs"
import { Priority, Schedule } from "src/types/schedule"

import useIsMountedRef from "src/hooks/useIsMountedRef"
import axios from "src/lib/axios"
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from "@material-ui/core"
import { ScheduleForm } from "src/components/dashboard/schedule"
import ChevronRightIcon from "../../icons/ChevronRight"
import { ScheduleListTable } from "../../components/dashboard/schedule"
import useSettings from "src/hooks/useSettings"

const ScheduleList: React.FC = () => {
  const { settings } = useSettings()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [query, setQuery] = useState<string>("")
  const isMountedRef = useIsMountedRef()

  const getSchedules = useCallback(
    async (reload = false) => {
      try {
        let q: any = {}
        if (query) {
          q._q = query
        }

        const { data } = await axios.get<Schedule[]>(`/schedules?${qs.stringify(q)}`)

        if (isMountedRef.current || reload) {
          setSchedules(data)
        }
      } catch (err) {
        console.error(err)
      }
    },
    [isMountedRef, query]
  )

  const postDelete = useCallback(async (id: number) => {
    try {
      const response = await axios.delete<Schedule[]>(`/schedules/${id}`)
      if (response.status == 200) {
        reload()
      }
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getSchedules()
  }, [getSchedules, query])

  const reload = () => getSchedules()

  return (
    <>
      <Helmet>
        <title>Dashboard: Schedule List | TUDAL Admin</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={settings.compact ? "xl" : false}>
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
          <ScheduleForm reload={reload} />
          <Box sx={{ mt: 3 }}>
            <ScheduleListTable
              schedules={schedules}
              reload={reload}
              query={query}
              setQuery={setQuery}
              postDelete={postDelete}
            />
          </Box>
        </Container>
      </Box>
    </>
  )
}

export default ScheduleList
