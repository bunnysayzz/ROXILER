import axios from 'axios';

const URL = `https://roxiler-kb5f.onrender.com/api`;
//https://roxiler-kb5f.onrender.com/api
//http://localhost:5001/api

export const initDatabase = () => axios.get(`${URL}/initialize`);

export const getTransactions = (params) => axios.get(`${URL}/transactions`, { params });

export const getStatistics = (params) => axios.get(`${URL}/statistics`, { params })

export const getBarChart = (params) => axios.get(`${URL}/barchart`, { params });

export const getPieChart = (params) => axios.get(`${URL}/piechart`, { params });

export const getCombinedData = (params) => axios.get(`${URL}/combined`, { params });