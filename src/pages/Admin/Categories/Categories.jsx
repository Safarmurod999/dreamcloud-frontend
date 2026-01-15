import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Spinner from "../../../components/Spinner/Spinner";
import { Breadcrumb, Button, Pagination, Table } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteData, fetchData, updateData } from "../../../utils/slice";
import { HiHome } from "react-icons/hi";
import CategoryModal from "../../../components/CategoryModal/CategoryModal";
import ExportButton from "../../../components/ExportButton/ExportButton";
import { BsPlus } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
const Categories = () => {
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState({
    category_name: "",
    isActive: false,
  });
  let accessToken = JSON.parse(localStorage.getItem("access_token")) || "";
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => setCurrentPage(page);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.data.data);
  const isLoading = useSelector((state) => state.data.isLoading);
  const error = useSelector((state) => state.data.error);

  let filteredArray = categories?.data.map((obj) => {
    let { id, category_name, isActive } = obj;
    return { id, category_name, isActive };
  });
  useEffect(() => {
    dispatch(fetchData(`categories?page=${currentPage}&limit=8`));
  }, [dispatch, currentPage]);

  const deleteCategory = (id) => {
    dispatch(deleteData({ apiEndpoint: "categories", id })).then(() => {
      toast.error("Kategoriya o'chirildi");
    });
  };

  const updateCategory = (data, id) => {
    let newData = { isActive: data };
    dispatch(
      updateData({ apiEndpoint: "categories", id, newData, accessToken })
    ).then(() => {
      toast.success("Kategoriya muvaffaqiyatli o'zgartirildi!");
    });
  };
  if (isLoading) {
    return <Spinner position={"relative"} />;
  }
  if (error) {
    console.log(error);
  }
  return (
    categories &&
    filteredArray && (
      <main className="pt-[60px]">
        <div className="flex-1 py-6">
          <Breadcrumb
            aria-label="Categories page"
            className="px-3 sm:px-4 lg:px-6 xl:px-8 mb-4"
          >
            <Breadcrumb.Item href="/admin" icon={HiHome}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">Kategoriyalar</Breadcrumb.Item>
          </Breadcrumb>
          <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 flex flex-row gap-y-3 justify-between items-start sm:items-center">
            <h1 className="text-3xl font-medium">Kategoriyalar </h1>
            <div className="flex gap-3">
              <button
                className="p-3 w-auto  bg-gray-700 rounded-md flex items-center justify-between md:justify-center"
                onClick={() => setOpenModal(true)}
              >
                <p className="mr-2 text-white hidden md:flex">Qo'shish</p>
                <BsPlus className="fill-white w-[20px] text-xl" />
              </button>
              <ExportButton data={filteredArray} filename={"Categories"} />
            </div>
          </div>
          <div className="w-full mx-auto py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="border mb-6"></div>
            <div className="overflow-x-auto w-full shadow-lg">
              <Table hoverable className="rounded-lg">
                <Table.Head className="border-gray-800">
                  <Table.HeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Id
                  </Table.HeadCell>
                  <Table.HeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Kategoriyalar
                  </Table.HeadCell>
                  <Table.HeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Aktiv
                  </Table.HeadCell>
                  <Table.HeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Actions
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {[...categories.data]
                    .sort((a, b) => a.id - b.id)
                    .map((el, index) => (
                      <Table.Row
                        key={el.id}
                        className="dark:bg-gray-800 border-b border-gray-200"
                      >
                        <Table.Cell className="py-1 text-center whitespace-nowrap">
                          {index + 1}
                        </Table.Cell>
                        <Table.Cell className="py-1 text-center whitespace-nowrap">
                          {el.category_name}
                        </Table.Cell>
                        <Table.Cell className="py-1 text-center whitespace-nowrap">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              value={el.isActive}
                              className="sr-only peer"
                              checked={el.isActive}
                              onChange={() =>
                                updateCategory(!el.isActive, el.id)
                              }
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-700"></div>
                          </label>
                        </Table.Cell>
                        <Table.Cell className="px-4 py-1 flex gap-x-2 justify-center text-center whitespace-nowrap">
                          {" "}
                          <button
                            type="button"
                            className="focus:outline-none text-white bg-[#FBE9E9] focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-3"
                            onClick={() => deleteCategory(el.id)}
                          >
                            <MdDeleteOutline
                              style={{ fill: "#f00", fontSize: "20px" }}
                            />
                          </button>
                          <button
                            className="focus:outline-none text-white bg-[#E6ECEE] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-3"
                            onClick={() => {
                              setOpenModal(true);
                              setCategory(el);
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
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            </div>
            <div className="mx-auto flex justify-center mt-3">
              <Pagination
                className="text-center"
                layout="table"
                currentPage={currentPage}
                totalPages={categories?.pagination?.totalPages}
                onPageChange={onPageChange}
                showIcons
              />
            </div>
          </div>

          <CategoryModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            category={category}
            setCategory={setCategory}
          />
        </div>
        <ToastContainer />
      </main>
    )
  );
};

export default Categories;
