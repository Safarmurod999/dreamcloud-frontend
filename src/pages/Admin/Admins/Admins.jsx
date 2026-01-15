import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Spinner from "../../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { deleteData, fetchData, updateData } from "../../../utils/slice";
import {
  Breadcrumb,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { AdminModal } from "../../../components";
import ExportButton from "../../../components/ExportButton/ExportButton";
import { BsPlus } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
const Admins = () => {
  const [openModal, setOpenModal] = useState(false);
  const [adminData, setAdminData] = useState({
    username: "",
    password: "",
    email: "",
    isSuperAdmin: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => setCurrentPage(page);
  let accessToken = JSON.parse(localStorage.getItem("access_token")) || "";

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchData(`admin?page=${currentPage}&limit=10`));
  }, [dispatch, currentPage]);
  const admin = useSelector((state) => state.data.data);
  const isLoading = useSelector((state) => state.data.isLoading);
  const error = useSelector((state) => state.data.error);

  const deleteAdmin = (id) => {
    dispatch(deleteData({ apiEndpoint: "admin", id })).then(() => {
      toast.error("Admin o'chirildi");
    });
  };

  const updateAdmin = (data, id) => {
    let newData = { isSuperAdmin: data };
    dispatch(updateData({ apiEndpoint: "admin", id, newData, accessToken })).then(() => {
      toast.success("Ma'lumot muvaffaqiyatli o'zgartirildi!");
    });
    localStorage.setItem("isSuperAdmin", JSON.stringify(newData.isSuperAdmin));
  };

  if (isLoading) {
    return <Spinner position={"relative"} />;
  }
  let filteredArray = admin?.data.map((obj) => {
    let { id, username, password, createdAt, isSuperAdmin } = obj;
    return { id, username, password, createdAt, isSuperAdmin };
  });
  if (error) {
    console.log(error);
  }
  return (
    admin &&
    filteredArray && (
      <main className="pt-[60px]">
        <div className="flex-1 py-6">
          <Breadcrumb
            aria-label="admin page"
            className="px-3 sm:px-4 lg:px-6 xl:px-8 mb-4"
          >
            <Breadcrumb.Item href="/admin" icon={HiHome}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">Adminlar</Breadcrumb.Item>
          </Breadcrumb>
          <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 flex flex-row gap-y-3 justify-between items-start sm:items-center">
            <h1 className="text-3xl font-medium">Adminlar</h1>
            <div className="flex gap-3">
              <button
                className="p-3 w-auto  bg-gray-700 rounded-md flex items-center justify-between md:justify-center"
                onClick={() => setOpenModal(true)}
              >
                <p className="mr-2 text-white hidden md:flex">Qo'shish</p>
                <BsPlus className="fill-white w-[20px] text-xl" />
              </button>
              <ExportButton data={filteredArray} filename={"Admins"} />
            </div>
          </div>
          <div className="w-full mx-auto py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="border mb-6"></div>
            <div className="overflow-x-auto w-full shadow-lg">
              <Table hoverable className="rounded-lg">
                <TableHead className="border-gray-800">
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Id
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Username
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Paroli
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Email
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Tizimga qo'shilgan sana
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    SuperAdmin
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Delete
                  </TableHeadCell>
                </TableHead>
                <TableBody>
                  {[...admin.data]
                    .sort((a, b) => a.id - b.id)
                    .map((el) => (
                      <TableRow
                        key={el.id}
                        className=" border-b border-gray-200"
                      >
                        <TableCell className="py-1 text-center whitespace-nowrap">
                          {el.id}
                        </TableCell>
                        <TableCell className="py-1 text-center whitespace-nowrap">
                          {el.username}
                        </TableCell>
                        <TableCell className="py-1 text-center whitespace-nowrap">
                          {el.password}
                        </TableCell>
                        <TableCell className="py-1 text-center whitespace-nowrap">
                          {el.email}
                        </TableCell>
                        <TableCell className="py-1 text-center whitespace-nowrap">
                          {el.createdAt}
                        </TableCell>
                        <TableCell className="py-1 px-4 text-center whitespace-nowrap">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              value={el.isSuperAdmin}
                              className="sr-only peer"
                              checked={el.isSuperAdmin}
                              onChange={() =>
                                updateAdmin(!el.isSuperAdmin, el.id)
                              }
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-700"></div>
                          </label>
                        </TableCell>
                        <TableCell className="py-1 px-4 flex justify-center gap-2 text-center whitespace-nowrap">
                          {" "}
                          <button
                            type="button"
                            className="focus:outline-none text-white bg-[#FBE9E9] focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-3 dark:focus:ring-red-900"
                            onClick={() => deleteAdmin(el.id)}
                          >
                            <MdDeleteOutline
                              style={{ fill: "#f00", fontSize: "20px" }}
                            />
                          </button>
                          <button
                            className="focus:outline-none text-white bg-[#E6ECEE] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-3"
                            onClick={() => {
                              setOpenModal(true);
                              setAdminData(el);
                            }}
                          >
                            <svg
                              width="21"
                              height="21"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_452_355)">
                                <path
                                  d="M2.625 15.2775V17.9375C2.625 18.1825 2.8175 18.375 3.0625 18.375H5.7225C5.83625 18.375 5.95 18.3312 6.02875 18.2437L15.5837 8.69749L12.3025 5.41624L2.75625 14.9625C2.66875 15.05 2.625 15.155 2.625 15.2775ZM18.1212 6.15999C18.4625 5.81874 18.4625 5.26749 18.1212 4.92624L16.0738 2.87874C15.7325 2.53749 15.1812 2.53749 14.84 2.87874L13.2388 4.47999L16.52 7.76124L18.1212 6.15999Z"
                                  fill="black"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_452_355">
                                  <rect width="21" height="21" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
            <div className="mx-auto flex justify-center mt-3">
              <Pagination
                className="text-center"
                layout="table"
                currentPage={currentPage}
                totalPages={admin?.pagination?.totalPages}
                onPageChange={onPageChange}
                showIcons
              />
            </div>
          </div>

          <AdminModal
            admin={adminData}
            setAdminData={setAdminData}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </div>
        <ToastContainer />
      </main>
    )
  );
};

export default Admins;
