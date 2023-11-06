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

export const test_article = () => 
  instance.get('articles/test2')
  .then(function (response) {
        console.log(response)
        return response.data
    })
    .catch(function (error) {
        console.log(error)
        return error.data
    });


export const sumbitArticleForm = (event) => {
    event.preventDefault()

    let formData = new FormData(event.target);
    let files = document.getElementById('articleFiles').files
    console.log(files)

    let filesArray = Array.from(files);

    filesArray.forEach((file, index) => {
        console.log(`File ${index + 1}: ${file.name}`);
        if (file.name.substring(file.name.length - 3) === '.md') {
            let name = file.name
            // wow this was hard to figure out...
            file = file.slice(0, file.size, "text/markdown")
            formData.append('files', file, name);
        } 
        else {
            formData.append('files', file, file.name );
        }
      });
    
    console.log(formData.headers)
    
    instance.post('articles/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }, data : formData
    }).then(function (response) {
        console.log(response)
        document.getElementById("articleForm").reset();
        return response.data
    })
    .catch(function (error) {
        console.log(error)
        return error.data
    });
}
// export const secured_test = () => 
//     axios.get('/secured')
//         .then(function (response) {
//             console.log("accepted")
//         })
//         .catch(function (error) {
//             console.log(error)
//         });