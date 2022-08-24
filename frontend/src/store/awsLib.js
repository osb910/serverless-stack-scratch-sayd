import {Storage} from 'aws-amplify';
import {customAlphabet} from 'nanoid';
import {alphanumeric} from 'nanoid-dictionary';

export const s3Upload = async file => {
  const fileId = customAlphabet(alphanumeric)();
  const filename = `${fileId}-${file.name}`;

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  });

  return stored.key;
};

export const s3Delete = async key => {
  const removed = await Storage.vault.remove(key);
  return removed;
};
