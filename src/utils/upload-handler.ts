import { UploadApiResponse } from 'cloudinary';

import { env } from '~/env.mjs';

type Props = { file: string; folder: string };

export async function uploadHandler({ file, folder }: Props) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', env.NEXT_PUBLIC_UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = (await res.json()) as UploadApiResponse;
    return data;
  } catch (err) {
    throw err;
  }
}
