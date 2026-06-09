const axios = require('axios');
(async ()=>{
  try{
    const res = await axios.post('http://localhost:5001/api/test', { hello: true });
    console.log('test response:', res.data);
  }catch(err){
    if(err.response) console.error('resp error:', err.response.status, err.response.data);
    else console.error('err:', err.message);
  }
})();
