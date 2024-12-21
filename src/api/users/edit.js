const userToUpdate = async (id, token) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/userToUpdate?userId=${id}`,
      {
        method: "GET",
        headers: { Authorization: `bearer ${token}` },
      }
    );
    const { message, data } = await response.json();
    if (!response.ok) {
      return { status: 0, message: message };
    }
    return { status: 1, data: data };
  } catch (error) {
    return { status: 0, message: "failed to get" };
  }
};

const editUser = async ({
  userId,
  token,
  name,
  email,
  password,
  accountStatus,
}) => {
  try {
    const response = await fetch("http://localhost:5000/api/editUser", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password, userId, accountStatus }),
    });
    const { message, data } = await response.json();
    if (response.status === 403) return (window.location.href = "/signin");
    if (!response.ok) return { status: 0, message: message };
    return { status: 1, data: data };
  } catch (error) {
    return { status: 0, message: "Failed to update" };
  }
};

export { userToUpdate, editUser };
