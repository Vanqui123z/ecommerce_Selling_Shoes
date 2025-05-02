import classNames from 'classnames/bind';
import styles from '../Styles/Header.module.scss';
import request, { requestLogout } from '../Config/api';
import useDebounce from '../hooks/useDebounce';

import logo from '../assests/imgs/logo.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faCartPlus,
    faSearch,
    faUserCircle,
    faSignOutAlt,
    faHome,
    faTshirt,
    faChild
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useStore } from '../hooks/useStore';

const cx = classNames.bind(styles);

function Header() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [dataSearch, setDataSearch] = useState([]);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const userDropdownRef = useRef(null);
    const searchRef = useRef(null);

    const navigate = useNavigate();
    const handleShowMenu = () => {
        setShow(!show);
    };

    const { dataUser, dataCart } = useStore();

    const debounce = useDebounce(searchValue, 500);

    useEffect(() => {
        try {
            if (searchValue === '') {
                return;
            }

            request.get('/api/search', { params: { nameProduct: debounce } }).then((res) => setDataSearch(res.data));
        } catch (error) { }
    }, [debounce, searchValue]);

    // Xử lý đóng dropdown khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchExpanded(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userDropdownRef, searchRef]);

    const handleLogOut = async () => {
        try {
            await requestLogout();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
    };

    const toggleSearch = () => {
        setSearchExpanded(!searchExpanded);
        if (!searchExpanded) {
            setTimeout(() => {
                const inputElement = document.querySelector(`.${cx('search-input')}`);
                if (inputElement) inputElement.focus();
            }, 100);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('top-bar')}>
                <div className={cx('container')}>

                    <div className={cx('main-header')}>
                        <div className={cx('container')}>
                            <div className={cx('menu-toggle')}>
                                <button onClick={handleShowMenu}>
                                    <FontAwesomeIcon icon={faBars} />
                                </button>
                            </div>

                            <Link to={'/'} className={cx('logo-container')}>
                                <img id={cx('logo')} src={logo} alt="Logo" />
                            </Link>


                        </div>
                    </div>
                    {dataUser?._id ? (
                        <div className={cx('welcome-text')}>
                            Xin chào, {dataUser.name || 'Khách hàng'}!
                        </div>
                    ) : (
                        <div className={cx('welcome-text')}>
                            Chào mừng đến với cửa hàng giày
                        </div>
                    )}

                    <div className={cx('top-actions')}>
                        <div className={cx('header-actions')}>
                            <div className={cx('search-container')} ref={searchRef}>
                                <button
                                    className={cx('search-toggle', { 'expanded': searchExpanded })}
                                    onClick={toggleSearch}
                                >
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>

                                {searchExpanded && (
                                    <div className={cx('search-expanded')}>
                                        <input
                                            className={cx('search-input')}
                                            placeholder="Tìm Kiếm Sản Phẩm..."
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            value={searchValue}
                                        />

                                        {searchValue.length > 0 && (
                                            <div className={cx('result')}>
                                                {dataSearch.map((item) => (
                                                    <Link to={`/product/${item._id}/${item.slug}`} key={item._id} onClick={() => setSearchExpanded(false)}>
                                                        <div className={cx('form-result')}>
                                                            {dataSearch.length === 1 && item.name === 'Không Tìm Thấy Sản Phẩm !!!' ? (
                                                                <img src={`${item?.img}`} alt="" />
                                                            ) : (
                                                                <img src={`${process.env.REACT_APP_IMG}/${item?.img[0]}`} alt="" />
                                                            )}
                                                            <div className={cx('product-info')}>
                                                                <span className={cx('product-name')}>{item.name}</span>
                                                                {dataSearch.length === 1 && item.name === 'Không Tìm Thấy Sản Phẩm !!!' ? (
                                                                    <></>
                                                                ) : (
                                                                    <span className={cx('product-price')}>{item.price.toLocaleString()} đ</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {dataUser?._id && (
                                <Link to={'/cart'} className={cx('cart-icon')}>
                                    <FontAwesomeIcon icon={faCartPlus} />
                                    {dataCart[0]?.products.length > 0 && (
                                        <span className={cx('cart-badge')}>{dataCart[0]?.products.length}</span>
                                    )}
                                </Link>
                            )}
                        </div>
                        {dataUser?._id ? (
                            <div className={cx('user-dropdown')} ref={userDropdownRef}>
                                <button className={cx('user-btn')} onClick={toggleUserDropdown}>
                                    <FontAwesomeIcon icon={faUserCircle} />
                                    <span>Tài khoản</span>
                                </button>

                                {showUserDropdown && (
                                    <div className={cx('dropdown-menu')}>
                                        <Link to={'/info'} className={cx('dropdown-item')}>
                                            Thông Tin Người Dùng
                                        </Link>
                                        {dataUser.isAdmin && (
                                            <Link to={'/admin'} className={cx('dropdown-item', 'admin-link')}>
                                                Trang Quản Trị
                                            </Link>
                                        )}
                                        <button className={cx('dropdown-item', 'logout-item')} onClick={handleLogOut}>
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            <span>Đăng Xuất</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to={'/login'} className={cx('login-btn')}>
                                Đăng Nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className={cx('navigation')}>
                <div className={cx('container')}>
                    <div className={cx('nav-items')}>
                        <Link to={'/'} className={cx('nav-item')}>
                            <FontAwesomeIcon icon={faHome} />
                            <span>Trang Chủ</span>
                        </Link>
                        <Link to={'/category'} className={cx('nav-item')}>
                            <FontAwesomeIcon icon={faTshirt} />
                            <span>Tất Cả Sản Phẩm</span>
                        </Link>
                        <Link to={'/category/giay-nam'} className={cx('nav-item')}>
                            <span>Giày Nam</span>
                        </Link>
                        <Link to={'/category/giay-nu'} className={cx('nav-item')}>
                            <span>Giày Nữ</span>
                        </Link>
                        <Link to={'/category/giay-tre-em'} className={cx('nav-item')}>
                            <FontAwesomeIcon icon={faChild} />
                            <span>Giày Trẻ Em</span>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={cx('btn-menu-mobile')}>
                <button onClick={handleShowMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </div>
            <div className={cx('menu-mobile')}>
                <>
                    <Offcanvas show={show} onHide={handleClose} className={cx('mobile-menu')}>
                        <Offcanvas.Header closeButton>
                            <Link to={'/'}>
                                <img src={logo} alt="Logo" className={cx('mobile-logo')} />
                            </Link>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <div className={cx('mobile-search')}>
                                <input
                                    placeholder="Tìm Kiếm..."
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    value={searchValue}
                                />
                                <button><FontAwesomeIcon icon={faSearch} /></button>
                            </div>

                            <div className={cx('mobile-nav')}>
                                <Link to={'/'} className={cx('mobile-nav-item')} onClick={handleClose}>
                                    <FontAwesomeIcon icon={faHome} />
                                    <span>Trang Chủ</span>
                                </Link>
                                <Link to={'/category'} className={cx('mobile-nav-item')} onClick={handleClose}>
                                    <FontAwesomeIcon icon={faTshirt} />
                                    <span>Tất Cả Sản Phẩm</span>
                                </Link>
                                <Link to={'/category/giay-nam'} className={cx('mobile-nav-item')} onClick={handleClose}>
                                    <span>Giày Nam</span>
                                </Link>
                                <Link to={'/category/giay-nu'} className={cx('mobile-nav-item')} onClick={handleClose}>
                                    <span>Giày Nữ</span>
                                </Link>
                                <Link to={'/category/giay-tre-em'} className={cx('mobile-nav-item')} onClick={handleClose}>
                                    <FontAwesomeIcon icon={faChild} />
                                    <span>Giày Trẻ Em</span>
                                </Link>

                                {dataUser?._id && (
                                    <Link to={'/cart'} className={cx('mobile-nav-item')} onClick={handleClose}>
                                        <FontAwesomeIcon icon={faCartPlus} />
                                        <span>Giỏ Hàng</span>
                                    </Link>
                                )}

                                <Link to={dataUser?._id ? '/info' : '/login'} className={cx('mobile-nav-item')} onClick={handleClose}>
                                    <FontAwesomeIcon icon={faUserCircle} />
                                    <span>Thông Tin Người Dùng</span>
                                </Link>

                                {dataUser?.isAdmin && (
                                    <Link to={'/admin'} className={cx('mobile-nav-item', 'admin-link')} onClick={handleClose}>
                                        <span>Trang Quản Trị</span>
                                    </Link>
                                )}

                                {dataUser?._id && (
                                    <button className={cx('mobile-nav-item', 'logout-btn')} onClick={() => {
                                        handleLogOut();
                                        handleClose();
                                    }}>
                                        <FontAwesomeIcon icon={faSignOutAlt} />
                                        <span>Đăng Xuất</span>
                                    </button>
                                )}
                            </div>
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            </div>
        </div>
    );
}

export default Header;