import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,MessageBox,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog

} from 'element-ui'

Vue.use(Button)
.use(Form)
.use(FormItem)
.use(Input)
.use(Container)
.use(Header)
.use(Aside)
.use(Main)
.use(Menu)
.use(Submenu)
.use(MenuItem)
.use(Breadcrumb)
.use(BreadcrumbItem)
.use(Card)
.use(Row)
.use(Col)
.use(Table)
.use(TableColumn)
.use(Switch)
.use(Tooltip)
.use(Pagination)
.use(Dialog)

//在Vue上的prototype原型中挂载一个自定义的 $Message 应对于 element-ui 的 Message 组件 可全局使用
Vue.prototype.$Message = Message
Vue.prototype.$confirm = MessageBox.confirm


