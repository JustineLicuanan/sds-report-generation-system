import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';

import { UserPosition } from '~/enums/user-position';

type Props = { controlledValue?: string; setValue: (value: string) => void; disabled?: boolean };

export function PositionSelect({ controlledValue, setValue, disabled }: Props) {
  const defaultOptions = Object.values(UserPosition).map((value) => ({ value, label: value }));
  type SingleOption = (typeof defaultOptions)[0];
  const defaultValue = { value: controlledValue, label: controlledValue } as SingleOption;

  const [options, setOptions] = useState(() => {
    return controlledValue && !Object.values(UserPosition).includes(controlledValue as UserPosition)
      ? [...defaultOptions, defaultValue]
      : defaultOptions;
  });
  const [selectValue, setSelectValue] = useState<SingleOption | undefined>(() => {
    return controlledValue ? defaultValue : undefined;
  });

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
      placeholder="Position..."
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
