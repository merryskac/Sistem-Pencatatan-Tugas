import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

export default function Profile() {
  const [userData, setUserData] = useState({});
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();

  async function getProfile() {
    await axios.get("https://task-be-ashy.vercel.app/profile").then((res) => {
      setUserData(res.data.data[0]);
    });
  }

  function editProfile() {
    setEdit((prev) => !prev);
  }

  function handleChange(e) {
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  function changeProfile() {
    axios.put("https://task-be-ashy.vercel.app/profile", userData).then(() => {
      alert("Profile changed successfully");
      navigate("/");
    });
  }

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <>
      <div className=" ml-72 mt-2.5 mr-6">
        <h1 className="font-bold text-2xl">Profile Settings</h1>
        <div className="flex justify-center mt-6">
          <img
            className="w-52 h-52 rounded-full object-center border border-gray-500"
            src={userData.profile_img}
          />
        </div>
        <div class="flow-root">
          <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            <li class="py-3">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-700 ">Name</p>
                  {!edit ? (
                    <p class=" text-lg font-bold text-gray-900 ">
                      {userData.name}
                    </p>
                  ) : (
                    <input
                      class="p-0 pt-1 appearance-none bg-transparent border-none w-full placeholder-gray-900 text-lg font-bold leading-tight focus:outline-none active:outline-none"
                      type="text"
                      id="name"
                      name="name"
                      placeholder={userData.name}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </li>
            <li class="py-3 ">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-700 ">Email</p>
                  {!edit ? (
                    <p class=" text-lg font-bold text-gray-900 ">
                      {userData.email}
                    </p>
                  ) : (
                    <input
                      class="p-0 pt-1 appearance-none bg-transparent border-none w-full placeholder-gray-900 text-lg font-bold leading-tight focus:outline-none active:outline-none"
                      type="email"
                      id="email"
                      name="email"
                      placeholder={userData.email}
                      onChange={handleChange}
                    />
                  )}
                </div>
              </div>
            </li>
            <li class="py-3 sm:py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-700 ">Gender</p>
                  {!edit ? (
                    <p class=" text-lg font-bold text-gray-900 ">
                      {userData.gender}
                    </p>
                  ) : (
                    <select
                      id="gender"
                      class="appearance-none bg-transparent border-none w-full placeholder-gray-900 text-lg font-bold leading-tight p-0 pt-1 focus:outline-none active:outline-none"
                      onChange={handleChange}
                      value={userData.gender}>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  )}
                </div>
              </div>
            </li>
            <li />
          </ul>
          <div class="flex flex-row gap-3 mt-4 justify-end">
            {!edit ? (
              <button
                type="button"
                class=" w-36 text-green-400 bg-white hover:bg-green-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={editProfile}>
                Edit
              </button>
            ) : (
              <button
                type="button"
                class=" w-36 text-green-400 bg-white hover:bg-green-600 hover:text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={editProfile}>
                Cancel
              </button>
            )}

            <button
              disabled={!edit}
              type="submit"
              class=" w-36 text-white bg-green-400 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
