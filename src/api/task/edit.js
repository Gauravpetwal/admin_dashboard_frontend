//getting the which is updating
const taskToUpade = async (taskId, token) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/taskToUpdate?taskId=${taskId}`,
      {
        method: "GET",
        headers: { Authorization: `bearer ${token} ` },
      }
    );
    const { data } = await response.json();
    if (!response.ok) {
      return { status: 0, message: "failed to get the task" };
    }

    return { status: 1, data };
  } catch (error) {
    return { status: 0, message: "failed to get" };
  }
};

const editTask = async ({token, title, description, content, taskId, expirydate, assignedUserId}) => {
  try {
      const response = await fetch("http://localhost:5000/api/editask", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ title, description, content, taskId,expirydate, assignedUserId}),
    });
    const { message, data } = await response.json();
    if(response.status === 403) return window.location.href = '/signin'
    if (!response.ok) return { staus: 0, message: message };
    
    return {status: 1, data: data, message:message};
  } catch (error) {
    return { status: 0, message: "failed to update" };
  }
};

export {taskToUpade, editTask};
