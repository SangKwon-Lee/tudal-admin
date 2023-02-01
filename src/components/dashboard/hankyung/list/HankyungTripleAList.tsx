import { Box, Typography, Button } from '@material-ui/core';
import {
  ListItemButton,
  useTheme,
  ListItem,
  List,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { priceToString } from 'src/utils/priceToString';

const TripleAList = ({ tripleA, sort, handleAddDndStocks }: any) => {
  const theme = useTheme();
  return (
    <List
      sx={{
        width: '100%',
        padding: 0,
      }}
    >
      {Array.isArray(tripleA) &&
        tripleA.length > 0 &&
        tripleA
          .sort((a, b) => b[sort] - a[sort])
          .map((data, index) => (
            <ListItem
              key={index}
              disablePadding
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderBottom: `1px solid ${theme.palette.grey[300]}`,
              }}
            >
              <ListItemButton
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
                onClick={() => handleAddDndStocks(data)}
              >
                <Box display="flex" flexDirection={'column'}>
                  <Box
                    display={'flex'}
                    alignItems="center"
                    width={'max-content'}
                  >
                    <ListItemText primary={`${data.stockName}`} />
                    <ListItemText
                      sx={{ ml: 1 }}
                      secondary={`${data.stockCode}`}
                    />
                  </Box>
                  <Box display={'flex'}>
                    <Typography variant="subtitle2">
                      포착가격 : {priceToString(data?.capturePrice)}
                    </Typography>
                    <Typography ml={1} variant="subtitle2">
                      최고가격 : {priceToString(data?.high3m)}
                    </Typography>
                  </Box>
                  <Box display={'flex'}>
                    <Typography variant="subtitle2">
                      최고수익률 :{' '}
                      {priceToString(data?.ratio3mByCapturePrice)}%
                    </Typography>
                    <Typography ml={1} variant="subtitle2">
                      포착대비 :{' '}
                      {priceToString(data?.ratioByCapturePrice)}%
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    onClick={() => handleAddDndStocks(data)}
                  >
                    추천
                  </Button>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
    </List>
  );
};

export default React.memo(TripleAList);
