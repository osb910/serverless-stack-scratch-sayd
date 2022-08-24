import config from '../../config';

const maxFileSize = config.MAX_ATTACHMENT_SIZE / (1024 * 1024);

const data = {
  en: {
    create: 'Create',
    attachment: 'Attachment',
    save: 'Save',
    delete: 'Delete',
    delConfirmation: 'Are you sure you want to delete this note?',
    largeFileSize: `Please pick a file smaller than ${maxFileSize} MB.`,
    noChange: 'Nothing new to save.',
  },
  ar: {
    create: 'أنشئ',
    attachment: 'ملف',
    save: 'احفظ',
    delete: 'احذف',
    delConfirmation: 'أواثق أنك تريد حذف المفكرة؟',
    largeFileSize: `فضلًا أرفق ملفًّا لا يجاوز ${maxFileSize.toLocaleString(
      'ar-EG'
    )} مب.`,
    noChange: 'ما أتيت بجديد يُحفظ.',
  },
};

export default data;
