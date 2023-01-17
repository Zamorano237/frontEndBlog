import { useGetPostesQuery } from "./postesApiSlice";
import Poste from "./Poste";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const PostesList = () => {
  useTitle("techpostes: postes List");

  const { username, isManager, isAdmin } = useAuth();

  const {
    data: postes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostesQuery("postesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = postes;

    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(
        (posteId) => entities[posteId].username === username
      );
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((posteId) => <Poste key={posteId} posteId={posteId} />);

    content = (
      <table className="table table--postes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th poste__status">
              Username
            </th>
            <th scope="col" className="table__th poste__created">
              Created
            </th>
            <th scope="col" className="table__th poste__updated">
              Updated
            </th>
            <th scope="col" className="table__th poste__title">
              Title
            </th>
            <th scope="col" className="table__th poste__username">
              Owner
            </th>
            <th scope="col" className="table__th poste__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default PostesList;
