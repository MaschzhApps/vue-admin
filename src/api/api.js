import axios from 'axios';

import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

let base = 'http://localhost:3000';

export const baseUrl = 'http://localhost:3000/crm';

// export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

// export const requestLogin = params => { return axios.post(`${base}/crm/user/login`, params).then(res => res.data); };

// export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

// export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

// export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

// export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

// export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

// export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//客户相关
export const requsetCustomers = params => {
    return Vue.http.get(`${baseUrl}/customer/customers`, params).then(res => {
        return res.data;
    });
};

export const getCustomerById = params => {
    return Vue.http.get(`${baseUrl}/customer/` + params._id, params).then(res => {
        return res.data;
    });
};

export const getCustomersByUser = params => {
    return Vue.http.get(`${baseUrl}/customer/customers/` + params.userId, params).then(res => {
        return res.data;
    });
};


export const createCustomer = params => {
    return Vue.http.post(`${baseUrl}/customer/customer`, params).then(res => {
        return res.data;
    });
};

export const updateCustomer = params => {
    return Vue.http.put(`${baseUrl}/customer/` + params._id, params).then(res => {
        return res.data;
    });
};

export const deleteCustomer = params => {
    return Vue.http.delete(`${baseUrl}/customer/` + params._id).then(res => {
        return res.data;
    });
};

export const batchDeleteCustomer = params => {
    return Vue.http.delete(`${baseUrl}/customer/batch/` + params.ids).then(res => {
        return res.data;
    });
};

//订单相关
export const requestOrders = params => {
    return Vue.http.get(`${baseUrl}/order/orders`).then(res => {
        return res.data;
    });
};

export const getOrdersByProductName = params => {
    return Vue.http.get(`${baseUrl}/order/product/` + params.ProductName).then(res => {
        return res.data;
    });
};

export const getOrdersById = params => {
    return Vue.http.get(`${baseUrl}/order/` + params._id).then(res => {
        return res.data;
    });
};

export const getOrdersByCustomerName = params => {
    return Vue.http.get(`${baseUrl}/order/customer/` + params.customerName).then(res => {
        return res.data;
    });
};

export const getOrdersByStoreName = params => {
    return Vue.http.get(`${baseUrl}/order/store/` + params.storeName).then(res => {
        return res.data;
    });
};

export const createOrder = params => {
    return Vue.http.post(`${baseUrl}/order/order`, params).then(res => {
        return res.data;
    });
};

export const updateOrder = params => {
    return Vue.http.put(`${baseUrl}/order/` + params._id, params).then(res => {
        return res.data;
    });
};

export const deleteOrderById = params => {
    return Vue.http.delete(`${baseUrl}/order/` + params._id).then(res => {
        return res.data;
    });
};

export const batchDeleteOrder = params => {
    return Vue.http.delete(`${baseUrl}/order/batch/` + params.ids).then(res => {
        return res.data;
    });
};