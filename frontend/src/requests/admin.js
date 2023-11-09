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

export const get_article = (article_id) => instance.get(`articles/${article_id}`)
    
  

export const sumbitArticleForm = (event) => {
    event.preventDefault()

    let formData = new FormData(event.target);

    let elements = document.getElementById("articleForm")
        .querySelectorAll("#article_id, #title, #title_image, #blurb, #articleFiles");

    for (const element of elements) {
        console.log(element.type)

        if (element.files) {
            let files = element.files
            let filesArray = Array.from(files);
            console.log(`number of files: ${filesArray.length}`)
            filesArray.forEach((file, index) => {
                console.log(`file: ${index}`)
                // console.log(`File ${index + 1}: ${file.name}`);
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
        } else if (element.value) { 
            formData.append(element.id, element.value);
        }
          
      };    
    
    // for (var pair of formData.entries()) {
    //     console.log(pair[0]+ ', ' + pair[1]); 
    // }
    
    return instance.post('articles/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }, data : formData
    })
}
export const getArticleList = () => axios.get('/articles/list')


// export const secured_test = () => 
//     axios.get('/secured')
//         .then(function (response) {
//             console.log("accepted")
//         })
//         .catch(function (error) {
//             console.log(error)
//         });