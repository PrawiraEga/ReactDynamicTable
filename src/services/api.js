import axios from "axios";

const hitLocal = "http://localhost:8080";
const serverHost = "http://10.239.17.15:8080";
// Initial API Hits, getDB and getTblTarget as one to ease error popup
export async function getDb(options) {
    return Promise.all([
        axios.get(`${serverHost}/getDB`, options).then((res) => res.data),
        //axios.get(`${process.env.REACT_APP_BASE_URL_JDBC}/getTblTarget`, options).then((res) => res.data),
        //axios.get(`${hitLocal}/getDbAnts`, options).then((res) => res.data),
        //axios.get(`${hitLocal}/getTblTarget`, options).then((res) => res.data),
    ]).then(([db]) => {
        return { db: db.databases };
    });
}

export async function getColumn(item) {
    return axios
        .post(`${serverHost}/getColumn`, {
        //.post(`${hitLocal}/getFilterColumn`, {
            db: item.db,
            table: item.table,
        })
        .then((res) => res.data);
}
