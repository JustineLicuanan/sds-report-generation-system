import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { api } from '~/utils/api';

export default function SelectAnnouncement() {
  const getOrgQuery = api.admin.org.get.useQuery();
  const organizationList = getOrgQuery.data ?? [];
  const options = organizationList.map((org) => ({
    value: org.name,
    label: org.name,
  }));
  return (
    <>
      <Select
        closeMenuOnSelect={false}
        options={options}
        isSearchable={true}
        isClearable={true}
        isMulti
        components={makeAnimated()}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: 'green',
            outline: 'none',
            boxShadow: 'none',
          }),
        }}
      />
    </>
  );
}
