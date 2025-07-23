document.getElementById("productForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // You can inspect if the files are appended properly:
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const res = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTE1ZWQzNGZjNWM1NWQ5OTAyYmY1YyIsImVtYWlsIjoiYW1hbmphbmdpZDc4NDdAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUzMjU4ODEwLCJleHAiOjE3NTMyNTk3MTB9.5saV7OnSryAXdEPV4eO-Lz0Hr8Y6pYF7-WfrBLhQH70`, // Replace with valid token
      },
      body: formData
    });

    const data = await res.json();
    document.getElementById("response").innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    console.error(err);
    document.getElementById("response").innerText = "Upload failed.";
  }
});
