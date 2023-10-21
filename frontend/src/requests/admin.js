import { INSTANCE } from "./common.js"


export const secured_test = () => 
  INSTANCE.get('sensitive')
  .then(function (response) {
        console.log("accepted")
    })
    .catch(function (error) {
        console.log(error)
    });
