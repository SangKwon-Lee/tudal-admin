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

const logoImage = '/static/logo.png';
const whiteLogoImage = '/static/logo_white.png';

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

export const WhiteLogo: FC<LogoProps> = (props) => (
  <Box
    sx={{
      height: 35,
      '& > img': {
        maxHeight: '100%',
        width: 'auto'
      }
    }}
  >
    <img src={whiteLogoImage} />
  </Box>
);

export default Logo;

