import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const ajax = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const resData = await res.json();
    return resData;
    if (!res.ok) throw new Error(`${resData.message} (${res.status})`);
  } catch (err) {
    throw err;
  }
};

/*export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const resData = await res.json();
    if (!res.ok) throw new Error(`${resData.message} (${res.status})`);

    return resData;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const resData = await res.json();
    if (!res.ok) throw new Error(`${resData.message} (${res.status})`);

    return resData;
  } catch (err) {
    throw err;
  }
};*/
