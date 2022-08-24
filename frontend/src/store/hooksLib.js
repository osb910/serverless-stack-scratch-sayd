import {useState} from 'react';

export const useFormFields = initialState => {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    evt => {
      setValues({
        ...fields,
        [evt.target.id]: evt.target.value,
      });
    },
  ];
};
