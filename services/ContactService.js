// const BASE_URL = 'https://yourapiendpoint.com';

const sendContactMessage = async (data) => {
  try {
    // const response = await fetch(`${BASE_URL}/messages`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(errorData.message || 'Network response was not ok.');
    // }

    // return await response.json();
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  } catch (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

export default {
  sendContactMessage,
};
