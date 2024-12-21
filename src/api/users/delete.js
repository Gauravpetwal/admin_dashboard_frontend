const deleteUser = async (id, token) => {
  try {
    const response = await fetch("http://localhost:5000/api/deleteUser", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token} `,
      },
      body: JSON.stringify({ id }),
    });
    const responseData = await response.json();
    if (response.status === 403) return (window.location.href = "/signin");
    if (!response.ok) return { staus: 0, message: responseData.message };

    return { staus: 1, message: responseData.message };
  } catch (error) {
    return { staus: 0, message: error.message };
  }
};
export default deleteUser;
