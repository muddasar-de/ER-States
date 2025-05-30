import axios from "axios";

export const baseUrlForSale = 'https://xplodev.com/webproj/propertyforSale.php';
export const baseUrlForRent = 'https://xplodev.com/webproj/propertyforRent.php';
export const baseUrlByID = 'https://xplodev.com/webproj/getpostbyid.php'
export const fetchApiForSale = async () => {
  const { data } = await axios.get(`${baseUrlForSale}`, {
    headers: {
      'Content-Type': 'application/json'
    },
 
  });
    console.log("fetchApi data", data);
  return data;
}
export const fetchApiForRent = async () => {
  const { data } = await axios.get(`${baseUrlForRent}`, {
    headers: {
      'Content-Type': 'application/json'
    },
 
  });
    console.log("fetchApi data", data);
  return data;
}
export const fetchApiByID = async (id) => {
  const { data } = await axios.post(`${baseUrlByID}`,  {
      "post_id": id
    } ,

    {
    headers: {
      'Content-Type': 'application/json'
    },

 
  });
  return data;
}

export const fetchFilteredData = async (url) => { 
  const { data } = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return data;
}
