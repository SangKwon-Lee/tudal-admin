import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import { S3, bucket_hiddenbox } from '../common/conf/aws';
var useDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)',
).matches;

const WebEditor = (props) => {
  const { editorRef, contents } = props;
  return (
    <Editor
      apiKey="4n6bz3uji80ya54n4873jyx6jyy75yn0mtu5d2y2nuclr6o7"
      ref={editorRef}
      initialValue={contents}
      onInit={(evt, editor) => (editorRef.current = editor)}
      init={{
        //@ts-ignore
        selector: 'textarea#full-featured',
        language: 'ko_KR',
        height: 700,
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        menubar: false,
        image_caption: true,
        paste_as_text: true,
        automatic_uploads: true,
        paste_data_images: true,
        file_picker_types: 'file image media',
        images_upload_handler: async function (
          blobInfo,
          success,
          failure,
        ) {
          try {
            // Koscom Cloud에 업로드하기!
            await S3.putObject({
              Bucket: bucket_hiddenbox,
              Key: blobInfo.filename(),
              ACL: 'public-read',
              // ACL을 지우면 전체공개가 되지 않습니다.
              Body: blobInfo.blob(),
            }).promise();
            const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${blobInfo.filename()}`;
            success(imageUrl);
          } catch (error) {
            return false;
          }
        },
        file_picker_callback: function (cb, value, meta) {
          var input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.onchange = async function () {
            //@ts-ignore
            var file = this.files[0];
            const regexp = /(?:\.([^.]+))?$/;
            const ext = regexp.exec(file);
            const imageName = `hb-${moment().format(
              'YYYYMMDDHHmmss',
            )}.${ext}`;

            try {
              // Koscom Cloud에 업로드하기!
              await S3.putObject({
                Bucket: bucket_hiddenbox,
                Key: imageName,
                ACL: 'public-read',
                // ACL을 지우면 전체공개가 되지 않습니다.
                Body: file,
              }).promise();
              const imageUrl = `https://hiddenbox-photo.s3.ap-northeast-2.amazonaws.com/${imageName}`;
              cb(imageUrl, { title: imageName });
            } catch (error) {
              return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
          };
          input.click();
        },
        importcss_append: true,
        mobile: {
          plugins:
            'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable',
        },
        menu: {
          tc: {
            title: 'Comments',
            items: 'addcomment showcomments deleteallconversations',
          },
        },
        toolbar_mode: 'sliding',
        spellchecker_ignore_list: ['Ephox', 'Moxiecode'],
        template_cdate_format:
          '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format:
          '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        content_style: '.mymention{ color: gray; }',
        browser_spellcheck: true,
        block_unsupported_drop: true,
        image_title: true,
        mentions_selector: '.mymention',
        mentions_item_type: 'profile',
        contextmenu:
          'link image imagetools table configurepermanentpen',
        a11y_advanced_options: true,
        skin: useDarkMode ? 'oxide-dark' : 'oxide',
        content_css: useDarkMode ? 'dark' : 'default',
        plugins:
          'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker textpattern noneditable help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable export',
        toolbar:
          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
      }}
    />
  );
};

export default WebEditor;
