import {
    faChartLine,
    faLock,
    faShoppingCart,
    faSignOutAlt,
    faUsers
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavBar.module.scss';

const cx = classNames.bind(styles);

const NavBar = ({ activeTab, onChangeTab }) => {
    const navigate = useNavigate();

    const tabs = [
        { id: 1, icon: faLock, label: 'Quản Lý Sản Phẩm' },
        { id: 2, icon: faShoppingCart, label: 'Quản Lý Đơn Hàng' },
        { id: 3, icon: faUsers, label: 'Quản Lý Người Dùng' },
        { id: 4, icon: faChartLine, label: 'Quản Lý Doanh Thu' },
    ];

    return (
        <div className={cx('navbar')}>
            <h2 className={cx('title')}>Trang Quản Trị!</h2>
            <ul className={cx('menu')}>
                {tabs.map(tab => (
                    <li
                        key={tab.id}
                        className={cx('item', { active: activeTab === tab.id })}
                        onClick={() => onChangeTab(tab.id)}
                    >
                        <FontAwesomeIcon icon={tab.icon} />
                        <span>{tab.label}</span>
                    </li>
                ))}
                <li
                    className={cx('item', 'logout')}
                    onClick={() => {
                        // gọi API logout hoặc xóa token
                        navigate('/logout');
                    }}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>Đăng Xuất</span>
                </li>
            </ul>
        </div>
    );
};

export default NavBar;