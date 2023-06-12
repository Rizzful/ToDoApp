import axios from "axios";

const instance = axios.create({
    baseURL: "https://6480a016f061e6ec4d499b30.mockapi.io/ai/v1/"
});


export default instance;