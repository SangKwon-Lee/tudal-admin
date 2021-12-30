import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import { S3 } from '../common/conf/aws';
import React from 'react';
var useDarkMode = window.matchMedia(
  '(prefers-color-scheme: dark)',
).matches;

interface IWebEditorProps {
  editorRef: any;
  contents: string;
  bucket_name: string;
}

const WebEditor: React.FC<IWebEditorProps> = (props) => {
  const { editorRef, contents, bucket_name } = props;
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
        plugins:
          'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap quickbars emoticons advtable export',
        tinydrive_token_provider: 'URL_TO_YOUR_TOKEN_PROVIDER',
        tinydrive_dropbox_app_key: 'YOUR_DROPBOX_APP_KEY',
        tinydrive_google_drive_key: 'YOUR_GOOGLE_DRIVE_KEY',
        tinydrive_google_drive_client_id:
          'YOUR_GOOGLE_DRIVE_CLIENT_ID',
        mobile: {
          plugins:
            'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount textpattern noneditable help formatpainter pageembed charmap quickbars emoticons advtable',
        },
        menu: {
          tc: {
            title: 'Comments',
            items: 'addcomment showcomments deleteallconversations',
          },
        },
        menubar: 'file edit view insert format tools table tc help',
        toolbar:
          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        link_list: [
          { title: 'My page 1', value: 'https://www.tiny.cloud' },
          { title: 'My page 2', value: 'http://www.moxiecode.com' },
        ],
        image_list: [
          { title: 'My page 1', value: 'https://www.tiny.cloud' },
          { title: 'My page 2', value: 'http://www.moxiecode.com' },
        ],
        image_class_list: [
          { title: 'None', value: '' },
          { title: 'Some class', value: 'class-name' },
        ],
        importcss_append: true,
        templates: [
          {
            title: 'New Table',
            description: 'creates a new table',
            content:
              '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
          },
          {
            title: 'Starting my story',
            description: 'A cure for writers block',
            content: 'Once upon a time...',
          },
          {
            title: 'New list with dates',
            description: 'New List with dates',
            content:
              '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
          },
        ],
        template_cdate_format:
          '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format:
          '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        height: 600,
        image_caption: true,
        quickbars_selection_toolbar:
          'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        spellchecker_ignore_list: ['Ephox', 'Moxiecode'],
        tinycomments_mode: 'embedded',
        content_style: '.mymention{ color: gray; }',
        contextmenu:
          'link image imagetools table configurepermanentpen',
        a11y_advanced_options: true,
        skin: useDarkMode ? 'oxide-dark' : 'oxide',
        content_css: useDarkMode ? 'dark' : 'default',
        images_upload_handler: async function (
          blobInfo,
          success,
          failure,
        ) {
          try {
            const timestamp = +new Date(); // timestamp

            await S3.putObject({
              Bucket: bucket_name,
              Key: timestamp + blobInfo.filename(),
              ACL: 'public-read',
              // ACL을 지우면 전체공개가 되지 않습니다.
              Body: blobInfo.blob(),
            }).promise();
            const imageUrl = `https://${bucket_name}.s3.ap-northeast-2.amazonaws.com/${timestamp}${blobInfo.filename()}`;
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
              const timestamp = +new Date(); // timestamp

              await S3.putObject({
                Bucket: bucket_name,
                Key: timestamp + imageName,
                ACL: 'public-read',
                // ACL을 지우면 전체공개가 되지 않습니다.
                Body: file,
              }).promise();
              const imageUrl = `https://${bucket_name}.s3.ap-northeast-2.amazonaws.com/${timestamp}${imageName}`;
              cb(imageUrl, { title: imageName });
            } catch (error) {
              return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
          };
          input.click();
        },
      }}
    />
  );
};

export default WebEditor;
