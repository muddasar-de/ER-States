
import axios from "axios";

export const baseUrl = 'https://xplodev.com/webproj/GetAllPosts.php';

export const fetchApi = async () => {
  const { data } = await axios.get(`${baseUrl}`, {
    headers: {
      'Content-Type': 'application/json'
    },
 
  });
    
  return data;
}