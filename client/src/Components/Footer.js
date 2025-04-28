import classNames from 'classnames/bind';
import styles from '../Styles/Footer.module.scss';

import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Footer() {
    const navigate = useNavigate();

    const onPage = (url) => {
        navigate(url);
    };

    return (
        <div className={cx('wrapper')}>
            <main>
                <div className={cx('inner')}>
                    <div className={cx('box-item')}>
                        <ul>
                            <li id={cx('item-title')}>NHÀ PHÂN PHỐI ĐỘC QUYỀN</li>
                            <li>CÔNG TY CHUYÊN GIÀY THỂ THAO</li>
                            <li>Trường Đại học Công nghiệp TP.HCM                            </li>
                            <li>0123456789</li>
                        </ul>
                    </div>

                    <div className={cx('box-item')}>
                        <ul>
                            <li id={cx('item-title')}>DANH MỤC NỔI BẬT</li>
                            <li>Giới thiệu về SHOES STORE</li>
                            <li onClick={() => onPage('/category/giay-nam')}> Giày Nam</li>
                            <li onClick={() => onPage('/category/giay-nu')}> Giày Nữ</li>
                            <li onClick={() => onPage('/category/giay-tre-em')}>Giày Trẻ Em</li>
                        </ul>
                    </div>

                    <div className={cx('box-item')}>
                        <ul>
                            <li id={cx('item-title')}>CHÍNH SÁCH CÔNG TY</li>
                            <li>-Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin của bạn. </li>
                            <li>- Mọi dữ liệu cá nhân sẽ được xử lý theo đúng quy định bảo mật và không chia sẻ với bên thứ ba mà không có sự đồng ý của bạn.</li>
                            <li>- Để biết thêm chi tiết về cách chúng tôi sử dụng thông tin cá nhân, vui lòng tham khảo Chính Sách Bảo Mật của chúng tôi.</li>
                        </ul>
                    </div>

                    <div className={cx('box-item')}>
                        <ul>
                            <li>THÀNH VIÊN</li>
                            <li>21002695 - Nguyễn Phạm Thành Nhân </li>
                            <li>21043301 - Lê Anh Tuấn</li>
                            <li>21003585 - Lê Duy Hoàng Linh</li>
                            <li>21004475 _ Lê Văn Quí</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Footer;
