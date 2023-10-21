import {INSTANCE} from "./common.js"

export const secured_test = () => 
    INSTANCE.get('sensitive')
  .then(function (response) {
        console.log("accepted")
    })
    .catch(function (error) {
        console.log(error)
    });

export const upload_article_image = (image) =>
    INSTANCE.post("/articles/upload", image, {
        headers: {
          'Content-Type': 'image'
        }
    })

export async function put_article_image(imageFile) {
    INSTANCE.put(`/articles/image/${imageFile.name}`, imageFile, {
        headers: {
            'Content-Type': imageFile.type
        }
    });
}

export async function put_article(name,jsonString) {
    INSTANCE.put(`/articles/post/${name}.json`, jsonString, {
        headers: {
            'Content-Type': "application/json"
        }
    });
}

export async function get_article(name) {
    INSTANCE.get(`/articles/post/${name}.json`);
}