import { useState } from "react";
import { $api } from "../api/api";

export const ImageForm = () => {
  const [file, setFile] = useState<File>();
  const [filePath, setfilePath] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = $api
      .post("/post")
      .then((res) => setfilePath(res.data.url));
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        required
        //@ts-ignore
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        accept="image/*"
      />
      <button>Отпправить картинку</button>
      <span>url до картинки {filePath}</span>
    </form>
  );
};
