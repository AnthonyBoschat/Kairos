import ListsActions from "../ListActions";
import Lists from "../Lists";

// AllListsView - aucun état tasks nécessaire
function AllListsView() {
    return (
        <>
            <ListsActions />
            <Lists />
        </>
    )
}

export default AllListsView