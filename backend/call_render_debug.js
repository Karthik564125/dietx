(async()=>{
  try{
    const url = 'https://dietx-qtjz.onrender.com/api/debug/insert-food?userId=render-test-1';
    const res = await fetch(url);
    const text = await res.text();
    console.log('status', res.status);
    console.log(text);
  }catch(err){
    console.error('fetch error', err);
  }
})();
