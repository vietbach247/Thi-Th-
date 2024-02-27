const userForm = document.getElementById("userForm");
const userList = document.getElementById("userList");

const instance = axios.create({
  baseURL: "http://localhost:3000/users",
  headers: {
    "content-type": "application/json",
  },
});

let editingUser = null;
const fetchUser = async () => {
  try {
    const { data } = await instance.get();
    data.forEach((item) => {
      const userItem = document.createElement("tr");
      userItem.innerHTML = `
        <td>${item.id}</td>
        <td>${item.email}</td>
        <td>${item.password}</td>
        <td>
          <button onclick="editUser(${item.id})">Sửa</button>
          <button onclick="deleteUser(${item.id})">Xóa</button>
        </td>
      `;
      userList.appendChild(userItem);
    });
  } catch (error) {
    console.error(error);
  }
};

const addUser = async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = {
    email,
    password,
  };

  if (!email || !password) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    if (editingUser) {
      const { data } = await instance.put(`/${editingUser}`, user);
    } else {
      const { data } = await instance.post("/", user);
    }
    userList.innerHTML = "";
    await fetchUser();
  } catch (error) {
    console.error(error);
  }
};

const deleteUser = async (id) => {
  const check = confirm("Xoa nguoi dung ?");
  try {
    if (check) {
      const { data } = await instance.delete(`/${id}`);
      alert("Xoa thanh cong");
    } else {
      alert("Huy xoa thanh cong");
    }
    userList.innerHTML = "";
    await fetchUser();
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (id) => {
  try {
    const { data } = await instance.get(`/${id}`);

    document.getElementById("email").value = data.email;
    document.getElementById("password").value = data.password;

    editingUser = id;
  } catch (error) {
    console.error(error);
  }
};

fetchUser();
userForm.addEventListener("submit", addUser);
