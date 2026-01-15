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
import ExportButton from "../../../components/ExportButton/ExportButton";
import { ToastContainer, toast } from "react-toastify";
const Customers = () => {
  let accessToken = JSON.parse(localStorage.getItem("access_token")) || "";
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = (page) => setCurrentPage(page);
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.data.data);
  const isLoading = useSelector((state) => state.data.isLoading);
  const error = useSelector((state) => state.data.error);

  let filteredArray = orders?.data.map((obj) => {
    let { id, createdAt, mobile_phone, recall } = obj;
    return { id, createdAt, mobile_phone, recall };
  });

  useEffect(() => {
    dispatch(fetchData(`orders?page=${currentPage}&limit=8`));
  }, [dispatch, currentPage]);

  const deleteCustomer = (id) => {
    dispatch(deleteData({ apiEndpoint: "orders", id })).then(() => {
      toast.error("Mijoz o'chirildi");
    });
  };

  const updateCustomer = (data, id) => {
    let newData = { recall: data };
    dispatch(updateData({ apiEndpoint: "orders", id, newData, accessToken })).then(() => {
      toast.success("Ma'lumot muvaffaqiyatli o'zgartirildi!");
    });
  };

  if (isLoading) {
    return <Spinner position={"relative"} />;
  }
  if (error) {
    console.log(error);
  }
  return (
    orders &&
    filteredArray && (
      <main className="pt-[60px]">
        <div className="flex-1 py-6">
          <Breadcrumb
            aria-label="Customers page"
            className="px-3 sm:px-4 lg:px-6 xl:px-8 mb-4"
          >
            <Breadcrumb.Item href="/admin" icon={HiHome}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">Mijozlar</Breadcrumb.Item>
          </Breadcrumb>
          <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-medium">Mijozlar</h1>
            <div className="flex gap-3">
              <ExportButton data={filteredArray} filename={"Customers"} />
            </div>
          </div>
          <div className="w-full mx-auto py-6 px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="border mb-6"></div>
            <div className="overflow-x-auto w-full shadow-lg">
              <Table hoverable className="table-auto w-full rounded-lg">
                <TableHead className="border-gray-800">
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Id
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Sana
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Telefon Raqami
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Qayta Aloqa
                  </TableHeadCell>
                  <TableHeadCell className="text-center whitespace-nowrap bg-gray-700 text-white py-4">
                    Delete
                  </TableHeadCell>
                </TableHead>
                <TableBody>
                  {[...orders.data]
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
                          {el?.createdAt.slice(0, 10)}
                        </TableCell>
                        <TableCell className="py-1 text-center whitespace-nowrap">
                          {el.mobile_phone}
                        </TableCell>
                        <TableCell className="py-1 px-4 text-center whitespace-nowrap">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              value={el.recall}
                              className="sr-only peer"
                              checked={el.recall}
                              onChange={() => updateCustomer(!el.recall, el.id)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-700"></div>
                          </label>
                        </TableCell>
                        <TableCell className="py-1 px-4 text-center whitespace-nowrap">
                          {" "}
                          <button
                            type="button"
                            className="focus:outline-none text-white bg-[#FBE9E9] focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-3 dark:focus:ring-red-900"
                            onClick={() => deleteCustomer(el.id)}
                          >
                            <MdDeleteOutline
                              style={{ fill: "#f00", fontSize: "20px" }}
                            />
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
                totalPages={orders?.pagination?.totalPages}
                onPageChange={onPageChange}
                showIcons
              />
            </div>
          </div>
        </div>
        <ToastContainer />
      </main>
    )
  );
};

export default Customers;
