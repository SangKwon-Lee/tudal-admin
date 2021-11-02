import { render } from '@testing-library/react';
import dayjs from 'dayjs';
import NewsListTable from './NewsList.Presenter';
import { FixtureNews } from 'src/fixtures';
import userEvent from '@testing-library/user-event';

const mock = jest.fn();

describe('News List Table', () => {
  function renderTable(news, search?) {
    return render(
      <NewsListTable
        newsList={news}
        search={search}
        isLoading={false}
        page={0}
        limit={10}
        setSearch={mock}
        reload={mock}
        setPage={mock}
        setLimit={mock}
        updateSelect={mock}
        postDelete={mock}
      />,
    );
  }

  it('renders news', async () => {
    const { findAllByText } = renderTable(FixtureNews.list);
    const elements = await findAllByText(/로이터 증권/);
    expect(elements).not.toBeNull();
  });

  it('render multiple news', () => {
    const render = renderTable(FixtureNews.list);
    expect(
      render.queryByTestId('news-table-list').querySelectorAll('tr'),
    ).toHaveLength(6);
  });

  it('sort news by updated_at:DESC', () => {
    const { queryByTestId, getAllByRole, queryAllByTestId } =
      renderTable(FixtureNews.list);

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
      renderTable(FixtureNews.list);

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
});
