import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { LinkButton } from '@strapi/design-system/LinkButton';
import Eye from '@strapi/icons/Eye';
import axios from './utils/axiosInstance';

const useConfig = () => {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    axios.get('/gatsby-cloud')
      .then(response => {
        if (response?.data) {
          setConfig(response.data);
        }
      })
      .catch(() => null)
      .then(() => setLoading(false));
  }, []);

  return { config, loading };
}

const Preview = () => {
  const { modifiedData, layout } = useCMEditViewDataManager();
  const { formatMessage } = useIntl();
  const { config, loading } = useConfig();
  const sourcePluginName = '@relate-app%2Fgatsby-source-strapi';
  const type = layout?.info?.displayName;
  const { id, updatedAt } =  modifiedData;
  const manifestId = `${type}-${id}-${updatedAt}`;
  const contentId = `${type}-${id}`;
  const url = `${config?.contentSyncUrl}/${sourcePluginName}/${manifestId}/${contentId}`;

  return (
    <LinkButton
      size="S"
      disabled={loading}
      startIcon={<Eye />}
      style={{ width: '100%' }}
      href={url}
      variant="secondary"
    >
      {formatMessage({
        id: 'app.links.preview',
        defaultMessage: 'Open preview',
      })}
    </LinkButton>
  );
}

export default Preview;
