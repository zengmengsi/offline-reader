/**
 * Created by zeng on 2017/7/19.
 */
import axios from 'axios'

var instance = axios.create({
  baseURL: 'http://localhost:8081',
  timeout:10000,
});


export {instance as default};
