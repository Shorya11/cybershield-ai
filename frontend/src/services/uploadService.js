import api from "./api";

export const uploadCsv = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/predict/file", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};