import Api from './Api';

// send catched image to the backend
export const getPrediction = async (image) => {
    const formData = new FormData();
    formData.append('image', image);

    try {
        const response = await Api().post('/predict', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
}