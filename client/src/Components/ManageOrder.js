import classNames from 'classnames/bind';
import styles from '../Styles/ManageOrder.module.scss';
import Pagination from './Pagination';

import { useEffect, useState } from 'react';
import request from '../Config/api';
import ModalEditOrder from '../utils/Modal/ModalEditOrder';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalCancelOrder from '../utils/Modal/CancelOrder';

import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function ManageOrder() {
    const [dataCart, setDataCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [idPro, setIdPro] = useState(0);
    const [address, setAddress] = useState('');
    const [showModalCancelOrder, setShowModalCancelOrder] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const cartResponse = await request.get('api/getallorder');
            setDataCart(cartResponse.data);
            setFilteredOrders(cartResponse.data);
        };

        fetchData();
    }, [showModal, showModalCancelOrder]);

    // Thêm useEffect để lọc đơn hàng theo số điện thoại
    useEffect(() => {
        const filtered = dataCart.filter(order => {
            const orderPhone = order.phone ? order.phone.toString() : '';
            const searchTermCleaned = searchTerm.replace(/^0+/, ''); // Bỏ số 0 ở đầu nếu có
            return orderPhone.includes(searchTermCleaned);
        });
        setFilteredOrders(filtered);
        setPage(1); // Reset về trang 1 khi tìm kiếm
    }, [searchTerm, dataCart]);

    const [page, setPage] = useState(1);
    const productsPerPage = 5;
    const startIndex = (page - 1) * productsPerPage;
    const totalPages = Math.ceil(filteredOrders.length / productsPerPage);
    const currentProducts = filteredOrders.slice(startIndex, startIndex + productsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleShowModalEdit = (id, address1) => {
        setShowModal(!showModal);
        setIdPro(id);
        setAddress(address1);
    };

    const handleShowModalCancelOrder = (item) => {
        setSelectedProduct(item);
        setShowModalCancelOrder(true);
    };

    return (
        <div className={cx('manage-product')}>
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ fontSize: '25px' }}>Quản Lý Đơn Hàng</h2>
                <div className="input-group" style={{ maxWidth: '300px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => {
                            // Chỉ cho phép nhập số
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setSearchTerm(value);
                        }}
                    />
                    {searchTerm && (
                        <button 
                            className="btn btn-outline-secondary" 
                            type="button"
                            onClick={() => setSearchTerm('')}
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered border-primary">
                    <thead style={{ border: 'inherit' }} className="table-light">
                        <tr>
                            <th scope="col">Người Dùng</th>
                            <th scope="col">Số Điện Thoại</th>
                            <th scope="col">Địa Chỉ</th>
                            <th scope="col">Tên Đơn Hàng</th>
                            <th scope="col">Size</th>
                            <th scope="col">Số Lượng</th>
                            <th scope="col">Tổng Giá Tiền</th>
                            <th scope="col">Thời gian đặt hàng</th>
                            <th scope="col">Tình Trạng</th>
                            <th scope="col">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((item) =>
                            item.products.map((item2, index) => (
                                <tr key={item2._id}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={item.products.length}>{item.username}</td>
                                            <td rowSpan={item.products.length}>{`0${item.phone}`}</td>
                                            <td rowSpan={item.products.length}>{item.address}</td>
                                        </>
                                    )}
                                    <td>{item2.nameProduct}</td>
                                    <td>{item2.size || 'N/A'}</td>
                                    <td>{item2.quantity}</td>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={item.products.length}>{item.sumprice.toLocaleString()} đ</td>
                                            <td rowSpan={item.products.length}>
                                                {dayjs(item.createdAt).format('HH:MM DD/MM/YYYY')}
                                            </td>
                                            <td rowSpan={item.products.length}>
                                                {item.tinhtrang ? 'Đã Giao Thành Công' : 'Chuẩn Bị Hàng'}
                                            </td>
                                            <td rowSpan={item.products.length}>
                                                <button
                                                    onClick={() => handleShowModalEdit(item._id)}
                                                    className="btn btn-primary"
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Xác Nhận
                                                </button>
                                                <button
                                                    onClick={() => handleShowModalCancelOrder(item._id)}
                                                    className="btn btn-danger"
                                                >
                                                    Hủy
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="text-center mt-3">
                        <p>Không tìm thấy đơn hàng nào</p>
                    </div>
                )}
                <div className={cx('pagination')}>
                    <Pagination page={page} totalPages={totalPages} handlePageChange={handlePageChange} />
                </div>
            </div>
            <ModalEditOrder show={showModal} setShow={setShowModal} id={idPro} address={address} />
            <ModalCancelOrder show={showModalCancelOrder} setShow={setShowModalCancelOrder} item={selectedProduct} />
        </div>
    );
}

export default ManageOrder;
