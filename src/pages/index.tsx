import React from "react";

const Index = () => {
  const handleUpload = async (e) => {
    const file = e.target.files;
    const form = new FormData();
    form.append("files", file[0], file[0].name);
    const request = await fetch("/upload", {
      method: "POST",
      body: form,
    });
    const response = await request.json();
    console.log("Response", response);
  };
  return <input type="file" multiple onChange={(e) => handleUpload(e)} />;
};

export default Index;
