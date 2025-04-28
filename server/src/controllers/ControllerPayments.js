const axios = require('axios');
const crypto = require('crypto');
const ModelCart = require('../models/ModelCart');
const ModelPayment = require('../models/ModelPayment');
const ModelUser = require('../models/ModelUser');
const { jwtDecode } = require('jwt-decode');

const sendMailOrder = require('../SendMail/SendMailOrder');

require('dotenv').config();

class ControllerPayments {
    async getPayment(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        ModelPayment.findOne({ user: decoded.email })
            .sort({ _id: 'desc' })
            .then((data) => res.status(200).json([data]));
    }
    async PaymentCod(req, res) {
        try {
            const token = req.cookies.Token;
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const decoded = jwtDecode(token);
            if (!decoded || !decoded.email) {
                return res.status(400).json({ message: 'Invalid token' });
            }

            const cart = await ModelCart.findOne({ user: decoded.email });
            if (!cart || cart.products.length === 0) {
                return res.status(404).json({ message: 'Cart is empty' });
            }
            if (!cart.address || !cart.name || !cart.phone) {
                return res.status(403).json({ message: 'Bạn đang thiếu thông tin' });
            }

            const sumprice = cart.products.reduce((total, product) => total + product.price * product.quantity, 0);

            const newPayment = new ModelPayment({
                products: cart.products.map((product) => ({
                    nameProduct: product.nameProduct,
                    quantity: product.quantity,
                    price: product.price,
                    size: product.size,
                    img: product.img,
                    type: product.type,
                })),
                sumprice: sumprice,
                tinhtrang: false,
                trangthai: false,
                user: decoded.email,
                address: cart.address,
                phone: cart.phone,
                username: cart.name,
            });

            await sendMailOrder(decoded.email);
            await newPayment.save();
            await ModelCart.deleteOne({ user: decoded.email });
            res.status(200).json({ message: 'Thanh Toán Thành Công !!!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async getPayments(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        ModelPayment.find({ user: decoded.email }).then((data) => res.status(200).json(data));
    }

    async GetOrderUser(req, res) {
        ModelPayment.find({}).then((data) => {
            const newData = data.map((item) => item.products);
            return res.status(200).json(newData);
        });
    }

    async CancelOrder(req, res) {
        const { id } = req.body;
        ModelPayment.deleteOne({ _id: id }).then((data) => {
            return res.status(200).json({ message: 'Hủy đơn hàng thành công !!!' });
        });
    }
}

module.exports = new ControllerPayments();
