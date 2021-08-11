import { render, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import NewsListTable from './NewsListTable';
import { News } from 'src/fixtures';
import userEvent from '@testing-library/user-event';

describe('News List Table', () => {
  function renderTable(
    news,
    search?,
    setSerach?,
    postDelete?,
    reload?,
  ) {
    return render(<NewsListTable newsList={news} />);
  }

  it('renders news', async () => {
    const { findAllByText } = renderTable(News.list);
    const elements = await findAllByText(/로이터 증권/);
    expect(elements).not.toBeNull();
  });

  it('render multiple news', () => {
    const render = renderTable(News.list);
    expect(
      render.queryByTestId('news-table-list').querySelectorAll('tr'),
    ).toHaveLength(6);
  });

  it('sort news by updated_at:DESC', () => {
    const { queryByTestId, getAllByRole, queryAllByTestId } =
      renderTable(News.list);

    const selectButtons = getAllByRole('combobox').filter(
      (element) => element.id === 'sort',
    )[0];

    userEvent.selectOptions(selectButtons, '최신 등록순');
    const list =
      queryByTestId('news-table-list').querySelectorAll('tr');
    expect(list).toHaveLength(6);

    const datesRows = queryAllByTestId('news-table-row-publish-date');

    for (let i = 1; i < datesRows.length; i++) {
      const pastDays = dayjs(datesRows[i - 1].textContent);
      const futureDays = dayjs(datesRows[i].textContent);

      expect(
        pastDays.isAfter(futureDays) || pastDays.isSame(futureDays),
      ).toBeTruthy();
    }
  });

  it('sort news by updated_at:ASC', async () => {
    const { getAllByRole, queryByTestId, queryAllByTestId } =
      renderTable(News.list);

    const selectButtons = getAllByRole('combobox').filter(
      (element) => element.id === 'sort',
    )[0];

    userEvent.selectOptions(selectButtons, '오래된 등록순');
    const list =
      queryByTestId('news-table-list').querySelectorAll('tr');
    expect(list).toHaveLength(6);

    const datesRows = queryAllByTestId('news-table-row-publish-date');

    for (let i = 1; i < datesRows.length; i++) {
      const pastDays = dayjs(datesRows[i - 1].textContent);
      const futureDays = dayjs(datesRows[i].textContent);
      expect(
        pastDays.isBefore(futureDays) || pastDays.isSame(futureDays),
      ).toBeTruthy();
    }
  });

  it('changes search words', async () => {
    const { getAllByRole } = renderTable(News.list);

    const searchInput = getAllByRole('textbox').filter(
      (element) => element.id === '_q',
    )[0];

    fireEvent.change(searchInput, { target: { value: '로이터' } });
    expect(searchInput.nodeValue).toEqual('로이터');
  });
});
