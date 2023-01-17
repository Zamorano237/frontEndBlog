import { useParams } from "react-router-dom";
import EditPosteForm from "./EditPosteForm";
import { useGetPostesQuery } from "./postesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditPoste = () => {
  useTitle("techpostes: Edit poste");

  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth();

  const { poste } = useGetPostesQuery("postesList", {
    selectFromResult: ({ data }) => ({
      poste: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!poste || !users?.length) return <PulseLoader color={"#FFF"} />;

  if (!isManager && !isAdmin) {
    if (poste.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditPosteForm poste={poste} users={users} />;

  return content;
};
export default EditPoste;
