const addUser = async (name, email, password, token) => {
  try {
    const response = await fetch("http://localhost:5000/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    });
    const { data, message } = await response.json();
    if (response.status === 403) return (window.location.href = "/signin");

    if (!response.ok) return { status: 0, message: message };

    return { status: 1, data: data };
  } catch (error) {
    return { status: 0, message: "Failed to add user" };
  }
};
export default addUser;
