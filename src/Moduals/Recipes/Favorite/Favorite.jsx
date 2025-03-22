import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosPrivetInstance, imgURL, RECIPES_URLS } from "../../../Services/Urls/Urls";
import Header from "../../Shared/Header/Header";
import Nodata from "../../Shared/NoData/NoData";
import DeleteComfirmation from "../../Shared/DeleteConfirmations/DeleteConfirmations"; 
import img from "../../../assets/images/categoryHeader.png";
export default function Favorites() {
  const [favList, setFavList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [show, setShow] = useState(false);

  const handleShow = (id) => {
    setShow(true);
    setSelectedId(id);
  };

  const handleClose = () => setShow(false);

  // get all favlist
  const getFavList = async (pageSize = 1000, pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await axiosPrivetInstance.get(RECIPES_URLS.GET_USER_RECIPES, {
        params: {
          pageSize,
          pageNumber
        }
      });
      console.log(data.data);
      setFavList(data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // delete favrecipe
  const deleteFavRecipeItem = async () => {
    setIsDeleting(true);
    try {
      const { data } = await axiosPrivetInstance.delete(RECIPES_URLS.DELETE_FROM_FAVORITES(selectedId));

      toast.success('Recipe Removed From Favorites Successfully');
      handleClose();
      getFavList();
      toast.success('Recipe Removed From Favorites Successfully');
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Failed to remove recipe from list. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    getFavList();
  }, []);

  return (
    <>
      <Header
        title={'Favorites'}
        img={img}
        decsription={'You can now add your items that any user can order it from the Application and you can edit'}
      />

      <div className="container">
        <div className="row g-4 mt-4 mx-1">
          {loading ? (
            <h3>Loading...</h3>
          ) : favList.length > 0 ? (
            favList.map((fav) => (
              <div className="col-md-4" key={fav.id}>
                <div className="card favorite position-relative">
                  <img
                    src={fav.recipe.imagePath ? `${imgURL}/${fav.recipe.imagePath}` : null}
                    className="card-img-top"
                    alt={fav.recipe.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{fav.recipe.name}</h5>
                    <p className="card-text">{fav.recipe.description}</p>
                    <span>{fav.recipe.price} EGP</span>
                  </div>
                  <span
                    className="heart position-absolute bg-white p-2"
                    onClick={() => handleShow(fav.id)}
                  >
                    <i className="fa-solid fa-heart fs-5"></i>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <Nodata />
          )}
        </div>
      </div>

      <DeleteComfirmation
        show={show}
        deleteFuncation={deleteFavRecipeItem}
        isDeleting={isDeleting}
        handleClose={handleClose}
        deleteItem={'From Favorite List'}
      />
    </>
  );
}