import { message } from 'antd';

// export const basicUrl = "https://tuyi.sit.fingercrm.cn/shoot-mobile-web/";
export const basicUrl = "https://tuyi.uat.fingercrm.cn/shoot-mobile-web/";

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  message.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default function request(url, options) {
  const defaultOptions = {
    mode: 'cors',
    method: 'POST',
    // credentials: 'include',
  };
  const newOptions = { ...defaultOptions, body: options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if (error.code) {
        message.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        message.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    });
}
