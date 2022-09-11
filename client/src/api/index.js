import axios from "axios";

const url = "https://localhost:3000/";

export const fetchEntries = () => axios.get(url);