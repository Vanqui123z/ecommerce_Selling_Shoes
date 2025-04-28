import classNames from 'classnames/bind';
import styles from '../Styles/FeatureGrid.module.scss';

const cx = classNames.bind(styles);

function FeatureGrid() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <h2>SẢN PHẨM HOT TREND </h2>
                <div className={cx('img-grid')}>
                    <div className={cx('img-item')}>
                        <img
                            src="https://static.ftshp.digital/img/p/1/3/9/9/6/5/1/1399651-full_product.jpg"
                            alt="NIKE"
                        />
                        <span>NIKE</span>
                    </div>

                    <div className={cx('img-item')}>
                        <img
                            src="https://brand.assets.adidas.com/image/upload/global_adizero_aruku_originals_ss25_launch_hp_banner_hero_1_thumbnail_2156598a76.jpg"
                            alt="ADIDAS"
                        />
                        <span>ADIDAS</span>

                    </div>

                    <div className={cx('img-item')}>
                        <img
                            src="https://images.journeys.com/images/products/1_196753_FS_ALT1C.JPG"
                            alt="CONVERSE"
                        />
                        <span>CONVERSE</span>

                    </div>

                    <div className={cx('img-item')}>
                        <img
                            src="https://cdn.storims.com/api/v2/image/resize?path=https://storage.googleapis.com/storims_cdn/storims/uploads/7069bcf2a9138e864ecabeb108367c26.jpeg&format=jpeg"
                            alt="MLB"
                        />
                        <span>MLB</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeatureGrid;
