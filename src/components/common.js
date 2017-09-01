/**
 * Created by zeng on 2017/7/19.
 */
import axios from 'axios'

var instance = axios.create({
  // baseURL: 'http://localhost:8081',
  // baseURL:'http://59.110.218.46:8081',
  baseURL:'https://www.aisbi.com',
  // timeout:10000,
});


export {instance as default};
