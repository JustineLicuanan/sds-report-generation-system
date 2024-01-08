import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

import { UserPosition } from '~/enums/user-position';

type Props = { setValue: (value: string) => void; disabled?: boolean };

export function PositionSelect({ setValue, disabled }: Props) {
  const defaultOptions = Object.values(UserPosition).map((value) => ({ value, label: value }));
  type SingleOption = (typeof defaultOptions)[0];

  const [options, setOptions] = useState(() => defaultOptions);
  const [selectValue, setSelectValue] = useState<SingleOption>();

  function handleCreate(value: string) {
    const newOption = { value, label: value } as SingleOption;
    setOptions((prev) => [...prev, newOption]);
    setSelectValue(() => newOption);
    setValue(value);
  }

  return (
    <CreatableSelect
      options={options}
      className="w-[180px]"
      onCreateOption={handleCreate}
      onChange={(newValue) => {
        setSelectValue(() => newValue as SingleOption);
        setValue(newValue?.value ?? '');
      }}
      value={selectValue}
      isDisabled={disabled}
    />
  );
}
