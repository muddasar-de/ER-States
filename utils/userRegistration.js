
import axios from "axios";

export const userLoginAPI = async (email, password) => {
 
    const response = await axios.post(
      'https://xplodev.com/webproj/loginnew.php',
      {
        email,
        password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = response.data;
    return data

}


export const userRegisterAPI = async (name, email, password) => {
  const response = await axios.post(
    'https://xplodev.com/webproj/insert_user.php',
    {
      "fullname": name,
      "email": email,
      "password":password,
      "role": 'user' // Assuming a default role for new users
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  
  const data = response.data;
  return data;
}