const axios = require('axios');
(async ()=>{
  try{
    const res = await axios.get('http://localhost:5001/api/debug/insert-food?userId=test-user-123');
    console.log('debug response:', res.data);
  }catch(err){
    if(err.response) console.error('resp error:', err.response.status, err.response.data);
    else console.error('err:', err.message);
  }
})();
