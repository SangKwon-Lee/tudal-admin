const AWS = require('aws-sdk');
const region = 'ap-northeast-2';
const access_key = 'AKIAY53UECMD2OMWX4UR';
const secret_key = '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';

//* 버킷 이름

export enum IBuckets {
  HIDDENBOX = 'hiddenbox-photo',
  HIDDENREPORT = 'hiddenreport',
  HIDDENREPORT_IMAGE = 'hiddenreport-image',
  MASTER_FEED = 'master-feed',
  CP_PHOTO = 'cp-photo',
}
export //* 최종 사용하는 S3
const S3 = new AWS.S3({
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});
