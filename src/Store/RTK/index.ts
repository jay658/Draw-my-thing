import axios from 'axios'

const getWebsiteURL = async() => {
  try{
    return (await axios.get('api/website')).data
  }catch(err){
    return 'http://localhost:5173/'
  }
}

export default await getWebsiteURL()