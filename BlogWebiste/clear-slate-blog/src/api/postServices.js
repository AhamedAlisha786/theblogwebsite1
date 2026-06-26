import axios from 'axios';

import axiosInstance from './axiosInstances';

// const API_URL = 'http://localhost:8080/api/posts';



export const addPost = async({title,category,coverImage,content,authorId})=>{
    try{
        const response = await axiosInstance.post('/api/posts/create', { title:title, category:category, coverImage:coverImage, content:content, authorId:authorId });
        return response.data;
    }
    catch(error){
        console.error("Error adding post:", error);
        throw error;
    }
};

export const getData = async()=>{
    try{
        const response = await axiosInstance.get('/api/posts/getAll');
        return response.data;
    }
    catch(error){
        console.error("Error getting email", error);
        throw error;
    }
}

export const getUserData = async()=>{
    try{
        const userId = localStorage.getItem("currentUser_id");
        const response = await axiosInstance.get(`/api/posts/${userId}`);
        return response.data;
    }
    catch(error){
        console.error("the error:",error);
        throw error;
    }
}