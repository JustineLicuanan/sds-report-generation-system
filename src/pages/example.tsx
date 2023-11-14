import { CldImage } from 'next-cloudinary';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ResourceType, UploadButton, type OnSuccessUpload } from '~/components/upload-button';

type Inputs = { image?: string | null; imageId?: string | null };

export default function ExamplePage() {
  const exampleForm = useForm<Inputs>();

  const onSuccessUpload: OnSuccessUpload = (result) => {
    exampleForm.setValue('image', result.info?.secure_url);
    exampleForm.setValue('imageId', result.info?.public_id);
  };

  const onSubmit: SubmitHandler<Inputs> = (values) => {
    console.log(values);
  };

  return (
    <>
      <form onSubmit={exampleForm.handleSubmit(onSubmit, (err) => console.log(err))}>
        {/* Displaying uploaded image with react-hook-form */}
        {exampleForm.watch('imageId') && (
          <CldImage
            width="100"
            height="100"
            src={exampleForm.watch('imageId') ?? ''}
            alt="Avatar logo"
            className="m-6 rounded-full"
          />
        )}

        {/* Upload button */}
        <UploadButton
          className="m-6 rounded-md bg-yellow px-8 py-2 text-lg font-medium"
          folder="org-logos"
          resourceType={ResourceType.IMAGE}
          onSuccess={onSuccessUpload}
        >
          Upload
        </UploadButton>

        <div>
          <button type="submit" className="m-6 rounded-md bg-yellow px-8 py-2 text-lg font-medium">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
