import { API_URL } from "./../config";

const createActionName = (actionAnme) => `ads/${actionAnme}`;
const LOAD_ADS = createActionName("LOAD_ADS");
const LOAD_SINGLE_AD = createActionName("LOAD_SINGLE_AD");
const ADD_AD = createActionName("ADD_AD");
const EDIT_AD = createActionName("EDIT_AD");
const DELETE_AD = createActionName("DELETE_AD");

export const loadAds = (payload) => ({ type: LOAD_ADS, payload });
export const loadSingleAd = (payload) => ({ type: LOAD_SINGLE_AD, payload });
export const addAd = (payload) => ({ type: ADD_AD, payload });
export const editAd = (payload) => ({ type: EDIT_AD, payload });
export const deleteAd = (payload) => ({ type: DELETE_AD, payload });

export const fetchAds = () => async (dispatch) => {
  try {
    const res = await fetch(`${API_URL}api/ads/`);
    if (!res.ok) throw new Error("Błąd pobierania ogłoszeń!");

    const data = await res.json();
    dispatch(loadAds(data.ads));
  } catch (error) {
    console.error("Error fetching ads:", error);
  }
};

export const fetchSingleAd = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${API_URL}api/ads/${id}`);
    if (res.status === 404) {
      console.warn("Ogłoszenie nie istnieje!");
      return;
    }
    if (!res.ok) throw new Error("Błąd pobierania ogłoszenia!");

    const data = await res.json();
    dispatch(loadSingleAd(data));
  } catch (error) {
    console.error("Error fetching single ad:", error);
  }
};

export const createAd = (formData) => async (dispatch) => {
  try {
    const res = await fetch(`${API_URL}api/ads/`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();

    if (res.status === 400) {
      console.warn("Błąd walidacji danych:", data.message);
      return;
    }

    if (!res.ok) throw new Error("Błąd dodawania ogłoszenia!");

    dispatch(addAd(data.ad));
  } catch (error) {
    console.error("Error creating ad:", error);
  }
};

export const updateAd = (id, formData) => async (dispatch) => {
  try {
    const res = await fetch(`${API_URL}api/ads/${id}`, {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });

    const data = await res.json();
    if (res.status === 200) {
      dispatch(editAd(data.ad));
    }
  } catch (error) {
    console.error("Error updating ad:", error);
  }
};

export const removeAd = (id) => async (dispatch) => {
  try {
    const res = await fetch(`${API_URL}api/ads/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.status === 200) {
      dispatch(deleteAd(id));
    }
  } catch (error) {
    console.error("Error deleting ad:", error);
  }
};

export const searchAds = (searchPhrase) => async (dispatch) => {
  try {
    const res = await fetch(`${API_URL}api/ads/search/${searchPhrase}`);
    const data = await res.json();
    dispatch(loadAds(data));
  } catch (error) {
    console.error("Error searching ads:", error);
  }
};

const adsReducer = (statePart = [], action) => {
  switch (action.type) {
    case LOAD_ADS:
      return action.payload;

    case LOAD_SINGLE_AD:
      return statePart.some((ad) => ad._id === action.payload._id)
        ? statePart.map((ad) =>
            ad._id === action.payload._id ? action.payload : ad
          )
        : [...statePart, action.payload];

    case ADD_AD:
      return statePart.some((ad) => ad._id === action.payload._id)
        ? statePart
        : [...statePart, action.payload];

    case EDIT_AD:
      return statePart.map((ad) =>
        ad._id === action.payload._id ? action.payload : ad
      );

    case DELETE_AD:
      return statePart.filter((ad) => ad._id !== action.payload);

    default:
      return statePart;
  }
};
export default adsReducer;
