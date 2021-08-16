import {
  getAllByText,
  getByDisplayValue,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import dayjs from 'dayjs';
import NewsListTable from './NewsListTable';
import { FixtureNews } from 'src/fixtures';
import userEvent from '@testing-library/user-event';
import NewsCommentHistory from './NewsCommentHistory';

const mock = jest.fn();

it('shows comment title', async () => {
  const { getAllByText, getByText, debug } = render(
    <NewsCommentHistory newsComments={FixtureNews.comments} />,
  );
  expect(getByText('과거 코멘트 내역')).toBeInTheDocument();
});

describe('display data properly', () => {
  it('comment', async () => {
    const { getByText } = render(
      <NewsCommentHistory newsComments={FixtureNews.comments} />,
    );

    expect(getByText(/어떻게 된지는 모르겠습니다./)).toBeTruthy();
  });
});
