/** @format */

import NewProductForm from './NewProduct';
import { useGetUsersQuery } from '../users/usersApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';

const NewProduct = () => {
  useTitle('Store: New product');

  const { users } = useGetUsersQuery('usersList', {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <PulseLoader color={'#FFF'} />;

  const content = <NewProductForm users={users} />;

  return content;
};
export default NewProduct;
