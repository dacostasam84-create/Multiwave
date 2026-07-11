require('')
const router = express.Router();
require('')
require('')

router.post('/', auth, OrdersController.createOrder);
router.get('/me', auth, OrdersController.getMyOrders);
router.get('/:id', auth, OrdersController.getOrderById);
router.put('/:id', auth, OrdersController.updateOrder);
router.delete('/:id', auth, OrdersController.deleteOrder);

module.exports = router;

