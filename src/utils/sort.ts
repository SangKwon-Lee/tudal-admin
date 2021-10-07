import moment from 'moment';

export const applyFilters = (list: any, query?: string, filters?) =>
  list.filter((list) => {
    let matches = true;

    if (query) {
      // const properties = ['title', 'author-username'];
      let containsQuery = false;
      if (list.title) {
        if (list.title.toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      }
      // let containsQuery = false;
      // properties.forEach((property) => {
      //   if (property.indexOf('-') > -1) {
      //     const strArray = property.split('-');
      //     if (
      //       list[strArray[0]][strArray[1]]
      //         .toLowerCase()
      //         .includes(query.toLowerCase())
      //     ) {
      //       containsQuery = true;
      //     }
      //   } else {
      //     if (
      //       list[property].toLowerCase().includes(query.toLowerCase())
      //     ) {
      //       containsQuery = true;
      //     }
      //   }
      // });
      if (!containsQuery) {
        matches = false;
      }
    }

    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];

        switch (key) {
          case 'beforeSale':
            if (value && moment().diff(moment(list.startDate)) > 0) {
              matches = false;
            }
            break;
          case 'onSale':
            if (
              value &&
              (moment().diff(moment(list.startDate)) < 0 ||
                moment().diff(moment(list.endDate)) > 0)
            ) {
              matches = false;
            }
            break;
          case 'afterSale':
            if (value && moment().diff(moment(list.endDate)) < 0) {
              matches = false;
            }
            break;
          case 'public':
            if (value && moment().diff(moment(list.publicDate)) < 0) {
              matches = false;
            }
            break;
        }
      });
    }

    return matches;
  });

export const applyPagination = (
  list: any[],
  page: number,
  limit: number,
): any[] => list.slice(page * limit, page * limit + limit);

export const descendingComparator = (
  a: any,
  b: any,
  orderBy: string,
): number => {
  if (orderBy === 'productId' || orderBy === 'viewCount') {
    if (Number(b[orderBy]) < Number(a[orderBy])) {
      return -1;
    }

    if (Number(b[orderBy]) > Number(a[orderBy])) {
      return 1;
    }
  }

  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

export const getComparator = (
  order: 'asc' | 'desc',
  orderBy: string,
) =>
  order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);

export const applySort = (
  list: any[],
  sort: any,
  room?: any,
): any[] => {
  if (room && room !== '전체') {
    list = list.filter((data) => data.cp_room);
    list = list.filter((data) => data.cp_room.title === room);
  }
  const [orderBy, order] = sort.split('|') as [
    string,
    'asc' | 'desc',
  ];

  const comparator = getComparator(order, orderBy);

  const stabilizedThis = list.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    // @ts-ignore
    const newOrder = comparator(a[0], b[0]);

    if (newOrder !== 0) {
      return newOrder;
    }

    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  return stabilizedThis.map((el) => el[0]);
};
