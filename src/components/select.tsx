import { OrganizationCategory, type User } from '@prisma/client';
import { useState } from 'react';
import Select from 'react-select';

export default function SelectAnnouncement({ organization }: { organization: User[] }) {
  const options = organization.map((org) => ({
    value: org.name,
    label: org.name,
    category: org.category,
  }));

  const orgCategory = [
    { name: 'StuGovBody', category: OrganizationCategory.STUDENT_GOVERNING_BODY },
    { name: 'AcadOrg', category: OrganizationCategory.ACADEMIC_ORGANIZATION },
    { name: 'NonAcadOrg', category: OrganizationCategory.NON_ACADEMIC_ORGANIZATION },
  ];
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleButtonClick = (category: string) => {
    const filteredOptions = options.filter((option) => option.category === category);
    const newSelectedValues = filteredOptions.map((option) => option.value);
    setSelectedValues(newSelectedValues);
  };

  return (
    <>
      <Select
        options={options}
        value={options.filter((option) => selectedValues.includes(option.value))}
        onChange={(selectedOptions) =>
          setSelectedValues(selectedOptions.map((option) => option.value))
        }
        closeMenuOnSelect={false}
        isSearchable={true}
        isClearable={true}
        isMulti
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            borderColor: 'green',
            outline: 'none',
            boxShadow: 'none',
          }),
        }}
      />
      <div className="flex gap-2">
        {orgCategory.map((org, index) => (
          <button
            key={index}
            type="button"
            className="my-2 w-1/3 cursor-pointer rounded-md bg-gray py-2 text-lg font-medium hover:bg-yellow"
            onClick={() => handleButtonClick(org.category)}
          >
            {org.name}
          </button>
        ))}
      </div>
    </>
  );
}
