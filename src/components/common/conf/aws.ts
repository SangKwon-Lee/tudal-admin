const AWS = require('aws-sdk');
const region = 'ap-northeast-2';
const access_key = 'AKIAY53UECMD2OMWX4UR';
const secret_key = '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';

//* 버킷 이름
export const bucket_hiddenbox = 'hiddenbox-photo';
export const bucket_tudal_popup = 'tudal-popup-photo';

//* 최종 사용하는 S3
export const S3 = new AWS.S3({
  region,
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
});
