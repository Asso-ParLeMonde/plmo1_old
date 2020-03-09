import {axiosRequest} from "../Admin/components/axiosRequest";

export async function uploadTemporaryImage(imageBlob) {
  const bodyFormData = new FormData();
  bodyFormData.append("image", imageBlob);

  try {
    const requestImage = await axiosRequest({
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      url: `${process.env.REACT_APP_BASE_APP}/plans/image`,
      data: bodyFormData
    });
    return requestImage.data;
  } catch (e) {
    return null;
  }
}
