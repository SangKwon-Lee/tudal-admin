import {
  findAllByText,
  findByTestId,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { INews } from 'src/types/news';
import NewsCommentForm from './NewsCommentForm';

const mockFunc = jest.fn();

const mockNews: INews = {
  id: 1,
  url: 'https://m.stock.naver.com/news/read.nhn?category=flashnews&officeId=643&articleId=0000095802',
  title: 'Tata Motors, 3분기 국내 판매량 150,958대, 24% 증가',
  mediaName: '로이터 증권(신)',
  publishDate: '2020-12-31T15:00:00.000Z',
  summarized:
    '1월 1일(로이터) - Tata Motors Ltd. ::TA Motors Ltd.는 FY21 3분기 국내 판매량이 FY20 3분기에 비해 24% 증가했다고 말합니다.타타...',
  source: 'naver:flash',
  created_at: new Date('2021-02-04T06:41:42.000Z'),
  updated_at: new Date('2021-02-04T06:41:42.000Z'),
  newsId: '0000095802',
  photo: null,
  officeId: '643',
  isSelected: false,
  tags: [
    {
      id: 733,
      name: 'M',
    },
    {
      id: 1098,
      name: 'S',
    },
  ],
};

test('renders form and title properly', async () => {
  const { getByTestId } = render(
    <NewsCommentForm
      isOpen={true}
      setOpen={mockFunc}
      news={mockNews}
    />,
  );

  await waitForElementToBeRemoved(() => getByTestId('tag-loading'));
});

describe('Comment Input', () => {
  test('shock list should be automatically added', async () => {
    const { getByText, getByTestId } = render(
      <NewsCommentForm
        isOpen={true}
        setOpen={mockFunc}
        news={mockNews}
      />,
    );

    await waitForElementToBeRemoved(() =>
      getByTestId('stock-loading'),
    );

    const commentInput = screen
      .getAllByRole('textbox')
      .filter((element) => element.id === 'comment')[0];

    fireEvent.click(commentInput, {
      target: { value: '한화손해보험' },
    });

    expect(screen.getByDisplayValue(/한화손해보험/)).toBeTruthy();

    fireEvent.blur(commentInput);

    await waitFor(() => expect(getByText(/111370/)).toBeTruthy()); //한화 손해보험 stockcode
    expect(getByText(/한화손해보험/)).toBeTruthy();
  });

  test('keyword list should be automatically added', async () => {
    const { getByText, getByTestId } = render(
      <NewsCommentForm
        isOpen={true}
        setOpen={mockFunc}
        news={mockNews}
      />,
    );

    await waitForElementToBeRemoved(() => getByTestId('tag-loading'));

    const commentInput = screen
      .getAllByRole('textbox')
      .filter((element) => element.id === 'comment')[0];

    fireEvent.click(commentInput, {
      target: { value: '문재인' },
    });
    expect(screen.getByDisplayValue(/문재인/)).toBeTruthy();
    fireEvent.blur(commentInput);

    await waitFor(() => expect(getByText(/문재인/)).toBeTruthy());
  });
  test('shock & keyword list should be automatically added', async () => {
    const { getByText, getByTestId } = render(
      <NewsCommentForm
        isOpen={true}
        setOpen={mockFunc}
        news={mockNews}
      />,
    );

    await waitForElementToBeRemoved(() =>
      getByTestId('stock-loading'),
    );

    const commentInput = screen
      .getAllByRole('textbox')
      .filter((element) => element.id === 'comment')[0];

    fireEvent.click(commentInput, {
      target: { value: '한화손해보험 문재인' },
    });

    expect(screen.getByDisplayValue(/한화손해보험/)).toBeTruthy();
    expect(screen.getByDisplayValue(/문재인/)).toBeTruthy();

    fireEvent.blur(commentInput);

    await waitFor(() => expect(getByText(/111370/)).toBeTruthy()); //한화 손해보험 stockcode

    expect(getByText(/문재인/)).toBeTruthy(); // '문재인' should be in keyword
  });
});
