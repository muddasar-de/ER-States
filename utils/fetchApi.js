import axios from "axios";

export const baseUrl = 'https://bayut.p.rapidapi.com';

export const fetchApi = async (url) => {
  const { data } = await axios.get((url), {
    headers: {
      'x-rapidapi-host': 'bayut.p.rapidapi.com',
      'x-rapidapi-key': "539b35b7b0msh66c6bec0a075e30p1acf5ejsn42578244fe27" ,
    },
  });
    
  return data;
}