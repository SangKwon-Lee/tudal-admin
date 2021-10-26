import {
  findAllByText,
  findByTestId,
  fireEvent,
  getAllByRole,
  getByDisplayValue,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { debug } from 'node:console';
import { FixtureNews } from 'src/fixtures';
import { INews } from 'src/types/news';
import NewsCommentForm from './NewsCommentForm.Presenter';

const mockFunc = jest.fn();

test('renders form and title properly', async () => {
  const { getByTestId } = render(
    <NewsCommentForm
      isOpen={true}
      setOpen={mockFunc}
      news={FixtureNews.list[0]}
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
        news={FixtureNews.list[0]}
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
        news={FixtureNews.list[0]}
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
        news={FixtureNews.list[0]}
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
