import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Spinner from "../../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { deleteData, fetchData, updateData } from "../../../utils/slice";
import { Breadcrumb, Button, Pagination, Table } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { AdminAddresses } from "../../../components";
import ExportButton from "../../../components/ExportButton/ExportButton";
import { BsPlus } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";

const Addresses = () => {
  const [address, setAddress] = useState({
    address: "",
    description: "",
    location: "",
    image: "",
    state: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => setCurrentPage(page);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.data.data);
  const isLoading = useSelector((state) => state.data.isLoading);
  const error = useSelector((state) => state.data.error);

  let filteredArray = addresses?.data.map((obj) => {
    let { id, address, location, description } = obj;
    return { id, address, location, description };
  });

  useEffect(() => {
    dispatch(fetchData(`addresses?page=${currentPage}&limit=8`));
  }, [dispatch, currentPage]);

  const deleteAddress = (id) => {
    dispatch(deleteData({ apiEndpoint: "addresses", id })).then(() => {
      toast.error("Manzil o'chirildi");
    });
  };

  if (isLoading) {
    return <Spinner position={"relative"} />;
  }
  if (error) {
    console.log(error);
  }
  return (
    addresses &&
    filteredArray && (
      <main className="pt-[60px]">
        <div className="flex-1 py-6">
          <Breadcrumb
            aria-label="Orders page"
            className="px-3 sm:px-4 lg:px-6 xl:px-8 mb-4"
          >
            <Breadcrumb.Item href="/admin" icon={HiHome}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">Manzillar</Breadcrumb.Item>
          </Breadcrumb>
          <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 flex flex-row gap-y-3 justify-between items-start sm:items-center">
            <h1 className="text-3xl font-medium">Manzillar </h1>
            <div className="flex gap-3">
              <button
                className="p-3 w-auto  bg-gray-700 rounded-md flex items-center justify-between md:justify-center"
                onClick={() => setOpenModal(true)}
              >
                <p className="mr-2 text-white hidden md:flex">Qo'shish</p>
                <BsPlus className="fill-white w-[20px] text-xl" />
              </button>
              <ExportButton data={filteredArray} filename={"Addresses"} />
            </div>
          </div>
          <div className="w-full mx-auto py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="border mb-6"></div>
            <div className="overflow-x-auto shadow-lg">
              <Table hoverable className="rounded-lg">
                <Table.Head className="border-gray-800">
                  <Table.HeadCell className="bg-gray-700 text-white py-4 text-center  whitespace-nowrap">
                    Id
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-gray-700 text-white py-4 text-center  whitespace-nowrap">
                    Manzil
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-gray-700 text-white py-4 text-center  whitespace-nowrap">
                    Matn
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-gray-700 text-white py-4 text-center  whitespace-nowrap">
                    Location
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-gray-700 text-white py-4 text-center  whitespace-nowrap">
                    Edit
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {[...addresses.data]
                    .sort((a, b) => a.id - b.id)
                    .map((el) => (
                      <Table.Row
                        key={el.id}
                        className="dark:bg-gray-800 border-b border-gray-200"
                      >
                        <Table.Cell className="py-1 text-center  whitespace-nowrap whitespace-nowrap font-medium text-gray-900">
                          {el.id}
                        </Table.Cell>
                        <Table.Cell className="py-1 text-center  whitespace-nowrap text-ellipsis overflow-hidden">
                          {el.address}
                        </Table.Cell>
                        <Table.Cell className="py-1 text-center  whitespace-nowrap text-ellipsis overflow-hidden">
                          {el?.description}
                        </Table.Cell>
                        <Table.Cell className="py-1 text-center  whitespace-nowrap max-w-[250px] text-ellipsis overflow-hidden">
                          {el?.location}
                        </Table.Cell>
                        <Table.Cell className="py-1 text-center  whitespace-nowrap flex justify-center gap-2 px-4">
                          {" "}
                          <button
                            type="button"
                            className="focus:outline-none text-white bg-[#FBE9E9] focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-3 dark:bg-red-600 dark:hover:bg-[#FBE9E9] dark:focus:ring-red-900"
                            onClick={() => deleteAddress(el.id)}
                          >
                            <MdDeleteOutline
                              style={{ fill: "#f00", fontSize: "20px" }}
                            />
                          </button>
                          <button
                            className="focus:outline-none text-white bg-[#E6ECEE] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-3"
                            onClick={() => {
                              setOpenModal(true);
                              setAddress(el);
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
                totalPages={addresses?.pagination?.totalPages}
                onPageChange={onPageChange}
                showIcons
              />
            </div>
          </div>
          <AdminAddresses
            address={address}
            openModal={openModal}
            setAddress={setAddress}
            setOpenModal={setOpenModal}
          />
        </div>
        <ToastContainer />
      </main>
    )
  );
};

export default Addresses;
