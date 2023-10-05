import axios from "axios";

export const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 1000,
  });


export const secured_test = () => 
  instance.get('sensitive')
  .then(function (response) {
        console.log("accepted")
    })
    .catch(function (error) {
        console.log(error)
    });

// export const secured_test = () => 
//     axios.get('/secured')
//         .then(function (response) {
//             console.log("accepted")
//         })
//         .catch(function (error) {
//             console.log(error)
//         });