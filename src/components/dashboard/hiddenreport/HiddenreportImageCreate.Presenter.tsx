import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Grid,
} from '@material-ui/core';
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import {
  HRImageCreateAction,
  HRImageCreateActionKind,
  HRImageCreateState,
} from './HiddenreportImageCreate.Conatiner';
import { FC } from 'react';
import HiddenreportImageCreateAdd from './HiddenreportImageCreateAdd';
import { IHRNewImage } from 'src/types/hiddenreport';

interface PopUpCreateProps {
  HRImageCreateState: HRImageCreateState;
  dispatch: (params: HRImageCreateAction) => void;
  createNewHRimage: () => void;
  onChangeImage: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: HRImageCreateActionKind,
  ) => void;
  onChangeImageList: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: HRImageCreateActionKind,
    index: number,
  ) => void;
  mode: string;
  addComponent: () => void;
  removeComponent: () => void;
}

const HiddenreportImageCreatePresenter: FC<PopUpCreateProps> = (
  props,
) => {
  const {
    HRImageCreateState,
    createNewHRimage,
    mode,
    dispatch,
    onChangeImage,
    onChangeImageList,
    addComponent,
    removeComponent,
  } = props;
  return (
    <>
      <Formik
        initialValues={{
          submit: null,
        }}
        onSubmit={() => {}}
      >
        {({ setFieldValue }): JSX.Element => (
          <Card sx={{ p: 3 }}>
            <form>
              {HRImageCreateState.imageList.map(
                (data: IHRNewImage, i: number) => (
                  <HiddenreportImageCreateAdd
                    createaddInput={HRImageCreateState}
                    dispatch={dispatch}
                    onChangeImage={onChangeImage}
                    onChangeImageList={onChangeImageList}
                    mode={mode}
                    index={i}
                    key={i}
                  />
                ),
              )}
              <Box
                sx={{
                  display: 'flex',
                  mt: 6,
                }}
              >
                <Button
                  color="primary"
                  size="large"
                  variant="text"
                  component={RouterLink}
                  to={`/dashboard/popup`}
                >
                  이전
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                  color="primary"
                  variant="contained"
                  onClick={createNewHRimage}
                >
                  {mode === 'edit' ? '이미지 수정' : '이미지 생성'}
                </Button>
              </Box>
            </form>
            <Button
              color="primary"
              variant="contained"
              onClick={addComponent}
              sx={{ mr: 2 }}
            >
              Add
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={removeComponent}
            >
              Remove
            </Button>
          </Card>
        )}
      </Formik>
    </>
  );
};

export default HiddenreportImageCreatePresenter;
