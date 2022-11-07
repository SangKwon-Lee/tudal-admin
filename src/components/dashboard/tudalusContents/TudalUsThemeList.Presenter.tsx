import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@material-ui/core';
import dayjs from 'dayjs';
import Scrollbar from 'src/components/layout/Scrollbar';

interface TudalUsThemeListProps {
  themeList: any;
  handleThemeMainUp: (data: any) => Promise<void>;
  handleThemeMainDown: (data: any) => Promise<void>;
}

const TudalUsThemeListPresenter = ({
  themeList,
  handleThemeMainUp,
  handleThemeMainDown,
}: TudalUsThemeListProps) => {
  return (
    <Scrollbar>
      <Box sx={{ minWidth: 700 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>섬네일</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>테마코드</TableCell>
              <TableCell align="center">메인</TableCell>
              <TableCell>등록일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {themeList
              //@ts-ignore
              .sort((a, b) => b.isMain - a.isMain)
              .map((list) => {
                return (
                  <TableRow hover key={list.theme_code}>
                    <TableCell>
                      <img
                        src={list.url}
                        alt=""
                        style={{ width: '60px', height: '60px' }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      {list.name ? list.name : '제목이 없습니다.'}
                    </TableCell>
                    <TableCell>{list.theme_code}</TableCell>
                    <TableCell align="center">
                      {list.isMain === 1 ? (
                        <Button
                          variant="contained"
                          onClick={() => {
                            if (
                              window.confirm(
                                '해당 게시글을 메인에서 내리시겠습니까?',
                              )
                            ) {
                              handleThemeMainDown(list.theme_code);
                            }
                          }}
                        >
                          메인에서 내리기
                        </Button>
                      ) : (
                        <Button
                          color="secondary"
                          onClick={() => {
                            if (
                              window.confirm(
                                '해당 게시글을 메인으로 올리시겠습니까?',
                              )
                            ) {
                              handleThemeMainUp(list.theme_code);
                            }
                          }}
                        >
                          메인으로 올리기
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {dayjs(list.created_at).format(
                        'YYYY년 M월 D일 HH:mm',
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Box>
    </Scrollbar>
  );
};

export default TudalUsThemeListPresenter;
