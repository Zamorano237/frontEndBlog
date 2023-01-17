import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetPostesQuery } from "./postesApiSlice";
import { memo } from "react";

const Poste = ({ posteId }) => {
  const { poste } = useGetPostesQuery("postesList", {
    selectFromResult: ({ data }) => ({
      poste: data?.entities[posteId],
    }),
  });

  const navigate = useNavigate();

  if (poste) {
    const created = new Date(poste.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(poste.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });

    const handleEdit = () => navigate(`/dash/postes/${posteId}`);

    return (
      <tr className="table__row">
        <td className="table__cell poste__status">
          {poste.completed ? (
            <span className="poste__status--completed">Completed</span>
          ) : (
            <span className="poste__status--open">Open</span>
          )}
        </td>
        <td className="table__cell poste__created">{created}</td>
        <td className="table__cell poste__updated">{updated}</td>
        <td className="table__cell poste__title">{poste.title}</td>
        <td className="table__cell poste__username">{poste.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedPoste = memo(Poste);

export default memoizedPoste;
