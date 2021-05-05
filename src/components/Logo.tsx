import type { FC } from 'react';
import type { Theme } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import type { SxProps } from '@material-ui/system';
import {
  Box,
} from '@material-ui/core';
interface LogoProps {
  sx?: SxProps<Theme>;
}

const logoImage = '/static/logo_white.png';

const Logo: FC<LogoProps> = (props) => (
  <Box
    sx={{
      height: 35,
      '& > img': {
        maxHeight: '100%',
        width: 'auto'
      }
    }}
  >
    <img src={logoImage} />
  </Box>
);

export default Logo;
