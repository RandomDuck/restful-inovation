class queryHandler {
  static baseUrl = "http://localhost:4000"
  static async post(target, data) {
    return await httpRequsest('post'.toUpperCase(), data, this.baseUrl + target);
  }
  static async get(target) {
    return await httpRequsest('get'.toUpperCase(), undefined, this.baseUrl + target);
  }
  static async delete(target, data) {
    return await httpRequsest('delete'.toUpperCase(), data, this.baseUrl + target);
  }
  static async put(target, data) {
    return await httpRequsest('put'.toUpperCase(), data, this.baseUrl + target);
  }
  static async patch(target, data) {
    return await httpRequsest('patch'.toUpperCase(), data, this.baseUrl + target);
  }
}

async function httpRequsest(type, data, url) {
  const response = await fetch(url, {
    method: type,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data !== null || data !== undefined ? JSON.stringify(data) : undefined,
  });
  
  try {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error.message);
    return await response.json();
  }
}

module.exports = queryHandler;
