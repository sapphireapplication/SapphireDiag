
//const API_ADDRESS = "http://localhost:3030";
//const API_ADDRESS = "http://pipeline.mdcms.ch:3030";
//const API_ADDRESS = "http://172.20.70.18:50000";
//const params = useParams();
let API_ADDRESS

var href = window.location.href
var res = href.split("/");
console.log('result now',res[3])
if(res[3] == 'as400'){
    API_ADDRESS = "http://172.20.70.18:50000";
}
else{
     API_ADDRESS = "http://localhost:3030";
}

export default API_ADDRESS;
