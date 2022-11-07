import axios from 'axios';
import { useEffect, useState } from 'react';
import TudalUsThemeListPresenter from './TudalUsThemeList.Presenter';

const TudalUsThemeListContainer = () => {
  const [themeList, setThemeList] = useState<[]>([]);

  const getTudalUsThemeList = async () => {
    try {
      const { data, status } = await axios.get(
        `https://me0g47n7li.execute-api.ap-northeast-2.amazonaws.com/prod/stocks?theme=all`,
      );
      if (status === 200 && data.data.theme) {
        setThemeList(
          data.data.theme.sort(
            (a: any, b: any) => b.isMain - a.isMain,
          ),
        );
      }
    } catch (e) {}
  };

  // * 테마 메인 변경 함수
  const handleThemeMainUp = async (data: any) => {
    console.log(data);
    try {
      await axios.put(
        `https://me0g47n7li.execute-api.ap-northeast-2.amazonaws.com/prod/stocks`,
        {
          isMain: 1,
        },
      );
    } catch (e) {}
  };
  // * 테마 메인 변경 함수
  const handleThemeMainDown = async (data: any) => {
    try {
      // await axios.put(
      //   `https://me0g47n7li.execute-api.ap-northeast-2.amazonaws.com/prod/stocks`,
      //   {
      //     isMain: 1,
      //   },
      // );
    } catch (e) {}
  };

  useEffect(() => {
    getTudalUsThemeList();
  }, []);

  return (
    <TudalUsThemeListPresenter
      themeList={themeList}
      handleThemeMainUp={handleThemeMainUp}
      handleThemeMainDown={handleThemeMainDown}
    />
  );
};

export default TudalUsThemeListContainer;
