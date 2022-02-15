import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import { Container, Header, Main, Footer, Row, Col, Menu, MenuItem, Carousel, CarouselItem, Message, Image, Popover, Dialog, Button, Form, FormItem, Input, Dropdown, DropdownMenu, DropdownItem, Pagination, Backtop, Table, TableColumn, Badge, Tooltip, MessageBox, Autocomplete } from 'element-ui'

Vue.use(Container)
.use(Header)
.use(Main)
.use(Footer)
.use(Row)
.use(Col)
.use(Menu)
.use(MenuItem)
.use(Carousel)
.use(CarouselItem)
.use(Image)
.use(Popover)
.use(Dialog)
.use(Button)
.use(Form)
.use(FormItem)
.use(Input)
.use(Dropdown)
.use(DropdownMenu)
.use(DropdownItem)
.use(Pagination)
.use(Backtop)
.use(Table)
.use(TableColumn)
.use(Badge)
.use(Tooltip)
.use(Autocomplete)

Vue.prototype.$msg = Message
Vue.prototype.$msgBox = MessageBox
