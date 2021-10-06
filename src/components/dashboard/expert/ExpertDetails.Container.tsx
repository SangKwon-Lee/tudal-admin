import { useCallback, useEffect, useState } from 'react';
import type { Expert } from '../../../types/expert';
import axios from 'src/lib/axios';
import { useParams } from 'react-router-dom';
import useMounted from 'src/hooks/useMounted';
import ExpertDetailsPresenter from './ExpertDetails.Presenter';

const ExpertDetailsContainer = () => {
  const mounted = useMounted();
  const { expertId } = useParams();
  const [expert, setExpert] = useState<any>({});

  const getExpert = useCallback(async () => {
    try {
      const response = await axios.get<Expert>(
        `/expert-feeds/${expertId}`,
      );
      if (mounted) {
        setExpert(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [mounted, expertId]);

  useEffect(() => {
    getExpert();
  }, [getExpert]);

  return <ExpertDetailsPresenter expert={expert} />;
};

export default ExpertDetailsContainer;
