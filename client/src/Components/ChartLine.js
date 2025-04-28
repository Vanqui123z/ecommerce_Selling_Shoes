import classNames from 'classnames/bind';
import styles from '../Styles/ChartLine.module.scss';
import { getWeek } from 'date-fns';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { useEffect, useState } from 'react';
import request from '../Config/api';
import * as XLSX from 'xlsx';

const cx = classNames.bind(styles);

// Register ChartJS element chỉ cần 1 lần
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

function ChartLine() {
    const [dataOrder, setDataOrder] = useState([]);
    const [dataPrice, setDataPrice] = useState(0);
    const [dataPrice2, setDataPrice2] = useState(0);
    const [dataPrice3, setDataPrice3] = useState(0);
    const [dailyData, setDailyData] = useState(0);
    const [weeklyData, setWeeklyData] = useState(0);
    const [monthlyData, setMonthlyData] = useState(0);
    const [productSales, setProductSales] = useState([]);

    useEffect(() => {
        request.get('/api/dataorderuser').then((res) => {
            if (res?.data) {
                setDataOrder(res.data);
            }
        });
    }, []);

    useEffect(() => {
        if (dataOrder.length === 0) return;

        // Làm phẳng mảng dataOrder
        const allItems = dataOrder.flat();

        // Lọc sản phẩm theo từng loại
        const filterType = allItems.filter(item => item.type === 1);
        const filterType2 = allItems.filter(item => item.type === 2);
        const filterType3 = allItems.filter(item => item.type === 3);

        // Tính tổng giá trị doanh thu cho từng loại sản phẩm
        const sumPrice1 = filterType.reduce((total, item) => total + item.price * item.quantity, 0);
        setDataPrice(sumPrice1);

        const sumPrice2 = filterType2.reduce((total, item) => total + item.price * item.quantity, 0);
        setDataPrice2(sumPrice2);

        const sumPrice3 = filterType3.reduce((total, item) => total + item.price * item.quantity, 0);
        setDataPrice3(sumPrice3);

        // Thống kê ngày / tuần / tháng
        const now = new Date();

        const daily = allItems.filter(order => new Date(order.purchaseDate).getDate() === now.getDate()
            && new Date(order.purchaseDate).getMonth() === now.getMonth()
            && new Date(order.purchaseDate).getFullYear() === now.getFullYear());
        const weekly = allItems.filter(order => getWeek(new Date(order.purchaseDate)) === getWeek(now)
            && new Date(order.purchaseDate).getFullYear() === now.getFullYear());
        const monthly = allItems.filter(order => new Date(order.purchaseDate).getMonth() === now.getMonth()
            && new Date(order.purchaseDate).getFullYear() === now.getFullYear());

        setDailyData(daily.length);
        setWeeklyData(weekly.length);
        setMonthlyData(monthly.length);

        // Tính tổng số lượng bán ra của từng sản phẩm
        const productMap = {}; // Dùng đối tượng để lưu trữ sản phẩm và số lượng
        allItems.forEach((item) => {
            if (productMap[item.nameProduct]) {
                productMap[item.nameProduct] += item.quantity; // Cộng thêm số lượng nếu sản phẩm đã có
            } else {
                productMap[item.nameProduct] = item.quantity; // Nếu chưa có, khởi tạo số lượng
            }
        });

        // Chuyển dữ liệu sản phẩm thành mảng
        const productSales = Object.keys(productMap).map(nameProduct => ({
            nameProduct,
            quantity: productMap[nameProduct],  // Sử dụng quantity riêng biệt cho mỗi sản phẩm
        }));

        setProductSales(productSales);  // Cập nhật state với dữ liệu sản phẩm đã tính toán
    }, [dataOrder]);


    const pieData = {
        labels: ['Giày Nam', 'Giày Nữ', 'Giày Trẻ Em'],
        datasets: [
            {
                label: 'Doanh Thu Đã Bán',
                data: [dataPrice, dataPrice2, dataPrice3],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const barData = {
        labels: productSales.map(item => item.nameProduct), // Hiển thị tên sản phẩm
        datasets: [
            {
                label: 'Số Lượng Bán',
                data: productSales.map(item => item.quantity), // Hiển thị số lượng bán
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };
    const lineData = () => {
        // Tạo một mảng chứa số lượng bán cho mỗi ngày trong tháng
        const dailySales = Array(31).fill(0);  // Giả sử tháng có 31 ngày

        // Duyệt qua tất cả các đơn hàng để thống kê số lượng bán theo ngày
        dataOrder.flat().forEach(order => {
            const day = new Date(order.purchaseDate).getDate();
            dailySales[day - 1] += order.quantity; // Cộng số lượng bán cho ngày tương ứng
        });

        return {
            labels: Array.from({ length: 31 }, (_, i) => i + 1), // Tạo label từ 1 đến 31
            datasets: [
                {
                    label: 'Số Lượng Bán Theo Ngày',
                    data: dailySales,
                    fill: false,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.4,
                },
            ],
        };
    };

    const options = {
        scales: {
            y: {
                ticks: {
                    stepSize: 1,  // Đảm bảo trục Y hiển thị số nguyên
                    beginAtZero: false,  // Không bắt đầu từ 0
                    min: 10,  // Thiết lập giá trị tối thiểu của trục Y là 10
                },
            },
        },
    };
    const exportToExcel = () => {
        const exportData = dataOrder.flat().map(order => ({
            'Tên Sản Phẩm': order.nameProduct,
            'Số Lượng Bán': order.quantity,
            'Ngày Mua': new Date(order.purchaseDate).toLocaleDateString(),
            'Size': order.size,

        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ChiTietBanHang');
        XLSX.writeFile(wb, 'ChiTiet_BanHang.xlsx');
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Quản Lý Doanh Thu</h2>
            <div className="d-flex justify-content-end mb-3">
                <button className='btn btn-success' onClick={exportToExcel}>Xuất Excel</button>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card p-3 shadow-sm">
                        <h5 className="text-center">Biểu Đồ Pie - Doanh Thu</h5>
                        <Pie data={pieData} options={options} />
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card p-3 shadow-sm">
                        <h5 className="text-center">Biểu Đồ Bar - Số Lượng Sản Phẩm</h5>
                        <Bar data={barData} options={options} />
                    </div>
                </div>

                <div className="col-12 mb-4">
                    <div className="card p-3 shadow-sm">
                        <h5 className="text-center">Biểu Đồ Line - Số Lượng Bán Theo Ngày</h5>
                        <Line data={lineData()} options={options} />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ChartLine;
