import { S3 } from 'src/components/common/conf/aws';

export const registerImage = async (file, bucket_name) => {
  try {
    // Koscom Cloud에 업로드하기!
    await S3.putObject({
      Bucket: bucket_name,
      Key: file[0].name,
      ACL: 'public-read',
      // ACL을 지우면 전체공개가 되지 않습니다.
      Body: file[0],
    }).promise();
    return `https://${bucket_name}.s3.ap-northeast-2.amazonaws.com/${file[0].name}`;
  } catch (error) {
    console.log(error);
  }
};
